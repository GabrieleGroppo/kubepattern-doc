import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to use',
    Svg: require('@site/static/img/easy.svg').default,
    description: (
      <>
        Deploy KubePattern on your cluster with read permissions, then trigger analysis via REST endpoint or automate it with CronJobs—simple and flexible.
      </>
    ),
  },
  {
    title: 'Pattern As Code',
    Svg: require('@site/static/img/pac.svg').default,

    description: (
      <>
        Define architectural patterns in declarative JSON files, read and enforced by <b>KubePattern</b> across your Kubernetes workloads.
      </>
    ),
  },
  {
    title: 'Improve cluster quality',
    Svg: require('@site/static/img/quality.svg').default,
    description: (
      <>
        Detect anti-patterns and missing best practices in your workloads. KubePattern ensures architectural consistency and helps maintain healthy, production-ready Kubernetes clusters.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
