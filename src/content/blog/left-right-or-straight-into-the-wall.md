---
title: "Left, Right, or Straight Into the Wall: Learning Diffusion Planning One Dumb Question at a Time"
excerpt: "A few reels about diffusion models in self-driving sent me down a rabbit hole, so I asked an AI every question I had, dumb ones included. This post follows those questions: why averaging crashes the car, how anchors fix it, where the noise really goes, and where RL fits."
date: "2026-11-22"
tag: "Tech"
cover: "/blog/left-right-or-straight-into-the-wall/cover.png"
coverAlt: "A glowing amber cube on a dark grid with a fan of glowing teal paths spreading ahead of it; one brighter path bends around a translucent block in the middle of the lane."
---

I don't work on self-driving cars. I build payment backends. But a few reels about "diffusion policies" kept showing up in my feed, and one claim stuck with me: the same family of models that makes images is now planning where cars go.

So I handled it the way I handle most rabbit holes now. I opened a chat with an AI and kept asking until it made sense. Some of my questions were good. Some were dumb. A couple were half-wrong in a useful way. The AI was wrong once too, and I only caught it by reading the paper.

This post follows those questions in the order I asked them, in my own words, lightly cleaned up. If you're new to this, your next question is probably the next heading.

## "So what is diffusion even doing in driving?"

Start with the problem it solves. A car is heading toward a box in the middle of its lane. Swerving left is fine. Swerving right is fine. Going straight is not.

Now train a normal policy on human drivers who did both. A standard RL or imitation policy outputs one Gaussian: a mean action and a spread. Half the data says left, half says right. The mean that fits both best sits in the middle, and the middle is the box.

```motion-averaging
```

> When the right answers sit on opposite sides, their average is often the one wrong answer.

Driving is full of these splits: pass or wait, merge now or after the truck, left or right around the double-parked van. A planner has to represent "either of these, but nothing in between". Diffusion models are good at exactly that, because they learn the shape of a distribution instead of a single best guess. [Diffusion Policy](https://arxiv.org/abs/2303.04137) showed it for robot arms in 2023, and driving planners followed.

## "How does it pick how many Gaussians to use, so it doesn't average left and right into nothing?"

This was my first real question, and it had a wrong assumption baked in. I assumed the model had to decide how many modes to keep, like a Gaussian mixture with K components. A mixture does need K picked in advance, and a driving scene doesn't tell you how many good options it has.

A diffusion model doesn't count modes at all. It learns a direction field: for any noisy action, which way makes it look more like real driving. The technical name is the score, the gradient of the log density. I found it easier to picture as a landscape where good maneuvers are valleys and bad ones are ridges.

Generating an action then looks like this:

1. Drop a random point anywhere (pure noise).
2. Take a small step downhill, with a bit less noise each time. Repeat.
3. Wherever it settles is the action.

```motion-score-valleys
```

The random starting point is what breaks the tie. A point that starts slightly left of the ridge rolls into the left valley and never feels the pull of the right one. Draw 20 samples and you get some of each, with none stuck in between. The number of modes comes out of the landscape. Nobody sets it.

[Diffuser](https://arxiv.org/abs/2205.09991) (2022) applied this to whole trajectories instead of single actions. It denoises the full plan at once, so every waypoint is decided together.

## "But I saw models that use N anchor paths, like an N-peak GMM, and then run the denoiser?"

Yes, and this is where it gets practical. Pure diffusion had two problems in cars.

The first is speed. A vanilla diffusion planner needs around 20 denoising steps. In the [DiffusionDrive](https://arxiv.org/abs/2411.15139) paper's benchmark (NAVSIM, one RTX 4090), that took 130 ms per plan, about 7 plans a second. A car replanning at 10 Hz has 100 ms per cycle for everything, perception included.

The second surprised me. In theory, random starting points spread into different valleys. In practice, for driving, the authors found that samples from different noise ended up as nearly the same trajectory. Diversity was the selling point, and it mostly wasn't there.

DiffusionDrive's fix is a hybrid:

- **Build a vocabulary.** Run K-means over the future trajectories in the training set, in the car's own frame (car at the origin, facing forward). DiffusionDrive keeps 20 cluster centers: gentle left, hard left, cruise, slow down, and so on. These are the anchors.
- **Start near the anchors, not from pure noise.** Add a small amount of noise to each anchor, then denoise for only 2 steps.
- **Score and pick.** A small head gives each of the 20 refined trajectories a confidence. The highest one drives.

So my N-peak mixture instinct was close. The anchors are the peaks, and the noise around each one makes a small Gaussian. The difference is what happens next. A mixture outputs its means. DiffusionDrive treats each anchor as a starting point and lets the denoiser bend it to the actual road.

```motion-anchor-denoise
```

The anchors guarantee coverage of the big intents. The denoiser handles what the anchors can't know about, like this road's curve or that parked car.

The numbers made the case for me:

```chart-denoise-latency
```

For context on "20": the earlier VADv2 used a fixed vocabulary of 4,096 anchors and only picked among them. A pure vocabulary has to be huge to cover every road, and it still misses the road that isn't in it. A small vocabulary plus a refiner covers more with less.

## "Do diffusion models add the noise as well?"

They do, in two different places. Mixing them up confused me for a while.

**In training**, noise is the whole trick. You take a clean example, corrupt it with a known amount of noise, and train the network to undo it. Because you chose the noise, you know the right answer, so it's ordinary supervised learning. The schedule controls the blend: mostly signal at small steps, almost all noise at large ones.

**At inference**, it depends on the model. Pure diffusion starts from pure noise, so there's nothing to add. Anchor-based models start from clean anchors, so they first add a small, fixed amount of noise to each one. That puts them at the noise level the denoiser was trained on.

One more detail I didn't know: some samplers (DDPM) inject a bit of fresh noise at every step on the way down, and others (DDIM) are deterministic. DiffusionDrive uses the DDIM update.

## "Wait, which path gets the noise? And what is the clean path? (A picture might help.)"

This question paid for the whole conversation.

The AI's first answer said that in training you add noise to the ground-truth trajectory, the path the human actually drove. That sounded reasonable, and I almost moved on. Then I read the paper. It says the opposite: the noise goes on the **anchors**.

Here is what one training step actually does:

1. Take the human's trajectory and find the anchor closest to it. That one is the positive. The other 19 are negatives.
2. Add a small amount of noise to the anchors. DiffusionDrive cuts the noise schedule short so the noise stays shallow.
3. The denoiser takes the noisy anchors and the scene. For the positive, its output must match the **human's trajectory**, measured by a plain L1 distance.
4. Separately, the score head learns to output 1 for the positive and 0 for the negatives (binary cross-entropy).

```motion-which-path-noised
```

So the clean path is the ground truth. It is only ever the target, and in this setup it never gets noise. Training noises the same thing inference does, the anchors. That's why it works at test time: the model has practiced turning "a noisy version of a generic left turn" into "the specific left turn a good driver made here".

> The AI was confident and wrong on the one detail that decides how the whole thing trains. The paper took five minutes to check.

I'm not saying this to dunk on the tool. Most of what it told me held up. But it's the lesson I keep relearning with agentic coding: fluent and correct look identical until you check.

## "After denoising, does it land on the anchor, or somewhere near the ground truth?"

Near the ground truth. It follows from the loss: the network is never rewarded for returning the anchor. If it just snapped back to the anchor, the diffusion part would be pointless. You'd have a 20-way classifier, which fails every time a road doesn't match one of 20 shapes.

The analogy that stuck for me: the anchor is a stencil. Noise loosens its lines. The denoiser redraws the path in the stencil's general direction, but along this lane, around this car, at this speed.

## "I assume this prevents swing… no, I mean zig-zag back to the middle"

My question was clumsy here, and that turned out to be useful. I said "swing", and the AI answered a different question, about the chosen mode flickering between frames. What I meant was worse. Frame 1: drift a little left. Frame 2: from there, right looks just as good, so drift a little right. Frame 3: left again. Each decision is fine on its own. Together they cancel back to the middle and drive at the box, just more slowly than the Gaussian did.

It's the averaging problem again, spread across time instead of inside one prediction. It happens because most planners are stateless. Every 100 ms they plan from scratch, with no memory of what they committed to.

```motion-zigzag
```

The fix is less settled than the anchor part, so treat this section as my engineering read, not a paper summary:

- **Reuse the last plan.** Shift the previous trajectory forward one tick, move it into the car's new frame, add a little noise, and denoise only a few steps. A small amount of noise can't push it over the ridge into the other valley, so the commitment holds unless the scene really changes. Robot learning does this for speed and smoothness: methods like RTI-DP and Falcon [warm-start from the previous action](https://arxiv.org/abs/2602.08245), and one planning paper reports needing [a single denoising step per frame](https://arxiv.org/abs/2409.17995) once warm-started.
- **Condition on history.** Driving work has leaned this way: feed past plans in as context. [Diffusion Forcing Planner](https://arxiv.org/abs/2606.11019) (CVPR 2026) gives the past, present and future parts of a trajectory their own noise levels and lets history guide the rest.
- **Keep escape routes.** Run the warm-started branch next to fresh anchor branches every frame. If a new hazard blocks the committed path, a fresh branch wins the score. I'd also add a small switching penalty in the scorer, so changing your mind takes a real reason. That's hysteresis, the reason a good thermostat doesn't flicker.

## "Where does RL actually come in?"

Everything so far is imitation: copy good drivers. RL is how you get past "as good as the data". It shows up in two main ways.

**Guide the policy with a value function.** [Diffusion-QL](https://arxiv.org/abs/2208.06193) (ICLR 2023) trains a Q-function next to the diffusion policy and adds a loss term that pushes sampled actions toward higher Q, while the diffusion loss keeps them close to the data. A cheaper cousin at inference time is best-of-N: sample many candidates, score each with a critic or safety cost, run the best. DiffusionDrive's scoring head is already a version of that.

**Fine-tune the sampler on rewards.** The newer approach treats the whole denoising chain as the policy and fine-tunes it with GRPO, the group-relative method popular for training LLMs. Sample a group of trajectories, score each in simulation, and push up the ones that beat the group average. No separate value network needed.

[DiffusionDriveV2](https://arxiv.org/abs/2512.07745) has the detail I liked most. Pure imitation only supervises the anchor nearest the human, so the other 19 modes are never told they're bad, and many of them are junk the scorer has to filter out. RL can fix that, but you can't put every sample in one group. A turn and a straight path aren't comparable, and ranking them against each other pushes the model to collapse onto one intent. So it compares samples **within each anchor only**.

```motion-group-ranking
```

Across anchors it uses a cruder signal: improvements count, negative advantages are clipped to zero, and collisions get a flat penalty. It also explores by stretching the whole path, along it and sideways, instead of jittering each waypoint, so explored trajectories stay drivable. The result: 91.2 PDMS on NAVSIM v1, up from 88.1. The honest trade-off is in their own numbers. Diversity dropped from 42.3 to 30.3 while quality rose. Fewer options, better ones.

Other work fine-tunes diffusion planners with GRPO for driving style ([Drive As You Like](https://arxiv.org/abs/2508.16947)) or for closed-loop robustness ([PlannerRFT](https://arxiv.org/abs/2601.12901)). The pattern is the same: imitation for a sane prior, RL to sharpen it.

## What I'd take away as an engineer

I came for self-driving and left with patterns I'll reuse, in ML systems and in plain backend work.

- **Averaging is a silent failure.** Any time a system blends valid options (two configs, two retry strategies, two model outputs), check whether the blend is itself valid. Often it's the worst choice on the table.
- **Discrete prior, continuous refiner.** Anchors plus a denoiser is a general shape: a small vocabulary of known-good starting points, then a model that adapts one to the case at hand. Templates plus fine-tuning, routing plus generation, a cache plus revalidation.
- **The latency budget picks the architecture.** The best method on paper lost to the one that fit in 100 ms. Going from twenty steps to two wasn't a tweak. It decided whether this could drive at all.
- **Statelessness has a cost.** Replanning from scratch every tick is clean, but without memory a system can be right at every moment and wrong over time.
- **Read the source on the detail that matters.** An AI got me 90% of the way in an hour. The last 10% was one paragraph in the paper.

## Further reading

- Liao et al., [DiffusionDrive: Truncated Diffusion Model for End-to-End Autonomous Driving](https://arxiv.org/abs/2411.15139), CVPR 2025 ([code](https://github.com/hustvl/DiffusionDrive))
- Zou et al., [DiffusionDriveV2: Reinforcement Learning-Constrained Truncated Diffusion Modeling](https://arxiv.org/abs/2512.07745)
- Zheng et al., [Diffusion-Based Planning for Autonomous Driving with Flexible Guidance](https://arxiv.org/abs/2501.15564), ICLR 2025
- Chi et al., [Diffusion Policy: Visuomotor Policy Learning via Action Diffusion](https://arxiv.org/abs/2303.04137), RSS 2023
- Janner et al., [Planning with Diffusion for Flexible Behavior Synthesis](https://arxiv.org/abs/2205.09991), ICML 2022
- Wang et al., [Diffusion Policies as an Expressive Policy Class for Offline RL](https://arxiv.org/abs/2208.06193) (Diffusion-QL), ICLR 2023
- [Diffusion Forcing Planner: History-Annealed Planning with Time-Dependent Guidance](https://arxiv.org/abs/2606.11019), CVPR 2026

The videos that started this were "Diffusion Drives: Adaptive Self-Driving" (AI Research Roundup) and "RL using Diffusion Models! Planning with diffusion for flexible behavior synthesis" (RR with deku), both on YouTube.
