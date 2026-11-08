---
title: "Idempotency Keys Are a Consensus Problem: Notes From a Global Cache Rabbit Hole"
excerpt: "I set out to put a cache in front of every POST endpoint. Then the cache had to span regions, and 'global' and 'consistent' turned out to be two different asks. A design dump on Valkey, Bigtable, Spanner and a fan-out service I got a little too attached to."
date: "2026-11-07"
tag: "Tech"
cover: "/blog/idempotency-keys-are-a-consensus-problem/cover.png"
coverAlt: "Two translucent teal server towers on separate platforms with a glowing amber key between them, a clock on the dashed line to the right tower, and a faint second key arriving above it."
---

## A small feature with a big question

I recently built an idempotency layer for the POST endpoints on a platform I work on. The idea is old and good: if a client retries a request, the server should do the work once and hand back the same answer every time.

Mechanically, the first request with a given key claims it, does the work, and stores the result. Any later request with the same key finds the claim and returns the stored result instead of running again. The claim has to be atomic and it has to expire, which is why a cache is the natural home for it:

```text
SET idem:<key> in-progress NX EX 86400
```

`NX` means "only if the key doesn't exist yet". `EX` sets the expiry. One round trip, atomic, and it cleans up after itself.

The layer has two modes. In header mode the client sends the key. In body mode, the platform owner configures, per endpoint, which fields of the request body feed a derived key, so callers who have never heard of idempotency still get protection. I put a number of guardrails around both. Those are a post of their own. This one is about the problem the guardrails couldn't fix.

The cache was regional.

## Why "regional" is a problem

A retry doesn't promise to land where the first attempt did. Clients time out and come back through a different load balancer. A region fails over mid-request. An upstream service retries from somewhere else. If the claim lives only in region A and the retry arrives in region B, region B has never heard of the key, so it does the work again. On an endpoint that creates something or moves something, "again" is exactly the bug the layer exists to prevent.

The same shape shows up outside idempotency: UI sessions, short-lived shared state, anything many services touch with a small TTL. I'll use idempotency keys as the running example because they are the strictest version.

> Reads can be global cheaply. An exclusive claim cannot.

## What GCP gives you

I went through the data stores GCP offers and asked three things of each: where can writes land, what do other regions see, and how does expiry work?

| Store | Where writes can land | What other regions see | Expiry | The catch |
| --- | --- | --- | --- | --- |
| Memorystore for Valkey | One primary region | Read-only secondaries, async | Real TTL on the key | Single writer; a failover can lose recent writes |
| Bigtable | Any cluster | Eventual by default | Garbage collection by max age | No atomic claim across clusters |
| Spanner | Anywhere, through consensus | Strongly consistent | Row deletion policy | Write latency and cost |

Four details mattered more than the table suggests.

**Valkey is less regional than I first thought.** I started this believing Memorystore for Valkey had no cross-region story. It does. Cross-region replication has been generally available since 2025: one primary instance takes reads and writes, and secondary instances in other regions are read-only copies fed asynchronously ([docs](https://docs.cloud.google.com/memorystore/docs/valkey/about-cross-region-replication)). At launch Google supported up to two secondary regions ([GA announcement](https://cloud.google.com/blog/products/databases/announcing-general-availability-of-memorystore-for-valkey)), and the docs are upfront that a secondary which hasn't caught up can lose data if you promote it. So what's missing isn't replication. It's a second writer.

```diagram-write-path
```

**Bigtable has the writers but not the claim.** Every cluster accepts writes, replication is eventual by default, and conflicting writes to the same cell are settled by last-write-wins on server time ([replication overview](https://docs.cloud.google.com/bigtable/docs/replication-overview)). The conditional write that would implement a claim, check-and-mutate, only works with single-cluster routing, because single-row transactions can conflict under multi-cluster routing ([routing options](https://docs.cloud.google.com/bigtable/docs/routing)). So Bigtable's answer to "atomic claim" is "pick one home cluster". Remember that. It comes back.

**Spanner solves it and charges for it.** Paxos-based replication plus TrueTime gives it external consistency across regions ([Google](https://cloud.google.com/blog/products/databases/spanner-wins-the-2025-acm-sigmod-systems-award)). A write is a consensus round across replicas. That is exactly what buys the guarantee, and exactly why it costs more and answers slower than a cache.

**TTL doesn't always mean expiry.** Spanner's row deletion policy is background cleanup, not a read-time filter. The docs say TTL doesn't immediately hide expired rows from queries, and data is typically deleted within 72 hours of expiring ([Spanner TTL](https://docs.cloud.google.com/spanner/docs/ttl)). Bigtable's garbage collection runs with compaction, so expired cells can still show up in reads for a while ([walkthrough](https://oneuptime.com/blog/post/2026-02-17-how-to-configure-garbage-collection-policies-for-bigtable-column-families/view)). If a key should die after 24 hours, you have to compare an expiry timestamp yourself. A Valkey key past its TTL, by contrast, is simply gone.

For contrast, AWS sells the shape I wanted. MemoryDB Multi-Region is active-active and Valkey-compatible, replicates asynchronously, typically within a second, and resolves conflicts automatically ([announcement](https://aws.amazon.com/about-aws/whats-new/2024/12/general-availability-amazon-memory-db-multi-region)). ElastiCache Global Datastore is active-passive, like Memorystore ([AWS blog](https://aws.amazon.com/blogs/database/build-a-multi-region-session-store-with-amazon-elasticache-for-valkey-global-datastore)). But read "resolves conflicts" carefully: two writers can both succeed, and the system picks a winner afterward. That is convergence, not exclusion. Hold that thought.

## The idea I couldn't let go of

If the stores give me regional primaries, what if I put a service in front that makes them behave like one?

Picture a thin service, a Kubernetes pod or a Cloud Run service, sitting between callers and a Valkey instance in every region. A write goes to the service, and the service makes sure every region ends up with the key and value. A read goes to the nearest region's instance and answers locally. Callers see one put/get API and never think about regions.

The transport between regions could be Pub/Sub, or Apache Pulsar. Pulsar is the interesting one: brokers serve the traffic, BookKeeper nodes (the bookies) durably store the log, and geo-replication is built in. By default it is asynchronous, with messages persisted in the local cluster and then replicated by brokers, and it can also run synchronously through BookKeeper at a latency cost ([Pulsar docs](https://pulsar.apache.org/docs/concepts-replication/)). I liked the idea of the replication logic living in a system built for it, instead of in code I would have to write and then be on call for.

This is a design, not something I've shipped. I'm writing it down because the interesting part is where it breaks.

## Where it breaks

The big one is the race. Fan-out gives you convergence: eventually every region holds the same state. Idempotency needs exclusion: at most one request wins. Send the same key to two regions at the same moment and each region's `SET ... NX` succeeds locally. Replication then tells each region about the other's claim, but both callers have long since gone ahead.

```diagram-fanout-race
```

The rest is the usual distributed-systems list, and every item is a design decision, not a bug to fix:

- **Partial fan-out.** One region is down while the others accept a write. Do you queue and replay, fail the write, or accept the gap? Each answer is a different product.
- **Duplicate and reordered delivery.** Pub/Sub is at-least-once, and ordering keys give per-key order for messages published to the same region ([walkthrough](https://oneuptime.com/blog/post/2026-01-27-pubsub-message-ordering/view)). So the "apply this claim" step has to be idempotent itself. The replication path needs the very property I was trying to build.
- **TTL skew.** If each region starts the clock when it applies the message, the key expires at a different moment in each. Ship an absolute expiry time, not a duration.
- **Read-your-writes.** Write in region 1, retry lands in region 2 before the message does, and region 2 knows nothing.
- **A new global dependency.** The fronting service now has to scale horizontally, survive hot keys, apply backpressure when one region is slow, and not become the single point of failure for everything that uses the cache.
- **Cost.** Every write turns into cross-region traffic multiplied by the number of regions.

## Make the consistency match the cost of being wrong

The mistake was asking for one global cache. A better question is what a duplicate costs, because that decides how much consistency you are buying.

| Use case | What a duplicate or stale read costs | What I'd reach for |
| --- | --- | --- |
| Idempotency claim on a side-effecting endpoint | A repeated side effect | One owner region per key, or a strongly consistent store for just these keys |
| UI session | A re-login | Replicated reads with sticky routing; accept brief staleness |
| Read-mostly shared state | A stale read | Local read replicas |

For the claim, Bigtable's lesson repeats: an atomic claim needs a single point of decision. It doesn't need a single global one. It needs one per key. Hash the key to pick an owner region, send every claim for that key to the owner's primary, and the race disappears, because the owner serializes them.

```diagram-owner-region
```

The costs are honest ones. Requests that arrive away from the owner pay one cross-region hop. And if the owner region fails, you promote a secondary and the most recent claims, the ones that hadn't replicated, may be gone. So don't make the claim your only defense. Make the downstream write idempotent too, with a unique constraint on the business-level identifier, so a duplicate that slips through the window gets rejected at the source of truth. Belt and suspenders.

If the extra hop is unacceptable, or you want one fewer moving part, a small Spanner table for just the claims is a reasonable answer. You pay for consensus on a narrow slice of traffic, and you check the expiry column yourself because TTL is only cleanup. Sessions and other read-heavy state are a different problem, and replicated reads or a fan-out service are probably good enough there.

![The decision card: idempotency claims, UI sessions and read-mostly state, each paired with the approach I'd reach for.](/blog/idempotency-keys-are-a-consensus-problem/decision-card.png)

## What I'd test first

- **Kill a region mid fan-out.** See what partial delivery and replay actually do to a key.
- **Fire the same key at two regions at once.** Count the winners. The fan-out design should show two. Owner routing should show one.
- **Measure the hop.** Put the owner-region round trip next to a local write at the tail latencies the endpoints care about, and see whether it is acceptable.
- **Size the loss window.** After a failover, how many recent claims really go missing, and does the downstream constraint catch them?

I started this trying to cache some keys and ended up reading about consensus. If you've solved it differently, I'd like to hear how.

### Sources

- Memorystore for Valkey: [cross-region replication](https://docs.cloud.google.com/memorystore/docs/valkey/about-cross-region-replication) · [general availability announcement](https://cloud.google.com/blog/products/databases/announcing-general-availability-of-memorystore-for-valkey)
- Bigtable: [replication overview](https://docs.cloud.google.com/bigtable/docs/replication-overview) · [routing options](https://docs.cloud.google.com/bigtable/docs/routing) · [garbage collection walkthrough](https://oneuptime.com/blog/post/2026-02-17-how-to-configure-garbage-collection-policies-for-bigtable-column-families/view)
- Spanner: [TTL](https://docs.cloud.google.com/spanner/docs/ttl) · [TrueTime and external consistency](https://cloud.google.com/blog/products/databases/spanner-wins-the-2025-acm-sigmod-systems-award)
- Messaging: [Pulsar geo-replication](https://pulsar.apache.org/docs/concepts-replication/) · [Pub/Sub ordering walkthrough](https://oneuptime.com/blog/post/2026-01-27-pubsub-message-ordering/view)
- AWS comparison: [MemoryDB Multi-Region](https://aws.amazon.com/about-aws/whats-new/2024/12/general-availability-amazon-memory-db-multi-region) · [ElastiCache Global Datastore](https://aws.amazon.com/blogs/database/build-a-multi-region-session-store-with-amazon-elasticache-for-valkey-global-datastore)
