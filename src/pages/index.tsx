import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home() {
  useEffect(() => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      const currentScroll = window.pageYOffset;
      if (nav) {
        nav.style.boxShadow = currentScroll > 100 
          ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
          : 'none';
      }
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(card => {
      observer.observe(card);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <Layout
      title="Kubernetes Pattern Recognition Made Simple"
      description="KubePattern | A tool to identify smells and suggest Kubernetes Architectural Patterns and Configuration Best Practices.">
      
      {/* Hero Section */}
      <section className="hero-custom">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <h1>Kubernetes Pattern Recognition Made Simple</h1>
          <p>Static analysis tool that identifies architectural patterns and configuration smells in your Kubernetes clusters</p>
          <div className="hero-buttons">
            <Link to="/getting-started" className="btn btn-primary">
              <i className="fas fa-rocket"></i> Get Started
            </Link>
            <a href="#how-it-works" className="btn btn-secondary">
              <i className="fas fa-play-circle"></i> See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-custom" id="features">
        <h2 className="section-title">Why KubePattern?</h2>
        <p className="section-subtitle">Go beyond traditional linting with pattern-oriented validation</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-project-diagram"></i>
            </div>
            <h3>Graph-Based Analysis</h3>
            <p>Builds a complete resource graph to understand relationships and dependencies between Kubernetes resources, enabling deep architectural insights.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-code"></i>
            </div>
            <h3>Pattern-as-Code</h3>
            <p>Define patterns using declarative JSON files. Extend KubePattern with custom patterns without modifying the core codebase.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>Pattern Recognition</h3>
            <p>Automatically detect architectural patterns like Sidecar, Health Probe, and Predictable Demands across your entire cluster.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Confidence Scoring</h3>
            <p>Each detection includes confidence levels, severity ratings, and detailed scores to help you prioritize improvements.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Best Practices</h3>
            <p>Identify configuration smells and deviations from Kubernetes best practices and corporate policies automatically.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-fire"></i>
            </div>
            <h3>Native CRD Output</h3>
            <p>Results are exposed as Kubernetes Custom Resources, making them easy to query, monitor, and integrate with existing tools.</p>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="code-example-custom" id="how-it-works">
        <div className="code-container">
          <div className="code-content">
            <h2>Simple Yet Powerful</h2>
            <p>KubePattern analyzes your cluster and creates K8sPattern CRDs that represent detected patterns with detailed information.</p>
            
            <ul className="code-features">
              <li><i className="fas fa-check-circle"></i> Automatic cluster scanning</li>
              <li><i className="fas fa-check-circle"></i> RESTful API for integration</li>
              <li><i className="fas fa-check-circle"></i> Detailed pattern descriptions</li>
              <li><i className="fas fa-check-circle"></i> Resource relationship mapping</li>
            </ul>

            <Link to="/overview" className="btn btn-primary">
              <i className="fas fa-book"></i> Read the Docs
            </Link>
          </div>

          <div className="code-block">
            <pre>{`# View detected patterns
kubectl get k8spatterns -A

# Example output:
apiVersion: kubepattern.it/v1
kind: K8sPattern
metadata:
  name: sidecar-2109423650
  namespace: pattern-analysis-ns
spec:
  confidence: HIGH
  severity: INFO
  type: STRUCTURAL
  message: Pod 'frontend' in namespace 'production' appears to be separated from
    its sidecar pod 'logging' in namespace 'production'. These pods share volumes
    and likely have a common lifecycle, suggesting they should be combined into
    a single pod with multiple containers.
  name: sidecar
  referenceLink: https://github.com/GabrieleGroppo/kubepattern-registry/tree/main/doc/sidecar.json
  resources:
  - name: frontend
    namespace: production
    role: main-app
  - name: logging
    namespace: production
    role: sidecar
  scores:
  - category: Relationship
    score: 10`}</pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-custom">
        <h2>Ready to Improve Your Kubernetes Architecture?</h2>
        <p>Join the community and start detecting patterns in your cluster today. It's free and open source!</p>
        <a href="https://github.com/GabrieleGroppo/kubepattern" className="btn btn-white" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github"></i> View on GitHub
        </a>
      </section>
    </Layout>
  );
}