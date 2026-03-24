import { Metadata } from 'next'
import EventsClientPage from './EventsClientPage'

export const metadata: Metadata = {
  title: 'Events | The Capital P Lab',
  description:
    'Conferences, workshops and panels where The Capital P Lab presents evidence-based research to policymakers, practitioners and scholars across India.',
  keywords: [
    'Capital P Lab events',
    'urban policy conference',
    'gender equity urban India',
    'public finance policy',
    'policy research events India',
    'sustainability conference',
  ],
  authors: [{ name: 'The Capital P Lab' }],
  openGraph: {
    title: 'Events | The Capital P Lab',
    description:
      'Conferences, workshops and panels where The Capital P Lab presents evidence-based research to policymakers across India.',
    type: 'website',
    url: 'https://www.capitalp.org/events',
    images: [
      {
        url: '/event1.jpeg',
        width: 1200,
        height: 630,
        alt: 'The Capital P Lab Events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events | The Capital P Lab',
    description:
      'Conferences, workshops and panels where The Capital P Lab presents evidence-based research to policymakers across India.',
    images: ['/event1.jpeg'],
  },
  alternates: {
    canonical: 'https://www.capitalp.org/events',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function EventsPage() {
  return <EventsClientPage />
}
