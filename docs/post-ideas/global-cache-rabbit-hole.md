# Post idea: I tried to make a regional cache global (idempotency keys are a consensus problem in disguise)

Status: DRAFTED and WIRED 2026-11-07 as src/content/blog/idempotency-keys-are-a-consensus-problem.md (draft: false, cover and decision card placed, on the home list). Not yet deployed. Kept generic on purpose: no employer or internal details. Written as a design essay (the fan-out service is described as a design, not shipped). Original starter outline from Aditya's voice dump follows, plus one research pass. Format: thought bubble / design-ideation dump, not a tutorial.

Tags: [A] Aditya's idea or claim, from the dump. [R] researched, source linked. [+] angle I'm suggesting, not yet Aditya's. [?] verify before publishing. [!] correction to the dump.

## Title and thesis

Working title: Idempotency keys are a consensus problem in disguise
Alternates:
- I tried to make a regional cache global
- Everything GCP gives you for a global cache, and what I'd build on top

Thesis [+]: "a global, consistent cache" is two different asks. Idempotency keys need an atomic check-and-set (only one request may claim a key). Sessions and shared state mostly need cheap reads everywhere. Picking the consistency model per use case, not per datastore, is the real design decision.

## Heads-up before drafting (read this first)

- [!] The dump says Memorystore for Valkey has no multi-region support. It does: cross-region replication, GA since mid-2025. One primary region takes writes, up to two secondary regions are read-only, replication is async, and a lagging secondary can lose data on failover. [R] https://docs.cloud.google.com/memorystore/docs/valkey/about-cross-region-replication and https://cloud.google.com/blog/products/databases/announcing-general-availability-of-memorystore-for-valkey. The "up to two secondaries" limit was true at the GA post, so [?] re-check the current limit. The accurate claim is: no multi-writer / active-active, so no globally writable consistent cache. That is still a good post, and it is a stronger one because it survives a reader saying "but CRR exists".
- [!] Wording: "idempotency", "Valkey" (Redis fork), "Apache Pulsar" with brokers and bookies (BookKeeper). Spanner's strong consistency comes from TrueTime plus Paxos replication [?] confirm which one you meant by the acronym in the dump.
- [!] Work content: this is PayPal platform work. Check internal policy and get sign-off. Keep it generic: no service names, no internal numbers, no customer or case details. The design problem stands on its own without them.
- [!] The fan-out idea as described (GKE service pushes to every region via Pub/Sub or Pulsar) gives eventual consistency, not strong consistency. The post is stronger if it says so, and then shows what you'd add if you do need strong. See section 5.

## Outline (talking points, add your voice)

### 1. Hook: the feature I was building [A]
- An idempotency layer in front of every POST endpoint on the platform, backed by a cache.
- Two modes: client-sent idempotency header, or a key derived from the request body.
- Body mode is configured per endpoint: the platform owner picks which body fields / JSON paths feed the key.
- "A lot of cool restrictions" on top. [?] List them here. Candidates only you can fill in: key length / charset, TTL bounds, in-flight request handling, payload-mismatch rejection, per-tenant scoping.
- Then the problem: the cache is regional.

### 2. Why global matters [A]
- A retry can land in another region (failover, load balancer, client retry after timeout).
- Same need shows up for UI sessions and anything many services hit with a short TTL.
- Cost of getting it wrong, per use case: duplicate charge vs. a re-login. [+] This sets up section 5.

### 3. The GCP survey: what I tried [A] + facts [R]
Table idea (one row per option; fill the gaps):
| Option | Regions | Consistency | TTL | Catch |
|---|---|---|---|---|
| Memorystore for Valkey | one, plus CRR read replicas [R] | strong in-region, async cross-region | native key TTL | single writer region, failover can lose data [R] |
| Bigtable | multi-cluster replication | eventual across clusters [?] | GC policy (max age) [?] | eventual, no atomic cross-region claim |
| Spanner | multi-region | strong | row deletion policy (per-row TTL) [A] | cost and write latency [A] |
- Honest framing: Spanner solves it, and the pushback is cost and latency. Say what the latency actually was if you measured it. [A][?]
- For comparison [R]: AWS already sells this shape. MemoryDB Multi-Region is active-active Valkey-compatible, async, propagating typically within a second with automatic conflict resolution. ElastiCache Global Datastore is active-passive, like Memorystore CRR. https://aws.amazon.com/about-aws/whats-new/2024/12/general-availability-amazon-memory-db-multi-region
- [?] DynamoDB global tables with multi-Region strong consistency also showed up in search results as GA (2025). Verify before mentioning.

### 4. The idea I got excited about [A]
- A thin service (GKE pod or Cloud Run) in front of N regional Valkeys.
- Writes go to the service, which makes sure every region gets the key/value. Reads go to any region's local Valkey.
- Replication transport: Pub/Sub, or Apache Pulsar (brokers + bookies) for stronger delivery guarantees. [A]
- Upstream callers see one simple "put/get" API and never think about regions.
- [+] Diagram: write path and read path, two regions minimum, with the fan-out in the middle.
- [+] Note for the Pulsar leg: Pulsar has built-in geo-replication between clusters. [?] Check whether it removes the need for your own fan-out service.

### 5. Where it gets hard [A] (the part readers will like)
Failure and scaling questions, one line each, answer or admit you don't know:
- A region is down during a write: queue and replay, or fail the write? [A]
- Partial fan-out: 2 of 3 regions have the key. Who reconciles? [A]
- Duplicate or reordered delivery per key (Pub/Sub ordering keys vs. Pulsar key-shared). [+]
- Two regions claim the same idempotency key at the same instant. Async fan-out cannot stop that. This is the heart of the post. [+]
- TTL skew: each region starts the clock at a different moment. [+]
- Read-your-writes: the client writes in region A, the retry hits region B before the message arrives. [+]
- The fronting service becomes the new global dependency. Horizontal scaling, hot keys, backpressure. [A]
- Cross-region egress cost grows with every extra region. [+]

### 6. Maturing the idea [A] + options [+]
Pick by use case, not one answer:
- Idempotency keys (need atomic claim): route each key to a single owner region (hash of key), or send just these keys to Spanner with a row deletion policy. Atomic claim without a consensus step does not exist.
- Sessions (tolerate eventual): Valkey CRR with sticky routing, or the fan-out service, with a short window of staleness accepted.
- Read-heavy shared state: CRR secondaries or the fan-out service, nearest-region reads.
- Cheapest safe fallback for idempotency: accept rare duplicates in the failover window, and make the downstream write dedupe too (defense in depth).
- State a decision rule: "what does a duplicate cost?" decides the consistency level.

### 7. Close
- What I'd build first, what I'd test (failure injection: kill a region mid-fan-out), what is still open.
- [A] The tone Aditya asked for: a design-ideation dump, honest about unknowns. A short "things I haven't solved" list is a feature, not a flaw.

## Gaps only Aditya can fill
1. The list of restrictions on the idempotency layer (section 1).
2. Real latency or cost numbers for the Spanner option, if measured.
3. Did you prototype the fan-out service, or is it still a design? This changes the whole tone (build report vs. design essay).
4. Which of the section 6 options you'd pick today.
5. Is Pulsar a real candidate at work, or a thought experiment?

## Site wiring when it's drafted
Per docs/FEATURE_RECIPES.md recipe 4: src/content/blog/<slug>.md with frontmatter, images in public/blog/<slug>/ (register sizes in IMAGE_SIZES in PostBody.tsx), add to PUBLISHED_POSTS in src/app/page.tsx, remove any matching placeholder in UPCOMING in src/app/blog/page.tsx. A comparison table works out of the box. Diagrams can follow the Blueprint / EgmFlow SVG pattern in src/components/blog/diagrams/.
