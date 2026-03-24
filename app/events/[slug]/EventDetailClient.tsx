'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { MapPin, Calendar, ArrowLeft, Users, BookOpen, Building2, ExternalLink, ChevronRight } from 'lucide-react'
import { getEventBySlug, getAllEvents, type Organiser } from '@/lib/events'

/* ─── Fade-in wrapper ─────────────────────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Organiser icon by type ──────────────────────────────────────────────── */
function OrgIcon({ type }: { type: Organiser['type'] }) {
  const cls = 'text-[#755eb1]'
  if (type === 'ministry') return <Building2 size={17} className={cls} />
  if (type === 'institute') return <BookOpen size={17} className={cls} />
  return <Users size={17} className={cls} />
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function EventDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''
  const event = getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const isPast = event.status === 'past'
  const allEvents = getAllEvents()
  const otherEvents = allEvents.filter((e) => e.slug !== event.slug).slice(0, 3)

  const galleryImages = event.galleryImages ?? [event.heroImage]

  return (
    <div className="min-h-screen bg-[#f4f7f5] overflow-x-hidden">

      {/* ── HERO  ─  left/right split ─────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative w-full flex flex-col lg:flex-row min-h-screen overflow-hidden"
      >

        {/* ════ LEFT — content panel ════════════════════════════════════ */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 bg-[#f4f7f5] flex flex-col justify-between
                     w-full lg:w-[46%] flex-shrink-0
                     pt-[88px] pb-10 px-7 md:px-12 lg:px-14
                     min-h-[55vh] lg:min-h-screen"
        >
          {/* decorative blob */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 bg-[#c1b4df]/15 rounded-full blur-[90px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 w-48 h-48 bg-[#c7d6c1]/20 rounded-full blur-[70px]" />

          {/* ── top: breadcrumb ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-[#4f475d]/40 text-[11px] font-black uppercase tracking-widest mb-10"
            >
              <Link href="/" className="hover:text-[#755eb1] transition-colors">Home</Link>
              <ChevronRight size={10} />
              <Link href="/events" className="hover:text-[#755eb1] transition-colors">Events</Link>
              <ChevronRight size={10} />
              <span className="text-[#755eb1] line-clamp-1 max-w-[140px]">Event</span>
            </motion.div>
          </div>

          {/* ── middle: main content ── */}
          <div className="flex-1 flex flex-col justify-center py-8">

            {/* Status badges */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap gap-2 mb-7"
            >
              <span className="inline-flex items-center gap-2 bg-[#755eb1]/10 border border-[#c1b4df]/50 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#755eb1]" />
                <span className="text-[#755eb1] text-[10px] font-black uppercase tracking-widest">Event</span>
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border ${isPast ? 'bg-[#2b2e34]/8 text-[#4f475d] border-[#4f475d]/20' : 'bg-[#4f7f5d]/10 text-[#4f7f5d] border-[#4f7f5d]/30'}`}>
                {!isPast && <span className="w-1.5 h-1.5 rounded-full bg-[#4f7f5d] animate-pulse" />}
                {isPast ? 'Past Event' : 'Upcoming'}
              </span>
            </motion.div>

            {/* Title — serif font matching site theme */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-[#755eb1] text-3xl md:text-4xl xl:text-5xl leading-tight mb-4"
            >
              {event.title}
            </motion.h1>

            {event.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="font-serif italic text-[#4f7f5d] text-base md:text-lg leading-snug mb-8"
              >
                {event.subtitle}
              </motion.p>
            )}

            {/* Date + Venue */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="space-y-3 mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#ede8f5] flex items-center justify-center flex-shrink-0">
                  <Calendar size={14} className="text-[#755eb1]" />
                </div>
                <div>
                  <p className="text-[#4f475d]/50 text-[10px] font-black uppercase tracking-wider leading-none mb-0.5">Date</p>
                  <p className="text-[#2b2e34] text-sm font-semibold">{event.dateLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#e8f1e6] flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-[#4f7f5d]" />
                </div>
                <div>
                  <p className="text-[#4f475d]/50 text-[10px] font-black uppercase tracking-wider leading-none mb-0.5">Venue</p>
                  <p className="text-[#2b2e34] text-sm font-semibold">{event.venue}, {event.city}</p>
                </div>
              </div>
            </motion.div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.52 }}
                className="flex flex-wrap gap-2"
              >
                {event.tags.map(tag => (
                  <span key={tag} className="bg-white border border-[#c7d6c1] text-[#4f7f5d] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </div>

          {/* ── bottom: back link ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-[#755eb1] text-xs font-black uppercase tracking-widest hover:gap-3 transition-all group"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
              All Events
            </Link>
          </motion.div>
        </motion.div>

        {/* ════ RIGHT — image card ══════════════════════════════════════ */}
        <div className="relative flex-1 flex items-center justify-center
                        bg-[#eeeaf4] lg:bg-[#f0ecf8]
                        px-6 py-8 lg:px-10 lg:py-12
                        pt-6 lg:pt-[88px]">

          {/* subtle bg decoration */}
          <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 bg-[#c1b4df]/20 rounded-full blur-[80px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-56 h-56 bg-[#c7d6c1]/25 rounded-full blur-[70px]" />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl"
          >
            {/* Image rectangle — object-contain shows full image */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-[#755eb1]/15 border-4 border-white">
              <Image
                src={event.heroImage}
                alt={event.title}
                fill
                className="object-contain bg-[#1a1c20]"
                priority
                quality={90}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Date badge — bottom-left, floating over the card border */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.55 }}
              className="absolute -bottom-4 -left-4 bg-gradient-to-br from-[#755eb1] to-[#4f475d] text-white rounded-2xl px-5 py-4 shadow-xl text-center"
            >
              <p className="text-white/60 text-[9px] font-black uppercase tracking-widest leading-none">
                {new Date(event.dateISO).toLocaleString('en', { month: 'short' })}
              </p>
              <p className="text-white text-3xl font-black leading-none mt-0.5">
                {new Date(event.dateISO).getDate()}
              </p>
              <p className="text-white/50 text-[9px] font-bold mt-0.5">
                {new Date(event.dateISO).getFullYear()}
              </p>
            </motion.div>

            {/* Status chip — top-right corner */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.6 }}
              className="absolute -top-3 -right-3"
            >
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg border ${isPast ? 'bg-white text-[#4f475d] border-[#e8e4f0]' : 'bg-[#4f7f5d] text-white border-[#4f7f5d]'}`}>
                {!isPast && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                {isPast ? 'Past Event' : 'Upcoming'}
              </span>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="relative max-w-6xl mx-auto px-5 md:px-12 py-16 md:py-24 space-y-20">
        <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#c1b4df]/8 rounded-full blur-[130px]" />
        <div className="pointer-events-none absolute top-1/2 -left-48 w-[400px] h-[400px] bg-[#c7d6c1]/12 rounded-full blur-[110px]" />

        {/* ── JOINTLY ORGANISED BY ─────────────────────────────────────── */}
        {event.organisers.length > 0 && (
          <div>
            <FadeIn>
              <div className="flex items-center gap-3 mb-7">
                <div className="h-[2px] w-8 bg-gradient-to-r from-[#755eb1] to-transparent rounded-full" />
                <span className="text-[#755eb1] text-[11px] font-black uppercase tracking-widest">Jointly Organised By</span>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {event.organisers.map((org, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-[#c1b4df]/30 shadow hover:shadow-lg hover:border-[#755eb1]/40 transition-all duration-300 h-full flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#755eb1]/10 to-[#4f7f5d]/10 flex items-center justify-center border border-[#c1b4df]/30 group-hover:from-[#755eb1]/20 group-hover:to-[#4f7f5d]/20 transition-all">
                      <OrgIcon type={org.type} />
                    </div>
                    <div>
                      <p className="text-[#2b2e34] font-semibold text-sm leading-snug">{org.name}</p>
                      {org.subtitle && <p className="text-[#4f475d]/55 text-xs mt-1 leading-relaxed">{org.subtitle}</p>}
                    </div>
                    <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-gradient-to-b from-[#755eb1] to-[#4f7f5d] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* ── EVENT OVERVIEW + IMAGES ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* Gallery */}
          <FadeIn className="lg:col-span-3" delay={0.05}>
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-[#755eb1]/10 border border-white">
                <Image
                  src={galleryImages[1] ?? galleryImages[0]}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c20]/25 via-transparent to-transparent" />
              </div>
              {galleryImages.length > 1 && (
                <div className="absolute -bottom-5 -right-4 md:-right-8 w-36 md:w-44 aspect-[4/3] rounded-xl overflow-hidden shadow-xl border-2 border-white">
                  <Image
                    src={galleryImages[0]}
                    alt={`${event.title} — photo`}
                    fill
                    className="object-cover"
                    sizes="176px"
                    quality={80}
                  />
                </div>
              )}
              {/* Date badge */}
              <div className="absolute -top-4 -left-4 md:-left-6 bg-gradient-to-br from-[#755eb1] to-[#4f475d] text-white rounded-xl px-4 py-3 shadow-lg text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  {new Date(event.dateISO).toLocaleString('en', { month: 'short' })}
                </p>
                <p className="text-2xl font-black leading-none">
                  {new Date(event.dateISO).getDate()}
                </p>
                <p className="text-[10px] font-bold opacity-80">
                  {new Date(event.dateISO).getFullYear()}
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Details card */}
          <FadeIn className="lg:col-span-2" delay={0.15}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-7 border border-[#c1b4df]/30 shadow-xl space-y-5">
              <div>
                <p className="text-[#755eb1] text-[11px] font-black uppercase tracking-widest mb-1">Event</p>
                <h2 className="text-[#2b2e34] text-xl font-black leading-tight">{event.title}</h2>
                {event.subtitle && (
                  <p className="text-[#4f475d]/65 text-sm mt-2 leading-relaxed italic">{event.subtitle}</p>
                )}
              </div>
              <div className="h-px bg-gradient-to-r from-[#c1b4df]/50 to-transparent" />
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#e8f1e6] flex items-center justify-center">
                    <Calendar size={14} className="text-[#4f7f5d]" />
                  </div>
                  <div>
                    <p className="text-[#4f475d]/55 text-[11px] font-bold uppercase tracking-wider">Dates</p>
                    <p className="text-[#2b2e34] text-sm font-semibold">{event.dateLabel}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#ede8f5] flex items-center justify-center">
                    <MapPin size={14} className="text-[#755eb1]" />
                  </div>
                  <div>
                    <p className="text-[#4f475d]/55 text-[11px] font-bold uppercase tracking-wider">Venue</p>
                    <p className="text-[#2b2e34] text-sm font-semibold">{event.venue}, {event.city}</p>
                  </div>
                </div>
              </div>
              {event.tags.length > 0 && (
                <>
                  <div className="h-px bg-gradient-to-r from-[#c1b4df]/50 to-transparent" />
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span key={tag} className="bg-[#f4f7f5] border border-[#c7d6c1] text-[#4f7f5d] text-[11px] font-bold px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </FadeIn>
        </div>

        {/* ── DESCRIPTION ──────────────────────────────────────────────── */}
        {event.description && (
          <FadeIn>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-[2px] w-8 bg-gradient-to-r from-[#4f7f5d] to-transparent rounded-full" />
                <span className="text-[#4f7f5d] text-[11px] font-black uppercase tracking-widest">About this Event</span>
              </div>
              <p className="text-[#4f475d]/80 text-base md:text-lg leading-relaxed">{event.description}</p>
            </div>
          </FadeIn>
        )}

        {/* ── PAPER PRESENTED ──────────────────────────────────────────── */}
        {event.paperPresented && (
          <FadeIn delay={0.05}>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#755eb1] via-[#5a47a0] to-[#4f475d]" />
              <div className="absolute inset-0 bg-[url('/logo.png')] bg-no-repeat bg-right-bottom bg-[length:260px_260px] opacity-[0.04]" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4f7f5d]/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-[60px]" />

              <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-xl p-2 flex items-center justify-center">
                  <Image src="/logo.png" alt="The Capital P Lab" width={80} height={80} className="object-contain" quality={95} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1">
                    <BookOpen size={12} className="text-white/80" />
                    <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Paper Presented by The Capital P Lab</span>
                  </div>
                  <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-black leading-tight max-w-2xl">
                    &ldquo;{event.paperPresented.title}&rdquo;
                  </h3>
                  {event.paperPresented.description && (
                    <p className="text-white/60 text-sm leading-relaxed max-w-xl">{event.paperPresented.description}</p>
                  )}
                </div>
                <div className="hidden md:block flex-shrink-0 text-white/10 font-black text-[9rem] leading-none select-none -mt-8">&ldquo;</div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── GALLERY ──────────────────────────────────────────────────── */}
        {galleryImages.length > 0 && (
          <div>
            <FadeIn>
              <div className="flex items-center gap-3 mb-7">
                <div className="h-[2px] w-8 bg-gradient-to-r from-[#4f7f5d] to-transparent rounded-full" />
                <span className="text-[#4f7f5d] text-[11px] font-black uppercase tracking-widest">Event Gallery</span>
              </div>
            </FadeIn>
            <div className={`grid gap-4 md:gap-6 ${galleryImages.length === 1 ? 'grid-cols-1 max-w-2xl' : 'grid-cols-2'}`}>
              {galleryImages.map((src, i) => (
                <FadeIn key={src + i} delay={i * 0.12}>
                  <div className="group relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-white hover:shadow-2xl transition-shadow duration-300">
                    <Image
                      src={src}
                      alt={`${event.title} — photo ${i + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c20]/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* ── OTHER EVENTS ─────────────────────────────────────────────── */}
        {otherEvents.length > 0 && (
          <div>
            <FadeIn>
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="h-[2px] w-8 bg-gradient-to-r from-[#755eb1] to-transparent rounded-full" />
                  <span className="text-[#755eb1] text-[11px] font-black uppercase tracking-widest">More Events</span>
                </div>
                <Link href="/events" className="inline-flex items-center gap-1 text-[#755eb1] text-xs font-bold hover:gap-2 transition-all">
                  View All <ArrowLeft size={12} className="rotate-180" />
                </Link>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {otherEvents.map((e, i) => (
                <FadeIn key={e.slug} delay={i * 0.1}>
                  <Link href={`/events/${e.slug}`} className="group block">
                    <div className="relative bg-white rounded-2xl overflow-hidden border border-[#e8e4f0] shadow hover:shadow-lg hover:border-[#c1b4df]/60 transition-all duration-300">
                      <div className="relative h-40 overflow-hidden">
                        <Image src={e.heroImage} alt={e.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" quality={75} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c20]/40 to-transparent" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-[#2b2e34] font-bold text-sm leading-snug group-hover:text-[#755eb1] transition-colors line-clamp-2 mb-2">{e.title}</h3>
                        <div className="flex items-center gap-2 text-[#4f475d]/55 text-xs">
                          <Calendar size={11} /><span>{e.dateLabel}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <FadeIn delay={0.05}>
          <div className="text-center py-8 space-y-5">
            <p className="text-[#4f475d]/55 text-sm max-w-md mx-auto leading-relaxed">
              Interested in collaborating with The Capital P Lab on policy research, conferences, or publications?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[#755eb1] to-[#4f475d] text-white rounded-full text-sm font-bold uppercase tracking-widest hover:from-[#6b54a5] hover:to-[#5a8a6a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Get in Touch <ExternalLink size={13} />
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 px-7 py-3 bg-white border-2 border-[#c1b4df] text-[#755eb1] rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#f4f7f5] transition-all shadow hover:-translate-y-0.5"
              >
                View Research
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
