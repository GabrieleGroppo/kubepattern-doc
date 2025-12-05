---
sidebar_position: 1
id: what-is-pac
title: What is Pattern-as-Code
slug: /pattern-as-code/what-is-pac
---

# What is Pattern-as-Code?

**Pattern-as-Code (PaC)** is a declarative approach to defining Kubernetes patterns and best practices as structured, machine-readable definitions.

Instead of documenting patterns in prose or tribal knowledge, Pattern-as-Code captures the **architectural intent**, **resource relationships**, and **detection logic** in YAML or JSON files that can be version-controlled, shared, and automatically enforced.

---

## Core Concept

Each Pattern-as-Code definition describes:

- **What resources** are involved (Pods, Services, ConfigMaps, etc.)
- **How they relate** to each other (references, dependencies, ownership)
- **What constitutes** a violation or anti-pattern
- **Why it matters** (severity, category, impact)

KubePattern uses these definitions to **scan your cluster**, identify existing configurations, and detect violations automatically.

---

## Structure Overview

A Pattern-as-Code definition typically contains:

### Metadata
```json
{
  "metadata": {
    "name": "resource-limit-predictable-demands",
    "displayName": "Resource Limit Predictable Demands",
    "patternType": "FOUNDATIONAL",
    "severity": "WARNING",
    "category": "architecture",
    "description": "Ensures Pods have CPU and memory limits defined"
  }
}
```

### Resource Definitions
```json
{
  "spec": {
    "resources": [
      {
        "resource": "Pod",
        "id": "target-pod",
        "leader": true
      },
      {
        "resource": "Deployment",
        "id": "owning-deployment"
      }
    ]
  }
}
```

### Relationships
```json
{
  "relationships": [
    {
      "id": "pod-deployment-ownership",
      "type": "OWNED_BY",
      "resourceIds": ["target-pod", "owning-deployment"],
      "weight": 10,
      "required": true
    }
  ]
}
```

---

## How KubePattern Uses Pattern-as-Code

1. **Load Patterns**: KubePattern fetches pattern definitions from the registry
2. **Scan Cluster**: Analyzes your Kubernetes resources and their relationships
3. **Match Patterns**: Compares cluster state against pattern definitions
4. **Detect Violations**: Identifies resources that match anti-pattern criteria
5. **Generate Reports**: Creates `K8sPattern` CRDs with findings and recommendations

## Benefits

- **Consistency**: Standardized pattern definitions across teams and clusters
- **Automation**: Automatic detection without manual audits
- **Version Control**: Track pattern evolution in Git
- **Shareability**: Public registry of community patterns
- **Extensibility**: Create custom patterns for your organization
- **Documentation**: Self-documenting architecture through code

---

## Registry Structure

:::tip Explore The Offiacial Pattern Registry
Pattern-as-Code is constantly evolving! Check the [official registry](https://github.com/kubepattern/registry) for the latest patterns and contribute your own discoveries.
:::

The official KubePattern registry organizes patterns in a simple structure:
```
kubepattern-registry/
├── definitions/
│   ├── resource-limit-predictable-demands.json
│   ├── health-probe.json
│   ├── table-not-referenced.json
│   └── ...
├── doc/
│   ├── resource-limit-predictable-demands.md
│   ├── health-probe.md
│   └── ...
├── K8sPatternCRD.yaml
├── doc-template.md
├── short-doc-template.md
└── kubepattern-resources.yaml
```

Each pattern definition in `definitions/` has corresponding documentation in `doc/` explaining the problem, solution, and implementation examples.

---

## Example: Resource Limit Pattern

Here's a simplified Pattern-as-Code definition:
```json
{
  "version": "kubepattern.it/v1",
  "kind": "Pattern",
  "metadata": {
    "name": "resource-limit-predictable-demands",
    "severity": "WARNING",
    "category": "architecture"
  },
  "spec": {
    "message": "Pod {{target-pod.name}} is missing resource limits",
    "resources": [
      {
        "resource": "Pod",
        "id": "target-pod",
        "leader": true
      }
    ],
    "actors": ["target-pod"]
  }
}
```

When KubePattern scans your cluster and finds a Pod without `resources.limits` defined, it creates a `K8sPattern` CRD:
```yaml
apiVersion: kubepattern.it/v1
kind: K8sPattern
metadata:
  name: resource-limit-my-pod
spec:
  name: "Resource Limit Predictable Demands"
  severity: WARNING
  message: "Pod my-pod is missing resource limits"
  resources:
    - name: my-pod
      namespace: default
      role: target-pod
      uid: abc-123
```
