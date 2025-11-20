---
sidebar_position: 2
id: pac-api
title: Write Pattern-as-Code
slug: /pattern-as-code/pac-api
---

# Kubernetes Pattern Detection API Documentation

## API version `v1.1.0`

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

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | Yes | Name of the pattern (e.g., `my-pattern`) |
| `displayName` | string | Yes | Display name of the pattern (e.g., `My Pattern`) |
| `patternType` | enum | Yes | Type: `STRUCTURAL`, `BEHAVIORAL`, `FUNCTIONAL`, ... |
| `severity` | enum | Yes | Severity level: `CRITICAL`, `WARNING`, `INFO` |
| `category` | enum | Yes | Category: `BestPractice`, `Security`, `Reliability`, `Performance`, `CostOptimization` |
| `docUrl` | string | No | URL to pattern documentation |
| `gitUrl` | string | No | URL to Git repository containing pattern rules |
| `description` | string | No | Brief description of the pattern |

### `spec`

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `message` | string | Yes | Message displayed when pattern is matched |
| `topology` | enum | Yes | Topology: `LEADER_FOLLOWER`, `SINGLE` |
| `resources` | array | Yes | Array of resource definitions (minimum 1 required) |
| `relationships` | array | No | Array of relationship definitions between resources |
| `minRelationshipPoints`| integer| No | **New:** Minimum score required for `required: false` relationships to validate the pattern. Default: 0. |

### `spec.resources`

Each resource in the `resources` array must contain:

|Property|Type|Required|Description|
|---|---|---|---|
|`resource`|string|Yes|Kubernetes resource kind (e.g., "Pod", "Service", "Deployment")|
|`id`|string|Yes|Unique identifier for the resource within the pattern (e.g., `main-container`) |
|`leader`|boolean|(Req Single)| Specify if the resource is the leader (entry point of analysis). |
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
|`operator`|enum|Yes|Comparison operator (e.g., `EQUALS`, `CONTAINS`, `EXISTS`)|
|`values`|array|Conditional|Values to match against (not required for `Exists`/`NotExists`)|

### `spec.actors`

This is an array of `resourceIds` that cooperate in the pattern.

:::info
Actors must contain at least *one* resource for SINGLE Topology and at least *two* for LEADER_FOLLOWER Topology.
:::

### `spec.relationships` & `spec.commonRelationships`

Each relationship definition contains:

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | enum | Yes | Relationship type (see Supported Relationship Types) |
| `resourceIds` | array | Yes | Array of resource IDs participating in this relationship |
| `description` | string | No | Human-readable description |
| `weight` | float | No | Points awarded if the relationship matches logically (used only if `required: false`). |
| `required` | boolean | Yes | **Control Flag:** Determines if this is a Veto/Mandatory condition (`true`) or a Scoring condition (`false`). |
| `shared` | boolean | Yes | **Expected State:** `true` means the relationship MUST exist; `false` means it MUST NOT exist. |

---

## Pattern Matching Logic (Veto vs. Scoring)

The analysis engine uses a combination of strict boolean logic ("Veto") and point-based logic ("Scoring"), determined by the combination of the `required` and `shared` fields.

### 1. The Logic Matrix

The combination of `required` and `shared` defines four distinct behaviors:

| `required` | `shared` | Behavior | Logical Description |
| :--- | :--- | :--- | :--- |
| **TRUE** | **TRUE** | **MANDATORY** (Must Have) | The relationship **MUST exist**. If it is missing, the resource is immediately discarded. <br>*(Example: A Deployment must own a ReplicaSet)* |
| **TRUE** | **FALSE** | **VETO** (Must NOT Have) | The relationship **MUST NOT exist**. If found, the resource is immediately discarded. <br>*(Example: An orphan Table must NOT be connected to any Row)* |
| **FALSE** | **TRUE** | **SCORE (Positive)** | If the relationship exists, add `weight` to the total score. If missing, nothing happens (non-blocking). <br>*(Example: "Referenced By Any": points if connected to Row OR Panel)* |
| **FALSE** | **FALSE** | **SCORE (Negative)** | If the relationship **does NOT** exist, add `weight` to the total score. <br>*(Example: Preference for loose coupling/isolation)* |

### 2. Execution Flow

For each candidate "Leader" resource, the engine performs the following steps:

1.  **Veto Phase (Required Checks):**
    * All relationships with `required: true` are verified.
    * If even a single condition fails (e.g., finding a relationship when `shared: false`, or missing one when `shared: true`), the resource is **immediately filtered out**.

2.  **Scoring Phase (Scoring Checks):**
    * If the resource passes the Veto Phase, relationships with `required: false` are evaluated.
    * Points (`weight`) are added only if the logical condition is met (Positive or Negative match as per the matrix above).

3.  **Threshold Verification:**
    * The accumulated total score is compared against `spec.minRelationshipPoints`.
    * If `Total Score < minRelationshipPoints`, the resource is discarded.
    * Otherwise, it is a **MATCH**.

---

## Supported Relationship Types

| Type | Description / Example |
| :--- | :--- |
| `OWNS` | Deployment -> ReplicaSet |
| `MANAGES` | ReplicaSet -> Pod |
| `MOUNTS` | Pod -> Volume |
| `EXPOSES` | Service -> Pod |
| `USES_CONFIG` | Reference to ConfigMap/Secret |
| `SAME_NETWORK` | Network policies |
| `IS_NAMESPACE_OF` | Namespace -> Generic Resource |
| `USES_SA` | Pod -> ServiceAccount |
| `HAS_AFFINITY_TO` | Pod -> Pod |
| `REFERENCES_KRATEO` | Table -> Widget (Custom) |

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

## Example Usage

### Simple Sidecar Pattern

```json
{
    "version": "kubepattern.it/v1",
    "kind": "Pattern",
    "metadata": {
        "name": "sidecar",
        "displayName": "Sidecar",
        "patternType": "STRUCTURAL",
        "severity": "INFO",
        "category": "architecture",
        "description": "Identifies pods that should implement the sidecar pattern but are incorrectly separated."
    },
    "spec": {
        "message": "Pod '{{main-app.name}}' appears to be separated from its sidecar pod '{{sidecar.name}}'.",
        "topology": "LEADER_FOLLOWER",
        "resources": [
            {
                "resource": "Pod",
                "id": "main-app",
                "leader": true,
                "filters": {
                    "matchAny": [
                        { "key": ".metadata.labels.app", "operator": "EQUALS", "values": ["frontend", "backend"] }
                    ]
                }
            },
            {
                "resource": "Pod",
                "id": "sidecar",
                "filters": {
                    "matchAny": [
                        { "key": ".metadata.labels.app", "operator": "EQUALS", "values": ["logging", "monitoring"] }
                    ]
                }
            }
        ],
        "actors": [ "main-app", "sidecar" ],
        "commonRelationships": [
            {
                "id": "shared-volume-mount",
                "type": "MOUNTS",
                "description": "Both pods mount volumes with the same name.",
                "weight": 0.6,
                "required": true,
                "shared": true,
                "resourceIds": [ "main-app", "sidecar" ]
            }
        ],
        "minRelationshipPoints": 0
    }
}