import { DefaultSeoProps } from 'next-seo';
import { siteConfig } from './site';

export const defaultSEO: DefaultSeoProps = {
  title: `${siteConfig.name} — Book Stays, Things To Do & Getaways`,
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    site_name: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    cardType: 'summary_large_image'
  },
  additionalMetaTags: [
    { name: 'theme-color', content: '#E51A4B' },
    { name: 'keywords', content: siteConfig.keywords.join(', ') }
  ]
};

