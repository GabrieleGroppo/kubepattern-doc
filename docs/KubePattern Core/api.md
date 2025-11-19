---
sidebar_position: 3
id: api
title: API
slug: /kubepattern-core/api
---

# API

KubePattern exposes a RESTful API for programmatic interaction with the pattern analysis engine and cluster graph visualization.

## Base URL
```
http://<kubepattern-service>:8080
```

---

## Endpoints

### 1. Get Cluster Graph
Retrieves the complete cluster graph in JSON format.

```http
GET /cluster/graph
```

**Description**: Returns the graph representation of all Kubernetes resources and their relationships.

**Response**:
```json
{
  "clusterName": "kubernetes-cluster",
  "clusterUrl": "https://127.0.0.1:32771",
  "graph": {
    "vertices": [
      {
        "uid": "802cec69-8204-4d0f-957f-a1f12b656ffd",
        "apiVersion": "apps/v1",
        "kind": "ReplicaSet",
        "name": "my-dep-59d477984",
        "namespace": "default",
        "labels": {
          "app": "my-dep",
          "pod-template-hash": "59d477984"
        }
      },
      {
        "uid": "d5a3c3d7-f1df-4eba-a07c-1c9c36e540e9",
        "apiVersion": "v1",
        "kind": "Service",
        "name": "kubernetes",
        "namespace": "default",
        "labels": {
          "component": "apiserver",
          "provider": "kubernetes"
        }
      }
    ],
    "edges": [
      {
        "source": "default.apps/v1.Deployment.my-dep",
        "type": "OWNS",
        "target": "default.apps/v1.ReplicaSet.my-dep-59d477984"
      },
      {
        "source": "default.v1.Service.nginx-service",
        "type": "EXPOSES",
        "target": "default.v1.Pod.nginx"
      }
    ]
  }
}
```

**Status**: `200 OK`

---

### 2. Analyze Entire Cluster
Starts pattern analysis across all cluster namespaces.

```http
POST /analyzeCluster
```

**Description**: Triggers asynchronous analysis of all resources against Pattern-as-Code registry. Results are created as `K8sPattern` CRDs.

**Response**: `Cluster analysis started`

**Status**: `200 OK`

---

### 3. Analyze Namespace
Starts pattern analysis for a specific namespace.

```http
POST /analyzeNamespace/{namespace}
```

**Parameters**:
- `namespace` (path): Target namespace name

**Example**:
```bash
curl -X POST http://kubepattern-api:8080/analyzeNamespace/production
```

**Response**: `Namespace analysis started`

**Status**: `200 OK`

---

## K8sPattern CRD Structure

Analysis results are stored as Kubernetes Custom Resources:

```yaml
apiVersion: kubepattern.it/v1
kind: K8sPattern
metadata:
  creationTimestamp: "2025-10-31T10:18:52Z"
  generation: 1
  name: sidecar-509164000
  namespace: pattern-analysis-ns
  resourceVersion: "265320"
  uid: a72126e1-bcb6-4ddc-889f-03668723388b
spec:
  apiVersion: kubepattern.it/v1
  confidence: HIGH
  description: Identifies pods that should implement the sidecar pattern but are incorrectly
    separated into different pods. The sidecar pattern places helper containers alongside
    the main application container in the same pod to share lifecycle, network, and
    storage resources. Common use cases include logging, monitoring, configuration
    management, and service mesh proxies.
  message: Pod 'frontend' in namespace 'production' appears to be separated from its
    sidecar pod 'logging' in namespace 'production'. These pods share volumes and
    likely have a common lifecycle, suggesting they should be combined into a single
    pod with multiple containers. This would improve resource sharing, deployment
    atomicity, and reduce network overhead.
  name: sidecar
  referenceLink: https://github.com/GabrieleGroppo/kubepattern-registry/tree/main/doc/sidecar-pattern.json
  resources:
  - name: frontend
    namespace: production
    role: main-app
    uid: a6ff6d51-eb41-46e7-bd05-059e60fbfe50
  - name: logging
    namespace: production
    role: sidecar
    uid: 29969762-31ee-45f9-99ac-0252ead4ad2b
  scores:
  - category: Relationship
    score: 10
  - category: AI
    score: 50
  severity: INFO
  type: STRUCTURAL
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `apiVersion` | string | Pattern definition version (e.g., kubepattern.it/v1) |
| `name` | string | Pattern name (e.g., sidecar, health-probe) |
| `type` | string | Pattern type (STRUCTURAL, BEHAVIORAL, CONFIGURATION) |
| `description` | string | Detailed pattern description and use cases |
| `referenceLink` | string | Documentation URL pointing to pattern registry |
| `message` | string | Contextual recommendation or informational message specific to detected resources |
| `severity` | enum | `INFO`, `WARNING`, `CRITICAL` |
| `confidence` | enum | `LOW`, `MEDIUM`, `HIGH` |
| `category` | enum | `Reliability`, `Security`, `Performance` |
| `suppress` | boolean | Flag to suppress false positives |
| `scores` | array | Individual check scores with category name and score (0-100) |
| `resources` | array | Involved Kubernetes resources with name, namespace, role, and UID |

---

## Retrieving Results

### Using kubectl
```bash
# List all patterns across all namespaces
kubectl get k8spatterns -A

# Short form
kubectl get k8sp -n pattern-analysis-ns

# View details of specific pattern
kubectl describe k8sp sidecar--509164000 -n pattern-analysis-ns

# Get as YAML
kubectl get k8sp sidecar--509164000 -n pattern-analysis-ns -o yaml

# Filter by severity (requires label)
kubectl get k8sp -n pattern-analysis-ns --field-selector spec.severity=CRITICAL
```

---

## Integration Examples

### Scheduled Analysis
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: kubepattern-daily-scan
  namespace: pattern-analysis-ns
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: pattern-analyzer
            image: curlimages/curl:latest
            command:
            - /bin/sh
            - -c
            - curl -X POST http://kubepattern-api:8080/analyzeCluster
          restartPolicy: OnFailure
```

### Export Graph for Visualization
```bash
# Export cluster topology
curl http://kubepattern-api:8080/cluster/graph | jq . > cluster_topology.json

# Pretty print with metadata
curl -s http://kubepattern-api:8080/cluster/graph | \
  jq '{cluster: .clusterName, resources: (.graph.vertices | length), relationships: (.graph.edges | length)}'
```

### Monitor Pattern Trends
```bash
# Count patterns by confidence level
kubectl get k8sp -n pattern-analysis-ns -o json | \
  jq '[.items[].spec.confidence] | group_by(.) | map({confidence: .[0], count: length})'

# List high-confidence structural patterns
kubectl get k8sp -n pattern-analysis-ns -o json | \
  jq '.items[] | select(.spec.confidence=="HIGH" and .spec.type=="STRUCTURAL") | {name: .spec.name, resources: [.spec.resources[].name]}'
```

---

## Analysis Workflow

1. **Request**: API receives analysis trigger (`/analyzeCluster` or `/analyzeNamespace`)
2. **Async Execution**: Background thread starts pattern matching process
3. **Graph Construction**: Builds/updates resource and relationship graph
4. **Pattern Matching**: Evaluates all patterns from Pattern-as-Code registry
5. **Scoring**: Calculates confidence scores based on matched criteria
6. **CRD Creation**: Generates `K8sPattern` resources in `pattern-analysis-ns` namespace
7. **Results**: Available immediately via `kubectl get k8spatterns`

---

## Notes

- All analysis endpoints execute **asynchronously** (immediate HTTP response, background processing)
- Pattern detection uses the complete Pattern-as-Code registry
- All detected patterns are stored in the `pattern-analysis-ns` namespace
- Graph endpoint provides **real-time** cluster topology snapshot
- CRDs use the group `kubepattern.it` and version `v1`
- Short name `k8sp` available for convenience
- Pattern names may include generated suffixes for uniqueness (e.g., `sidecar-509164000`)