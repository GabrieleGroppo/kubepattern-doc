---
sidebar_position: 3
id: publish-pac
title: How to Publish Pattern-as-Code
slug: /pattern-as-code/publish-pac
---

# How to Publish Your Pattern

Share your Kubernetes patterns with the community by publishing them to a pattern registry.

## Publishing to the Official Registry

To contribute your pattern to the KubePattern official registry:

1. **Fork the repository**
```bash
   git clone https://github.com/your-org/kubepattern-registry.git
   cd kubepattern-registry
```

2. **Create your pattern definition**
   
   Add your pattern file in the `definitions/` folder:
```bash
   definitions/
   ├── predictable-demands.yaml
   ├── health-probe.yaml
   └── your-pattern-name.yaml  # Your new pattern
```

3. **Submit a pull request**
   
   Once your pattern is ready, open a PR to merge it into the official registry.

---

## Using a Custom Registry

You can also host patterns in your own private or public registry.

### Configuration

Set your custom registry URL and authentication in the KubePattern ConfigMap:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kubepattern-config
  namespace: kubepattern-system
data:
  PATTERN_REGISTRY_URL: "https://github.com/your-org/your-registry"
  PATTERN_REGISTRY_TOKEN: "your-access-token"  # Optional, for private registries
```

### Environment Variables

Alternatively, configure via environment variables:
```bash
export PATTERN_REGISTRY_URL="https://github.com/your-org/your-registry"
export PATTERN_REGISTRY_TOKEN="your-access-token"  # For private registries only
```

---

## Best Practices

- ✅ **Test your pattern** thoroughly before publishing
- ✅ **Include documentation** with examples and use cases
- ✅ **Follow naming conventions** (kebab-case recommended)
- ✅ **Add metadata** (version, author, tags) to your pattern definition

---