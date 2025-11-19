// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'KubePattern',
  tagline: 'A tool to hint Kubernetes Architectural Patterns & Best Practices.',
  favicon: 'img/kubepattern.svg',

  future: {
    v4: true,
  },

  // IMPORTANTE: Configurazione per il dominio unificato
  url: 'https://kubepattern.it',
  baseUrl: '/',

  organizationName: 'GabrieleGroppo',
  projectName: 'kubepattern',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Script esterni per FontAwesome
  scripts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js',
      async: true,
    },
  ],

  // Stylesheets esterni per FontAwesome
  stylesheets: [
    {
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
      type: 'text/css',
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'docs', // La documentazione sarà su /docs
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/GabrieleGroppo/kubepattern/tree/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/GabrieleGroppo/kubepattern/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/kubepattern.svg',
      
      // Metadata SEO
      metadata: [
        {name: 'keywords', content: 'kubernetes, pattern, best-practices, pattern-as-code, cloud-native'},
        {name: 'og:type', content: 'website'},
      ],
      
      colorMode: {
        respectPrefersColorScheme: true,
      },
      
      navbar: {
        title: 'KubePattern',
        logo: {
          alt: 'KubePattern Logo',
          src: 'img/kubepattern.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'kubepatternSidebar',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/GabrieleGroppo/kubepattern',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Resources',
            items: [
              {
                label: 'Documentation',
                to: '/docs/overview',
              },
              {
                label: 'Pattern Catalog',
                href: 'https://github.com/GabrieleGroppo/kubepattern-registry',
              },
              {
                label: 'Getting Started',
                to: '/docs/getting-started',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Issues',
                href: 'https://github.com/GabrieleGroppo/kubepattern/issues',
              },
              {
                label: 'Contributing',
                to: '/docs/contributing',
              },
              {
                label: 'Telegram',
                href: 'https://t.me/+WUtGohZ5ZS44MjQ0',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'Roadmap',
                to: '/docs/roadmap',
              },
              {
                label: 'Author',
                href: 'https://gabrielegroppo.it',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} KubePattern. Open Source under GNU General Public License v3.0.`,
      },
      
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['yaml', 'json', 'bash'],
      },
    }),
};

export default config;