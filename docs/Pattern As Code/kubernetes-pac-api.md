---
sidebar_position: 4
id: pac-api
title: Pattern As Code API
slug: /pattern-as-code/pac-api
---
# Kubernetes Pattern Detection API Documentation

## API version `v1.0.0`

## Overview

The **Kubernetes Pattern Detection API** allows you to write **rules** to identify **Patterns** within the Kubernetes Cluster that might be suitable to improve _performance_, _compliance_, _modularity_, _observability_, _security_, and _reliability_.

## API Specification

### Pattern Schema Version

- **Version**: `kubepattern.it/v1`
- **Format**: YAML

## Pattern Definition Structure

### Root Level Properties

|Property|Type|Required|Description|
|---|---|---|---|
|`version`|string|Yes|Version of the pattern schema (`kubepattern.it/v1`)|
|`kind`|enum|Yes|Must be `Pattern`|
|`metadata`|object|Yes|Pattern metadata information|
|`spec`|object|Yes|Pattern specification|

### `metadata`

| Property      | Type   | Required | Description                                                                            |
| ------------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| `name`        | string | Yes      | Name of the pattern (es: my-pattern)                                                   |
| `displayName`        | string | Yes      | Name of the pattern (es: My Pattern)                                            |
| `patternType` | enum   | Yes      | Type: `STRUCTURAL`, `BEHAVIORAL`, `FUNCTIONAL`, ...                                    |
| `severity`    | enum   | Yes      | Severity level: `CRITICAL`, `WARNING`, `INFO`                                          |
| `category`    | enum   | Yes      | Category: `BestPractice`, `Security`, `Reliability`, `Performance`, `CostOptimization` |
| `docUrl`      | string | No       | URL to pattern documentation                                                           |
| `gitUrl`      | string | No       | URL to Git repository containing pattern rules                                         |
| `description` | string | No       | Brief description of the pattern                      								 |

### `spec`

| Property        | Type   | Required | Description                                         |
| --------------- | ------ | -------- | --------------------------------------------------- |
| `message`       | string | Yes      | Message displayed when pattern is matched           |
| `topology`      | enum   | Yes      | Topology: `LEADER_FOLLOWER`, `SINGLE`               |
| `resources`     | array  | Yes      | Array of resource definitions (minimum 1 required)  |
| `relationships` | array  | No       | Array of relationship definitions between resources |


### `spec.resources`

Each resource in the `resources` array must contain:

|Property|Type|Required|Description|
|---|---|---|---|
|`resource`|string|Yes|Kubernetes resource kind (e.g., "Pod", "Service", "Deployment")|
|`id`|string|Yes|Unique identifier for the resource within the pattern (es: main-container) |
|`leader`|boolean|(Requeired Single)| Specify if resource is leader or not. |
|`filters`|object|No|Filtering conditions for this resource|

### `spec.resources.filters`

|Property|Type|Required|Description|
|---|---|---|---|
|`matchAll`|array|No|All conditions must be met|
|`matchAny`|array|No|At least one condition must be met|
|`matchNone`|array|No|None of these conditions must be met|

### `spec.resources.filters.matchAll/Any/None[*]`

Each condition within filter arrays contains:

|Property|Type|Required|Description|
|---|---|---|---|
|`key`|string|Yes|JSONPath or key to match against|
|`operator`|enum|Yes|Comparison operator (es: EQUALS, CONTAINS, EXISTS)|
|`values`|array|Conditional|Values to match against (not required for `Exists`/`NotExists`)|

### `spec.actors`

This is an array of resourceIds, the one that cooperate in the pattern.

:::info

Actors must contain at least *one* resource for SINGLE Topology and at least *two* for LEADER_FOLLOWER Topology

:::

### `spec.relationships`

Each relationship in the `relationships` array contains:

|Property|Type|Required|Description|
|---|---|---|---|
|`type`|enum|Yes|Relationship type (see Supported Relationship Types)|
|`description`|string|No|Human-readable description of the relationship|
|`weight` | float | No | weight of relationship in confidence score|
|`required`|boolean|Yes|Whether this relationship is mandatory for pattern matching|
|`shared`|boolean|Yes|Specify if this relationship must or must no be shared|
|`resourceIds`|array|Yes|Array of resource IDs that participate in this relationship|

### `spec.commonRelationships`

Each relationship in the `commonRelationships` array contains:

|Property|Type|Required|Description|
|---|---|---|---|
|`type`|enum|Yes|Relationship type (see Supported Relationship Types)|
|`description`|string|No|Human-readable description of the relationship|
|`weight` | float | No | weight of relationship in confidence score|
|`required`|boolean|Yes|Whether this relationship is mandatory for pattern matching|
|`shared`|boolean|Yes|Specify if this relationship must or must no be shared|
|`resourceIds`|array|Yes|Array of resource IDs that participate in this relationship|

## Supported Relationship Types

| Tipo | Descrizione / Esempio |
| :--- | :--- |
| `OWNS` | Deployment -> ReplicaSet |
| `MANAGES` | ReplicaSet -> Pod |
| `MOUNTS` | Pod -> Volume |
| `EXPOSES` | Service -> Pod |
| `USES_CONFIG` | Riferimento a ConfigMap/Secret |
| `SAME_NETWORK` | Network policies |
| `IS_NAMESPACE_OF` | Namespace -> Generic Resource |
| `USES_SA` | Pod -> ServiceAccount |
| `HAS_AFFINITY_TO` | Pod -> Pod |

## Supported Operators

| Operator | Description |
| :--- | :--- |
| `EQUALS` | Exact match |
| `NOT_EQUALS` | Not equal to |
| `GREATER_THAN` | Greater than |
| `GREATER_OR_EQUAL` | Greater than or equal to |
| `LESS_THAN` | Less than |
| `LESS_OR_EQUAL` | Less than or equal to |
| `EXISTS` | Key exists |
| `NOT_EXISTS` | Key does not exist |
| `IS_EMPTY` | Is empty |


## JSONPath Key Syntax

The `key` property supports JSONPath-like syntax for accessing Kubernetes resource properties:

### Examples:

- `metadata.namespace` - Access resource namespace
- `metadata.labels['app']` - Access specific label
- `metadata.ownerReferences[*].uid` - Access owner reference UIDs
- `spec.containers[*].name` - Access all container names
- `spec.template.spec.containers[*].image` - Access container images in pod template
- `spec.volumes[*].name` - Access volume names
- `spec.nodeName` - Access assigned node
- `spec.hostNetwork` - Access host network setting

## Pattern Analysis Logic

### Execution Flow

## Leader Resource Logic
Here is that explanation formatted in English and Markdown.

-----

## Relationships vs. Common Relationships

In the context of resource graph analysis, relationships describe how entities are interconnected. Here is a key distinction:

### Relationships

A **Relationship** refers to a **direct edge (link) between two resources**. It describes a specific, often one-to-one or one-to-many, interaction or dependency.

  * **Concept:** Resource A -- Relationship --> Resource B.
  * **Example:** A `Deployment` manages a `ReplicaSet`.
    * `Deployment -- MANAGES --> ReplicaSet` 
  * **Use Case:** Useful for **filtering resources based on their direct neighbors** in the cluster.
      * *Example Query: "Find all `ReplicaSet` resources managed by this `Deployment`."*

### Common Relationships

A **Common Relationship** describes a scenario where **two or more source resources share the exact same relationship to a single, common destination resource**.

  * **Concept:** Multiple resources converging on a shared resource.
  * **Example:** Two different `Pods` both mount the exact same `Volume`. The `Volume` is the common resource.
    * `Pod A --MOUNTS--> Volume X <--MOUNTS-- Pod B`
  * **Use Case:** Useful for **filtering or scoring resources based on the common context and interactions** they have.
      * *Example Query: "Find all `Pods` that mount the same `Volume` as `Pod A`."*

## Example Usage

### Simple Sidecar Pattern

```yaml
{
    "version": "kubepattern.it/v1",
    "kind": "Pattern",
    "metadata": {
        "name": "sidecar",
        "displayName": "Sidecar",
        "patternType": "STRUCTURAL",
        "severity": "INFO",
        "category": "architecture",
        "gitUrl": "https://github.com/GabrieleGroppo/kubepattern-registry/tree/main/doc/sidecar-pattern.md",
        "docUrl": "https://github.com/GabrieleGroppo/kubepattern-registry/tree/main/doc/sidecar-pattern.json",
        "description": "Identifies pods that should implement the sidecar pattern but are incorrectly separated into different pods. The sidecar pattern places helper containers alongside the main application container in the same pod to share lifecycle, network, and storage resources. Common use cases include logging, monitoring, configuration management, and service mesh proxies."
    },
    "spec": {
        "message": "Pod '{{main-app.name}}' in namespace '{{main-app.namespace}}' appears to be separated from its sidecar pod '{{sidecar.name}}' in namespace '{{sidecar.namespace}}'. These pods share volumes and likely have a common lifecycle, suggesting they should be combined into a single pod with multiple containers. This would improve resource sharing, deployment atomicity, and reduce network overhead.",
        "topology": "LEADER_FOLLOWER",
        "resources": [
            {
                "resource": "Pod",
                "id": "main-app",
                "leader": true,
                "filters": {
                    "matchAll": [
                        {
                            "key": ".spec.volumes",
                            "operator": "EXISTS",
                            "values": []
                        }
                    ],
                    "matchNone": [
                        {
                            "key": ".metadata.namespace",
                            "operator": "EQUALS",
                            "values": [
                                "kube-system",
                                "kube-public",
                                "kube-node-lease",
                                "krateo-system"
                            ]
                        }
                    ],
                    "matchAny": [
                        {
                            "key": ".metadata.name",
                            "operator": "EQUALS",
                            "values": [
                                "application",
                                "frontend",
                                "backend",
                                "api",
                                "web",
                                "service"
                            ]
                        },
                        {
                            "key": ".metadata.labels.app",
                            "operator": "EQUALS",
                            "values": [
                                "frontend",
                                "backend",
                                "application"
                            ]
                        },
                        {
                            "key": ".metadata.labels.tier",
                            "operator": "EQUALS",
                            "values": [
                                "web",
                                "api",
                                "frontend",
                                "backend"
                            ]
                        }
                    ]
                }
            },
            {
                "resource": "Pod",
                "id": "sidecar",
                "filters": {
                    "matchAll": [
                        {
                            "key": ".spec.volumes",
                            "operator": "EXISTS",
                            "values": []
                        }
                    ],
                    "matchNone": [
                        {
                            "key": ".metadata.namespace",
                            "operator": "EQUALS",
                            "values": [
                                "kube-system",
                                "kube-public",
                                "kube-node-lease"
                            ]
                        }
                    ],
                    "matchAny": [
                        {
                            "key": ".metadata.name",
                            "operator": "EQUALS",
                            "values": [
                                "logging",
                                "logger",
                                "log",
                                "log-collector",
                                "log-shipper",
                                "fluentd",
                                "filebeat",
                                "logstash"
                            ]
                        },
                        {
                            "key": ".metadata.labels.app",
                            "operator": "EQUALS",
                            "values": [
                                "logging",
                                "logger",
                                "log-collector"
                            ]
                        },
                        {
                            "key": ".metadata.labels.component",
                            "operator": "EQUALS",
                            "values": [
                                "log-collector",
                                "log-shipper",
                                "logging",
                                "monitoring",
                                "metrics"
                            ]
                        }
                    ]
                }
            }
        ],
        "actors": [
            "main-app",
            "sidecar"
        ],
        "commonRelationships": [
            {
                "id": "shared-volume-mount",
                "type": "MOUNTS",
                "description": "Both pods mount volumes with the same name or emptyDir type, indicating they are intended to share storage. In a proper sidecar pattern, these containers should share the same pod-level volume.",
                "weight": 0.6,
                "required": true,
                "shared": true,
                "resourceIds": [
                    "main-app",
                    "sidecar"
                ]
            }
        ],
        "relationships": [
            
        ]
    }
}

```