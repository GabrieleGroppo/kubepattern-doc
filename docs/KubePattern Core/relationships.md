---
sidebar_position: 4
id: relationships
title: Relationships
slug: /kubepattern-core/relationships
---
# Relationships

In KubePattern, a **Relationship** defines the fundamental, directed link between different Kubernetes resources. These connections are the core mechanism KubePattern uses to understand your application's complete architecture from its static manifests. Unlike traditional linters that inspect resources in isolation, KubePattern identifies these links by analyzing specific fields in the YAML definitions to map the dependencies and boundaries between components.

By establishing this web of relationships, KubePattern builds a comprehensive **Resource Graph**. This graph is the essential foundation that enables the tool to move beyond simple validation and recognize the complex, multi-resource architectural patterns described in the [Pattern Catalog](https://github.com/GabrieleGroppo/kubepattern-registry).

## Defined Relationships

### `MOUNTS` : Pod -> Volume

Connects a `Pod` to a `Volume` via the `spec.volumes` and `spec.containers.volumeMounts` fields.

### `IS_NAMESPACE_OF` : Namespace -> *Generic Resource*

Associates a `Namespace` with any resource contained within it via the `metadata.namespace` field.

### `OWNS` : Deployment -> ReplicaSet

Links a controller like a `Deployment` to a `ReplicaSet` through the `metadata.ownerReferences` field.

### ...

