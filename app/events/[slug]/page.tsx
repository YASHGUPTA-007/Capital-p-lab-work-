import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEventBySlug, getAllEventSlugs } from '@/lib/events'
import EventDetailClient from './EventDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllEventSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = getEventBySlug(slug)

  if (!event) {
    return {
      title: 'Event Not Found | The Capital P Lab',
    }
  }

  const title = `${event.title} | The Capital P Lab`
  const description =
    event.description ??
    `${event.title} — ${event.dateLabel} at ${event.venue}, ${event.city}. Organised with leading policy and research institutions.`

  return {
    title,
    description,
    keywords: [
      ...event.tags,
      'Capital P Lab',
      'urban policy',
      'policy conference India',
      event.city,
    ],
    authors: [{ name: 'The Capital P Lab' }],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://www.capitalp.org/events/${event.slug}`,
      images: [
        {
          url: event.heroImage,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [event.heroImage],
    },
    alternates: {
      canonical: `https://www.capitalp.org/events/${event.slug}`,
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
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params
  const event = getEventBySlug(slug)
  if (!event) notFound()
  return <EventDetailClient />
}
