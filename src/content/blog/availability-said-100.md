---
title: "Availability Said 100%. The Service Was Down: What a Restart Loop Taught Me About Monitoring"
excerpt: "A service I depend on reported perfect availability for a full day while most of my calls to it timed out. Both were true. On restart loops, where you measure, and the signals that would have caught it."
date: "2026-11-14"
tag: "Tech"
cover: "/blog/availability-said-100/cover.png"
coverAlt: "A dashboard gauge reading 100 percent beside a row of server pods, one of them flickering between on and off."
draft: true
---

## The deploy that was supposed to lower errors

I shipped a feature that should have brought an error rate down. For the first hour, nothing happened. Then the rate started climbing.

The delay made sense once I looked at what drives the traffic. This path is triggered by event delivery, and volume ramps. Around a hundred events an hour had become closer to ten thousand, and the errors grew with it.

My application logs were clean. The errors were nearly all 504s, a handful of 503s, and one code I had never seen before: 533.

## Following the 504s

The failing call went to a downstream service. I wrote that service too, but it runs on a different platform that another team operates. My first guess was that I had broken my own code over there.

I hadn't. The service looked healthy. Its availability metric, the one our alerting watches, had been at 100% the entire time. No alert had fired.

Then I looked at the pod. It was restarting, over and over.

## Why 100% was true and useless

The metric is the standard one: successful requests divided by total requests, times 100. The catch is in the word *total*. It means total requests the service received.

While the pod was up, it answered everything that reached it. While it was restarting, nothing reached it. Those requests timed out at the gateway and came back to me as 504s. The pod never saw them, so it never counted them.

```diagram-availability-gap
```

> An availability number measured inside a service cannot see the requests that never arrived.

This is a known blind spot, and I wish I had known it sooner. Google's SRE Workbook says of a server-log measurement that it [will miss requests that fail to reach the backend](https://sre.google/workbook/implementing-slos/). Google's guidance for calls between services is blunt: [record from the client side, not the server side](https://cloud.google.com/blog/products/gcp/building-good-slos-cre-life-lessons/).

My side had the truth the whole time. I was just looking at the other side's dashboard to decide whether to believe it.

## What was actually wrong

The short version of the root cause: the service ran a single worker. That worker's event loop got stuck trying to send tracing data. A stuck worker can't answer anything, including the health endpoint.

Kubernetes then did exactly what it is designed to do. A container that keeps failing its liveness probe [gets restarted by the kubelet](https://kubernetes.io/docs/concepts/workloads/pods/probes/). The new container came up, took traffic, got stuck the same way, and was restarted again.

Three things stand out to me in hindsight:

- **One worker is one point of failure.** A single blocked call became a full outage, because there was nobody else to answer.
- **Telemetry was on the request path.** The code whose only job is to help me see problems was able to cause one.
- **The restart hid the evidence.** Each restart "fixed" the pod for a few minutes, which made it look healthy at any moment I happened to check, and wiped the state that would have explained it.

There is an irony here I can't leave out. The tracing that took the service down exists so that I can observe it.

## Reading the error codes

A status code tells you what happened. The gateway usually knows why, and it will tell you if you ask.

If your gateway or mesh is built on Envoy, each access-log line carries a response flag next to the code. A 504 flagged `UT` means [the upstream request timeout fired](https://www.netdata.cloud/guides/envoy/index.xml). A 503 comes with flags such as [`UH` for no healthy upstream or `UF` for a failed connection](https://oneuptime.com/blog/post/2026-02-24-how-to-handle-upstream-connection-errors-in-istio/markdown). One test I now use first: if the caller's side logs a 503 and the destination has no matching entry, [the request never reached it](https://oneuptime.com/blog/post/2026-02-24-how-to-debug-503-errors-using-istio-access-logs/markdown).

As for 533, it isn't a standard HTTP status code. Different vendors use it for different things: one CDN defines it as [an upstream TLS error](https://http.dev/533), another as [a connection timeout to the origin over HTTPS](https://tencentcloud.com/document/product/228/32922). The lesson is to look up what your own gateway means by a code before reasoning from it.

## The signals that would have caught it

The usual frameworks are a good start. Google's [four golden signals](https://clickhouse.com/resources/engineering/golden-signals) are latency, traffic, errors and saturation. RED (rate, errors, duration) looks at a service from the request side. USE (utilization, saturation, errors) looks at the resources underneath.

All three describe a service that is running. None of them asks whether it is there at all. So I now add a fourth lens: lifecycle.

| Signal | Where to measure it | Would it have fired here? |
| --- | --- | --- |
| Success ratio | At the caller or the gateway | Yes |
| Latency, p95 and p99 | At the caller | Yes |
| Traffic received against traffic sent | Both ends, compared | Yes |
| Restart count | The pod | Yes, and first |
| Ready replicas against desired | The deployment | Yes |
| Probe failures | Kubernetes events | Yes |
| Saturation: busy workers, event-loop lag | The pod | Probably the earliest |
| Gateway response reasons | Ingress and egress | Yes |
| A synthetic call through the real path | Outside the system | Yes |

Almost every row would have caught it. The one metric we alerted on is the one row that couldn't.

Two of these deserve a note. A restart alert is cheap and standard; a common rule fires when a container's restart counter [rises more than a few times in five minutes](https://oneuptime.com/blog/post/2025-11-27-probes-auto-healing/markdown). And comparing traffic sent with traffic received is the cleanest tell for this exact failure: the caller kept sending, and the service saw gaps.

## The hops in between are services too

I owned the code on both ends of this call and still couldn't see the failure, because the part that broke sat between and underneath them.

Ingress and egress are pods as well. They restart, they saturate, and they have to scale when traffic climbs. If they scale slowly, the caller sees the same family of gateway errors, and neither application has anything in its logs.

So the same four lenses apply to the path, not just the endpoints: errors and latency per route, saturation, restarts, and whether scaling kept up with demand.

## What we changed

The fix on the service took about a day. The changes that matter more are the ones around it:

1. **Alerts on the caller's view.** Success ratio and latency for this dependency, measured from our side.
2. **Alerts on lifecycle.** Restarts and ready replicas, so a loop pages someone on the first few cycles.
3. **A written map of the path.** Every hop from our service to theirs, who owns it, and what healthy looks like at each one.
4. **A named escalation chain.** Who to call on the platform side and on ours, agreed before the next incident, not during it.

The last two aren't technical, and they would have saved the most time. Most of that day went on finding the right people, not on finding the bug.

## The short version

Availability is a fine metric. It is a bad *only* metric. Measure it where the caller is, watch whether the thing is alive and not just whether it answers, and know who owns every hop in between.

### Sources

- Measuring from the right place: [Google SRE Workbook, Implementing SLOs](https://sre.google/workbook/implementing-slos/) · [Google Cloud, Building good SLOs](https://cloud.google.com/blog/products/gcp/building-good-slos-cre-life-lessons/)
- Kubernetes: [Liveness, readiness and startup probes](https://kubernetes.io/docs/concepts/workloads/pods/probes/) · [Restart alert example](https://oneuptime.com/blog/post/2025-11-27-probes-auto-healing/markdown)
- Gateway errors: [Envoy 504 and the UT flag](https://www.netdata.cloud/guides/envoy/index.xml) · [Upstream connection errors in Istio](https://oneuptime.com/blog/post/2026-02-24-how-to-handle-upstream-connection-errors-in-istio/markdown) · [Debugging 503s from access logs](https://oneuptime.com/blog/post/2026-02-24-how-to-debug-503-errors-using-istio-access-logs/markdown)
- Frameworks: [The four golden signals, RED and USE](https://clickhouse.com/resources/engineering/golden-signals)
- The 533 code: [http.dev](https://http.dev/533) · [Tencent Cloud status codes](https://tencentcloud.com/document/product/228/32922)
