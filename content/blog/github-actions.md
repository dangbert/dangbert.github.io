---
date: "2026-05-17"
title: GitHub Actions Still Not Dogfooding Immutable Releases
---

It's been frustrating to watch the hundreds of supply chain attacks this past year, with many stemming from the foot guns in the security model of Github Actions. To understand the problem, one only has to look at all the hoops Atral had to be aware of and [jump through to tighten their security footprint on Github](https://astral.sh/blog/open-source-security-at-astral).

Unfortunately this level of effort is unrealistic to expect for the entire community to be educated about.  I believe an approach like Google Cloud's ["Secure by default" philosophy](https://docs.cloud.google.com/architecture/framework/security/implement-security-by-design) would be more appropriate.

Github offers a little-known feature called [immutable releases](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases), which while not being the single silver bullet solution, I believe Github could better champion this feature as an example of good practices.  For example, the single most used action, `actions/checkout`, still doesn't use immutable releases as of May 2026 https://github.com/actions/checkout/issues/2316


This blog post was motivated by [a comment I left on Github](https://github.com/github/docs/pull/43716#issuecomment-4470321872) expresssing my thoughts on this situation.

additional references:
* https://nesbitt.io/2026/04/28/github-actions-is-the-weakest-link.html

