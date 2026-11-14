# Post idea: Availability said 100%. The service was down.

Status: researched outline from Aditya's voice dump, 2026-11-14. Not drafted. Format: incident story, then a field guide to what to monitor.

Tags: [A] Aditya's account or claim. [R] researched, source linked. [+] angle I'm suggesting. [?] verify before publishing. [!] correction or caution.

## Title and thesis

Working title: Availability said 100%. The service was down.
Alternates:
- The pod that was 100% available and never there
- Your availability metric only counts the requests that made it

Thesis [A][+]: an availability number computed from the requests a service handled cannot see the requests it never received. A pod in a restart loop answers everything it gets while it is up and nothing while it is down, so its own success ratio stays perfect. Monitor from the caller's side, monitor the pod's lifecycle, and monitor the hops in between.

## Read before drafting

- [!] Work incident, and the RCA belongs to another team. Keep it generic (no product, team or vendor names, no RCA text), and run the employer policy check, same as the idempotency post.
- [?] "ATB" in the dump: I've read it as the availability metric your alerting uses (successful requests / requests handled). Confirm the expansion and how it is computed. The whole argument rests on *where* it is measured.
- [!] 533 is not a standard HTTP status code. It is not in the IANA registry, and vendors use it for different things: one CDN defines it as an upstream TLS error, another as an origin connection timeout on HTTPS. [R] https://http.dev/533 and https://tencentcloud.com/document/product/228/32922. So the post should say "a non-standard code from our gateway" and [?] state what *your* gateway means by it.
- [?] Sidecar vs. ambient, and "the ingress could not scale because HPA missed heartbeats": this is the RCA's claim and I could not check it. Present it as what happened in your case, not as a general rule.
- [+] The dump says "inference metrics". I've read that as "infra metrics".

## Outline (talking points, add your voice)

### 1. Hook: the deploy that should have lowered errors [A]
- Shipped a feature expecting the error rate to drop. An hour or two later it climbed instead.
- App logs clean. Dashboards green. Errors were almost all 504s, a few 503s, and a 533 I had never seen.
- The delay is part of the story: nothing failed at deploy time. [?] Do you know why it took an hour or two (traffic ramp, slow build-up in the stuck worker)?

### 2. Following the 504s [A]
- The failing call went to a downstream service I had also written, hosted on another platform.
- First suspicion: my own code. It was healthy.
- Its availability metric: 100%, the whole time. No alert fired.
- The pod was restarting over and over.

### 3. Why 100% was true and useless [A] + [R]
- While the pod was up it served everything it received. While it was down, requests never reached it, so they were never counted. The failures showed up only on my side, as gateway timeouts.
- This is a known blind spot. Google's SRE Workbook notes that a measurement taken from server logs misses requests that fail to reach the backend. [R] https://sre.google/workbook/implementing-slos/
- Google's guidance for calls between microservices is to record from the client side, not the server side, and as close to the caller as possible. [R] https://cloud.google.com/blog/products/gcp/building-good-slos-cre-life-lessons/
- [+] Diagram: a timeline with pod up/down bands. Requests in the "up" bands are counted and succeed; requests in the "down" bands hit the gateway and never enter the denominator.

### 4. The root cause, generically [A] + [R]
- One worker process. Its event loop blocked while trying to send tracing data. It stopped answering, including the health endpoint.
- Kubernetes did what it is told to do: a container that keeps failing its liveness probe gets restarted by the kubelet. [R] https://kubernetes.io/docs/concepts/workloads/pods/probes/
- A failing readiness probe is the gentler tool: the pod is taken out of the Service's endpoints and keeps running. [R] same page.
- [+] Three lessons hiding in here: (a) one worker means one stuck call is a full outage; (b) telemetry export sat on the request path and was allowed to block; (c) a restart "fixed" it each time, which hid the cause and reset the evidence.
- [?] Which probe was failing, liveness or both? What runtime (the dump says "event loop")? Was the tracing export synchronous, or did a full buffer block? Only say what the RCA supports.

### 5. Reading the error codes [R]
- In an Envoy-based gateway or mesh, the access log carries a response flag next to the status code that says why. 504 with UT is an upstream request timeout. 503 with UH means no healthy upstream, and 503 with UF means the connection to the upstream failed. [R] https://oneuptime.com/blog/post/2026-02-24-how-to-understand-envoy-response-flags-in-istio-access-logs/view
- One useful test from the same family of guides: if the caller's proxy logs a 503 and the destination has no matching log line, the request never arrived. [R] https://oneuptime.com/blog/post/2026-02-24-how-to-debug-503-errors-using-istio-access-logs/view
- [?] Only use this section if your gateway is Envoy-based. If not, swap in your gateway's equivalent.
- 533: non-standard, see the caution above.

### 6. What good monitoring looks like [A] + [R]
Three frameworks, one line each [R] https://clickhouse.com/resources/engineering/golden-signals :
- Four golden signals (Google SRE): latency, traffic, errors, saturation.
- RED (rate, errors, duration): the request-side view of a service.
- USE (utilization, saturation, errors): the resource-side view.
- [+] The point for this post: all three describe a service that is *running*. None of them asks "is it there?". Add a fourth lens: lifecycle.

Table idea (the signal, where to measure it, and whether it would have caught this):
| Signal | Measure at | Would it have fired? |
|---|---|---|
| Success ratio | Caller / gateway, not the callee | Yes |
| Latency p95/p99, split by success and failure | Caller | Yes |
| Traffic received vs. traffic sent | Both ends, compared | Yes: the callee saw dips the caller did not send |
| Restart count | Pod | Yes, first |
| Ready replicas vs. desired | Deployment | Yes |
| Probe failures | Kubelet events | Yes |
| Saturation (workers busy, event-loop lag, queue depth) | Pod | Probably, earliest |
| Gateway response flags (UT, UH, UF) | Ingress / egress | Yes |
| Synthetic probe through the real path | Outside | Yes |
- Restart alerts are standard practice; a common rule alerts when the container restart counter rises more than a few times in a short window. [R] https://oneuptime.com/blog/post/2025-11-27-probes-auto-healing/markdown
- [+] "Traffic received dropped while callers kept sending" is the cleanest single tell for this failure, and almost nobody alerts on it.

### 7. The hops in between are services too [A]
- Ingress and egress are pods. They restart, saturate and scale like anything else. [A]
- Monitor them with the same four lenses: errors and latency per route, saturation, restarts, and whether autoscaling kept up. [+]
- Your sidecar vs. ambient and slow-scaling points go here, framed as what you saw. [A][?]

### 8. Close: own the whole path [A]
- I owned the code on both ends and still could not see the failure, because the part that broke was in between and underneath.
- Checklist to end on [+]: measure availability where the caller is; alert on restarts and ready replicas; compare sent vs. received; keep telemetry off the request path; never run one worker; read the gateway's reason, not just the code.

## Gaps only Aditya can fill
1. What ATB stands for and where it is measured.
2. What your gateway means by 533.
3. Why the failure took an hour or two to appear.
4. Which probe failed and how the tracing export blocked (as far as the RCA lets you say).
5. What you changed afterwards: which alerts now exist. This is the strongest possible ending.

## Site wiring when drafted
Recipe 4 in docs/FEATURE_RECIPES.md. The timeline diagram can follow the SVG pattern in src/components/blog/diagrams/ (Box.tsx helper).
