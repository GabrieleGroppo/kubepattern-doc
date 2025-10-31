---
sidebar_position: 1
---
# Resource Graph

## Graph-Based Architecture Analysis

KubePattern utilizes a sophisticated **graph-based model** to represent and analyze Kubernetes clusters, enabling deep pattern recognition through relationship analysis between resources.

## Graph Structure

### Vertices: Kubernetes Resources
Each vertex in the graph represents a Kubernetes resource, including:
* **Standard Resources**: Deployments, Services, ConfigMaps, Secrets, PersistentVolumeClaims, etc.
* **Custom Resource Definitions (CRDs)**: Any CRD currently supported by the tool
* **Resource Metadata**: Each vertex contains essential information like UID, name, namespace, kind, apiVersion, and labels

### Edges: Resource Relationships
Edges represent the relationships between resources. Supported relationship types include:
* **OWNS**: Ownership relationships (e.g., Deployment → ReplicaSet → Pod)
* **MOUNTS**: Volume mounting relationships (e.g., Pod → ConfigMap/Secret)
* **EXPOSES**: Service exposure relationships (e.g., Service → Pod)
* **REFERENCES**: Generic reference relationships between resources
* **SCHEDULES**: Scheduling constraints and affinities
* ...

## Analysis Workflow

### 1. Graph Construction Phase
Before pattern analysis begins, KubePattern builds a comprehensive cluster graph:

```
Cluster Resources → Graph Vertices
Resource Relationships → Graph Edges
```

The tool scans the cluster thorough [Official Java Client for Kubernetes](https://github.com/kubernetes-client/java) and:
1. Identifies all supported resources and adds them as vertices
2. Analyzes resource specifications to detect relationships
3. Creates directed edges between related resources with appropriate relationship types

### 2. Pattern Matching Through Neighbors
Pattern detection leverages **neighbor analysis** with specific requirements:

* **Neighbor Matching**: The tool examines adjacent vertices (neighbors) in the graph
* **Relationship Filtering**: Only relationships of specific types are considered for each pattern

For example, to detect a **Sidecar Pattern**:
```
Main Container (vertex) 
  ↓ [MOUNTS relationship]
Shared Volume (vertex)
  ↑ [MOUNTS relationship]
Sidecar Container (vertex)
```

### 3. Pattern-as-Code Role Mapping
Resources defined in Pattern-as-Code specifications are mapped to graph nodes with specific roles:

* Each pattern definition specifies **resource roles** (e.g., "main-container", "sidecar", "shared-volume")
* During analysis, the engine searches for subgraph patterns matching these role relationships
* Resources participating in detected patterns are identified by their position and connections in the graph

## Benefits of Graph-Based Analysis

### Intuitive Pattern Logic
The graph representation makes pattern logic more natural and understandable:
* **Visual Reasoning**: Patterns can be conceptualized as subgraph structures
* **Relationship-Centric**: Focus on "how resources connect" rather than just "what resources exist"
* **Compositional**: Complex patterns emerge from simple relationship combinations

### Efficient Pattern Detection
Graph algorithms enable efficient pattern matching:
* **Traversal Optimization**: Navigate relationships without scanning all resources
* **Scalability**: Graph operations scale well with cluster size

### Flexible Pattern Definition
The graph model supports sophisticated pattern requirements:
* **Multi-hop Relationships**: Analyze indirect connections (e.g., "all pods exposed by a service that mounts a specific secret")
* **Contextual Analysis**: Consider the broader resource context beyond direct relationships
* **Negative Patterns**: Detect anti-patterns by identifying missing or incorrect relationships

## Example: Sidecar Pattern Detection

```java
// Simplified pattern matching logic
1. Find all Pods (vertices)
2. Filter pods
3. For each Pod, check neighbors via MOUNTS relationship
4. Identify shared volumes mounted by multiple containers
5. Calculate confidence score based on relationship strength
```

The graph structure allows KubePattern to ask questions like:
* "Which containers share volume mounts?"
* "Do these containers belong to the same Pod?"
* "Are their replica counts similar?"

## Technical Implementation

Based on the provided code, KubePattern's graph implementation uses:
* **JGraphT Library**: Industry-standard graph data structure
* **SimpleGraph**: Undirected graph allowing bidirectional relationship traversal
* **Custom Query Methods**: 
  - `getNeighbours()`: Retrieve connected resources by relationship type
  - `sameNeighbour()`: Check if two resources share common neighbors
  - `getResourcesByKind()`: Filter vertices by Kubernetes resource kind

## Visualization and Export

The graph can be serialized to JSON format, enabling:
* **Graph Visualization**: Integration with external visualization tools
* **Pattern Debugging**: Inspect detected subgraphs
* **Documentation**: Generate architectural diagrams from live clusters

---

This graph-based approach transforms static manifest analysis into **architectural pattern recognition**, making KubePattern a powerful tool for understanding and improving Kubernetes deployments.