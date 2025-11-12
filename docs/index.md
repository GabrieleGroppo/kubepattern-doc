---
sidebar_position: 1
title: Overview
---
# Overview

KubePattern is an innovative static analysis tool for Kubernetes manifests that goes beyond traditional linting, focusing on recognizing and suggesting cloud-native architectural patterns.

:::warning

KubePattern is also my Bachelor Degree Thesis Project and is **currently under development**. 
It will be fully open source on march 2026.

Have a look and stay tuned if you have further question please [contact me](https://docs.kubeoattern.it/contacts).

A special thanks to [Sigemi](https://www.sigemi.it/) and for the knoledge the tools and the opportunity to build KubePattern during my internship.

:::

## What is KubePattern?

KubePattern is a pattern-oriented validation tool that analyzes Kubernetes configurations to identify opportunities for applying architectural patterns and detect configuration "smells" that deviate from community best practices and corporate policies.

## Key Features

### Pattern-as-Code

KubePattern adopts a declarative approach where patterns are defined through external JSON files, enabling:
- **Extensibility**: Add new patterns without modifying the code
- **Customization**: Define patterns specific to corporate policies
- **Versioning**: Manage pattern evolution over time

### Architectural Pattern Recognition

Unlike traditional linters that only verify field presence, KubePattern:
- Identifies complex patterns such as **Sidecar**, **Health Probe**, **Predictable Demands**
- Analyzes relationships between multiple resources
- Provides contextual suggestions with reference documentation

### Scoring and Confidence System

Each detected pattern includes:
- **Confidence Level**: Probability that the pattern has been correctly identified (LOW/MEDIUM/HIGH)
- **Severity**: Criticality level (INFO/WARNING/CRITICAL)
- **Category**: Application scope (Reliability/Security/Performance)
- **Scores**: Detailed scores for each performed check

## Architecture

KubePattern is developed in **Java** and uses:
- **Official Kubernetes Java Client**: Library used to read and apply resources on the cluster
- **JsonPath**: Library used to interpret pattern definitions (JSON)
- **Custom Resource Definitions (CRD)**: Results are exposed as native Kubernetes resources

The tool creates Custom Resources (`K8sPattern`) that represent identified patterns, making results easily integrable with other Kubernetes tools.

## Output and Reporting

Analysis results are available as Kubernetes CRDs

### Custom Resource Definition (CRD)
```yaml
apiVersion: sigemi.it/v1
kind: K8sPattern
metadata:
  name: sidecar-pattern-0i9j-8k7l6m5n4o3p
  namespace: pattern-analysis-ns
spec:
  name: Sidecar
  type: Structural
  severity: INFO
  category: Reliability
  confidence: HIGH
  scores:
    shared-volume-mount: 60
    similar-replica-count: 40
  resources:
    - name: main-app
      namespace: development
      uid: 9a7b6c5d-4e3f-2g1h-0i9j-8k7l6m5n4o3p
    - name: fluent
      namespace: development
      uid: 1b2c3d4e-5f6g-7h8i-9j0k-1l2m3n4o5p6q
```

## Next Steps

- [Getting Started](./getting-started): Start using KubePattern
