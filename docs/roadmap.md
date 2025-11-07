---
sidebar_position: 3
id: roadmap
title: Roadmap
slug: /roadmap
---
# 👣 Roadmap
Welcome to our public roadmap! This is where you can see what I am working on, what I have planned for the near future, and what ideas I am considering.

:::warning

This roadmap represents my current vision and priorities. It is not a delivery promise, and features or timelines may change based on user feedback, market opportunities, or technical challenges.

:::
---

## 🚀 Now (In Progress)

*Features and improvements we are actively building **right now**.*

* [ ] **Refactoring** Improving code quality
* [ ] **ChroneJob** Building a chronejob to trigger pattern analysis
* [ ] **Analysis report** A report to summarize analysis (patterns hits/errors/...)

## 🎯 Next (Planned)

*Features I will be working on **immediately after** what's currently in progress.*

* [ ] **API to build patterns with AI** Build patterns using AI based on you current cluster context and Online Kubernetes Best Practices.
    * [ ] set resource limit based on number of crashes.
* [ ] **Resource Status Heuristic:** es: resource limit based on number of crashes...
* [ ] **Dynamic Analysis:** Dynamic analysis to improve complex patterns confidence score precision.

## 🤔 Later (Considering)

*Popular ideas and requests I am evaluating for the future. Your feedback here is crucial to help prioritize!*

* [ ] **Relationship As Code:** Defining relationships through json or yaml.
* [ ] **Score pattern confidence using AI:** AI Scoring.
* [ ] **Web dashboard:** View Patterns and Resource Graph in a web dashboard.
* [ ] **Composable patterns:** make patterns use other patterns to reduce pattern duplications.
* [ ] **JQ queries for filters:** using more powerful jq queries for filtering resource (they are also more complex to build).

## ✅ Recently Launched

*The big features recentely launched 🚀*

* [x] **Pattern As Code Linter:** Lint your pattern as code with API and prevent malformed pattern from being analyzed.
* [x] **CRD output:** A CRD output for found patterns. 
