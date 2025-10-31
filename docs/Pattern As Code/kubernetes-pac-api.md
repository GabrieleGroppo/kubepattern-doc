# Kubernetes Pattern Detection API Documentation

## API version `v1.0.0`

## Overview

The **Kubernetes Pattern Detection API** allows you to write **rules** to identify **Patterns** within the Kubernetes Cluster that might be suitable to improve _performance_, _compliance_, _modularity_, _observability_, _security_, and _reliability_.

## API Specification

### Pattern Schema Version

- **Version**: `kubepattern.sigemi.it/v2`
- **Format**: YAML

## Pattern Definition Structure

### Root Level Properties

|Property|Type|Required|Description|
|---|---|---|---|
|`version`|string|Yes|Version of the pattern schema (`kubepattern.sigemi.it/v2`)|
|`kind`|enum|Yes|Must be `Pattern`|
|`metadata`|object|Yes|Pattern metadata information|
|`spec`|object|Yes|Pattern specification|

### `metadata`

| Property      | Type   | Required | Description                                                                            |
| ------------- | ------ | -------- | -------------------------------------------------------------------------------------- |
| `name`        | string | Yes      | Name of the pattern                                                                    |
| `patternType` | enum   | Yes      | Type: `Structural`, `Behavioral`, `Functional`, ...                                    |
| `severity`    | enum   | Yes      | Severity level: `Critical`, `Warning`, `Info`, `Debug`                                 |
| `category`    | enum   | Yes      | Category: `BestPractice`, `Security`, `Reliability`, `Performance`, `CostOptimization` |
| `docUrl`      | string | No       | URL to pattern documentation                                                           |
| `gitUrl`      | string | No       | URL to Git repository containing pattern rules                                         |
| `patternURI`  | string | No       | Reference to documentation about the pattern                                           |

### `spec`

| Property        | Type   | Required | Description                                         |
| --------------- | ------ | -------- | --------------------------------------------------- |
| `description`   | string | Yes      | Brief description of the pattern                    |
| `message`       | string | Yes      | Message displayed when pattern is matched           |
| `globalFilters` | object | No       | Conditions that must be met for all resources       |
| `resources`     | array  | Yes      | Array of resource definitions (minimum 1 required)  |
| `relationships` | array  | No       | Array of relationship definitions between resources |
| `shared`        | array  | No       | Generic shared conditions between resources         |

### `spec.globalFilters`

|Property|Type|Required|Description|
|---|---|---|---|
|`matchAll`|array|No|All conditions must be met|
|`matchAny`|array|No|At least one condition must be met|
|`matchNone`|array|No|None of these conditions must be met|

### `spec.resources`

Each resource in the `resources` array must contain:

|Property|Type|Required|Description|
|---|---|---|---|
|`resource`|string|Yes|Kubernetes resource kind (e.g., "Pod", "Service", "Deployment")|
|`id`|string|Yes|Unique identifier for the resource within the pattern|
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
|`operator`|enum|Yes|Comparison operator|
|`mode`|enum|No|Matching mode (default: "Any")|
|`values`|array|Conditional|Values to match against (not required for `Exists`/`NotExists`)|

### `spec.relationships`

Each relationship in the `relationships` array contains:

|Property|Type|Required|Description|
|---|---|---|---|
|`type`|enum|Yes|Relationship type (see Supported Relationship Types)|
|`description`|string|No|Human-readable description of the relationship|
|`resourceIds`|array|Yes|Array of resource IDs that participate in this relationship|
|`required`|boolean|Yes|Whether this relationship is mandatory for pattern matching|
|`conditions`|array|Yes|Array of conditions that define the relationship|

### `spec.relationships.conditions[*]`

Each condition in a relationship contains:

|Property|Type|Required|Description|
|---|---|---|---|
|`key`|string|Yes|JSONPath to the field being compared|
|`operator`|enum|Yes|Comparison operator|
|`mode`|enum|No|Matching mode (default: "Any")|
|`shared`|boolean|No|Whether the value must be shared between resources|
|`values`|array|Conditional|Expected values (not required for shared comparisons)|

## Supported Relationship Types

|Type|Description|Use Case|
|---|---|---|
|`SharedNamespace`|Resources must be in the same namespace|Co-location requirement|
|`SameNode`|Resources should be scheduled on the same node|Low-latency communication|
|`SameAttributes`|Resources should share specific attributes|Consistency requirements|
|`ParentChild`|Resources must belong to the same parent resource|Ownership relationship|
|`SameParentDifferentContainers`|Different containers in the same pod template|Multi-container patterns|
|`SharedLabels`|Resources should share common labels|Application grouping|
|`SharedVolume`|Resources should share volumes|Data exchange|
|`NetworkProximity`|Resources should be network-accessible|Communication requirement|

## Supported Operators

|Operator|Description|Applicable To|
|---|---|---|
|`Equals`|Exact match|All types|
|`NotEquals`|Not equal to|All types|
|`Contains`|Contains substring|Strings|
|`NotContains`|Does not contain substring|Strings|
|`In`|Value is in the list|All types|
|`NotIn`|Value is not in the list|All types|
|`Exists`|Key exists|All types|
|`NotExists`|Key does not exist|All types|
|`GreaterThan`|Numeric greater than|Numbers|
|`LessThan`|Numeric less than|Numbers|

## Supported Modes

|Mode|Description|
|---|---|
|`All`|All values must match|
|`Any`|At least one value must match (default)|
|`None`|No values must match|
|`One`|Exactly one value must match|

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

```yaml
version: kubepattern.sigemi.it/v2
kind: Pattern
metadata:
  name: sidecar-pattern
  patternType: Structural
  severity: Warning
  category: BestPractice
  docUrl: https://docs.sigemi.it/patterns/sidecar

spec:
  description: |
    Identifies configurations suitable for Sidecar pattern application
  
  leader: "main-app"
  message: "Sidecar pattern detected for {{resource.kind}} {{resource.metadata.name}} in namespace {{resource.metadata.namespace}}"
  
  globalFilters:
    matchNone:
    - key: metadata.namespace
      operator: In
      values: ["kube-system", "kube-public"]
  
  resources:
  - resource: "Pod"
    id: "main-app"
    filters:
      matchAll:
      - key: metadata.labels['app']
        operator: Exists
      - key: spec.containers
        operator: GreaterThan
        values: [1]
  
  - resource: "Pod"
    id: "potential-sidecar"
    filters:
      matchAll:
      - key: spec.containers[*].image
        operator: Contains
        mode: Any
        values: ["prometheus", "fluentd", "envoy"]
  
  relationships:
  - type: SharedNamespace
    description: "Sidecar must be in same namespace as main app"
    resourceIds: ["main-app", "potential-sidecar"]
    required: true
    conditions:
    - key: "metadata.namespace"
      operator: Equals
      shared: true
  
  - type: SharedLabels
    description: "Should share application labels"
    resourceIds: ["main-app", "potential-sidecar"]
    required: false
    conditions:
    - key: "metadata.labels['app']"
      operator: Equals
      shared: true
```

### Complex Multi-Resource Pattern

```yaml
version: kubepattern.sigemi.it/v2
kind: Pattern
metadata:
  name: microservice-communication
  patternType: Behavioral
  severity: Info
  category: Reliability

spec:
  description: |
    Identifies microservice communication patterns with proper service mesh integration
  
  leader: "frontend-service"
  message: "Microservice communication pattern identified"
  
  resources:
  - resource: "Service"
    id: "frontend-service"
    filters:
      matchAll:
      - key: metadata.labels['tier']
        operator: Equals
        values: ["frontend"]
  
  - resource: "Service"
    id: "backend-service"
    filters:
      matchAll:
      - key: metadata.labels['tier']
        operator: Equals
        values: ["backend"]
  
  - resource: "Deployment"
    id: "frontend-deployment"
    filters:
      matchAll:
      - key: spec.template.metadata.labels['tier']
        operator: Equals
        values: ["frontend"]
  
  relationships:
  - type: SharedNamespace
    resourceIds: ["frontend-service", "backend-service", "frontend-deployment"]
    required: true
    conditions:
    - key: "metadata.namespace"
      operator: Equals
      shared: true
  
  - type: SharedLabels
    resourceIds: ["frontend-service", "frontend-deployment"]
    required: true
    conditions:
    - key: "metadata.labels['app']"
      operator: Equals
      shared: true
  
  shared:
  - key: "metadata.labels['version']"
    ids: ["frontend-service", "frontend-deployment"]
    shared: true
    operator: Equals
  
  - key: "spec.selector.app"
    ids: ["frontend-service", "frontend-deployment"]
    shared: true
    operator: Equals
```

## Pattern Analysis Logic

### Execution Flow

1. **Global Filter Application**: Apply `globalFilters` to all cluster resources
2. **Resource Matching**: Find resources matching each `resources` definition
3. **Relationship Validation**: Validate all `relationships` between matched resources
4. **Shared Condition Checking**: Verify all `shared` conditions
5. **Leader Selection**: If `leader` is specified, group results by leader resource
6. **Pattern Reporting**: Generate pattern matches with appropriate messages

### Leader Resource Logic

- If `leader` is specified, only combinations where the leader resource is present are reported
- This reduces false positives and complexity in analysis (prevents n! combinations)
- The leader resource becomes the primary identifier for the pattern instance

## Best Practices

1. **Use specific resource IDs** to improve pattern readability
2. **Define clear relationship types** appropriate to your pattern
3. **Set `required: true`** for essential relationships
4. **Use `leader` for complex patterns** to reduce false positives
5. **Provide meaningful descriptions** for relationships
6. **Test relationship conditions** thoroughly
7. **Use `shared` conditions** for generic cross-resource validation
8. **Apply appropriate `globalFilters`** to exclude system namespaces

## Error Handling

The API should handle the following error cases:

- Invalid YAML syntax
- Missing required fields (`version`, `kind`, `metadata`, `spec`)
- Invalid relationship types
- Circular relationship dependencies
- Invalid resource IDs in relationships
- Invalid JSONPath expressions in conditions
- Conflicting shared conditions