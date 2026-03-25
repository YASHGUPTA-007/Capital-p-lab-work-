'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react'
import { getAllEvents, type Event } from '@/lib/events'

/* ─── reveal helper ───────────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── animated counter ────────────────────────────────────────────────────── */
function Counter({ to }: { to: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || to === 0) return
    let n = 0
    const steps = 24
    const interval = setInterval(() => {
      n += to / steps
      if (n >= to) { setCount(to); clearInterval(interval) }
      else setCount(Math.floor(n))
    }, 40)
    return () => clearInterval(interval)
  }, [inView, to])
  return <span ref={ref}>{count}</span>
}

/* ─── Featured event — horizontal split ──────────────────────────────────── */
function FeaturedCard({ event }: { event: Event }) {
  const isPast = event.status === 'past'
  return (
    <Reveal delay={0.1}>
      <Link href={`/events/${event.slug}`} className="group block">
        <article className="relative w-full overflow-hidden rounded-3xl bg-white border border-[#e8e4f0] shadow-xl hover:shadow-2xl transition-shadow duration-500 grid grid-cols-1 lg:grid-cols-[55%_45%]">

          {/* ── LEFT — full-bleed image ── */}
          <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[480px] overflow-hidden">
            <Image
              src={event.heroImage}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              quality={90}
            />
            {/* gradient so image edges fade nicely */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 lg:to-white hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c20]/50 via-transparent to-transparent lg:hidden" />

            {/* Status + date */}
            <div className="absolute top-5 left-5 flex gap-2">
              <span className={`inline-flex items-center gap-1.5 backdrop-blur-sm rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border ${isPast ? 'bg-[#2b2e34]/60 text-white border-white/10' : 'bg-[#4f7f5d] text-white border-[#4f7f5d]'}`}>
                {!isPast && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                {isPast ? 'Past Event' : 'Upcoming'}
              </span>
            </div>

            {/* Feature label */}
            <div className="absolute top-5 right-5">
              <span className="inline-flex items-center gap-1.5 bg-[#755eb1] text-white backdrop-blur-sm rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest">
                Featured
              </span>
            </div>
          </div>

          {/* ── RIGHT — content ── */}
          <div className="flex flex-col justify-between p-8 lg:p-10 xl:p-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {event.tags.slice(0, 3).map(tag => (
                <span key={tag} className="bg-[#f4f7f5] border border-[#c7d6c1] text-[#4f7f5d] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex-1">
              <h2 className="text-[#2b2e34] font-serif text-2xl xl:text-3xl leading-[1.1] tracking-tight group-hover:text-[#755eb1] transition-colors duration-400 mb-3">
                {event.title}
              </h2>
              {event.subtitle && (
                <p className="text-[#4f475d]/60 text-sm italic leading-relaxed mb-5">{event.subtitle}</p>
              )}
              {event.description && (
                <p className="text-[#4f475d]/75 text-sm leading-relaxed line-clamp-3">{event.description}</p>
              )}
            </div>

            {/* Meta */}
            <div className="mt-8 pt-6 border-t border-[#f0edf8] space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#4f475d]/70">
                <div className="w-7 h-7 rounded-lg bg-[#ede8f5] flex items-center justify-center flex-shrink-0">
                  <Calendar size={13} className="text-[#755eb1]" />
                </div>
                <span className="font-semibold">{event.dateLabel}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#4f475d]/70">
                <div className="w-7 h-7 rounded-lg bg-[#e8f1e6] flex items-center justify-center flex-shrink-0">
                  <MapPin size={13} className="text-[#4f7f5d]" />
                </div>
                <span className="font-semibold">{event.venue}, {event.city}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-7">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#755eb1] to-[#4f475d] text-white rounded-full px-7 py-3.5 text-xs font-black uppercase tracking-widest group-hover:from-[#6b54a5] group-hover:to-[#5a8a6a] transition-all duration-400 shadow-md hover:shadow-lg group-hover:-translate-y-0.5">
                Explore Event <ArrowUpRight size={13} />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </Reveal>
  )
}

/* ─── Standard event card ─────────────────────────────────────────────────── */
function EventCard({ event, index }: { event: Event; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isPast = event.status === 'past'

  return (
    <Reveal delay={0.05 + index * 0.09}>
      <Link href={`/events/${event.slug}`} className="group block h-full">
        <article
          className="relative h-full bg-white rounded-2xl overflow-hidden border border-[#e8e4f0] shadow-sm hover:shadow-xl hover:border-[#c1b4df]/50 transition-all duration-400 flex flex-col"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Image */}
          <div className="relative h-52 overflow-hidden flex-shrink-0">
            <Image
              src={event.heroImage}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-108 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={80}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c20]/55 via-[#1a1c20]/10 to-transparent" />

            {/* Status */}
            <div className="absolute top-3.5 left-3.5">
              <span className={`inline-flex items-center gap-1.5 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${isPast ? 'bg-[#2b2e34]/55 text-white border-white/10' : 'bg-[#4f7f5d]/90 text-white border-[#4f7f5d]/50'}`}>
                {!isPast && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                {isPast ? 'Past' : 'Upcoming'}
              </span>
            </div>

            {/* Date badge */}
            <div className="absolute top-3.5 right-3.5 bg-white rounded-xl px-2.5 py-2 text-center shadow-md">
              <p className="text-[#755eb1] text-[9px] font-black uppercase tracking-wide leading-none">
                {new Date(event.dateISO).toLocaleString('en', { month: 'short' })}
              </p>
              <p className="text-[#2b2e34] text-lg font-black leading-none mt-0.5">
                {new Date(event.dateISO).getDate()}
              </p>
            </div>

            {/* Hover: tags slide up */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-3 left-3 flex flex-wrap gap-1.5"
                >
                  {event.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="bg-white/90 backdrop-blur-sm text-[#4f7f5d] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Body */}
          <div className="p-5 flex-1 flex flex-col gap-3">
            <div className="flex-1">
              <h2 className="text-[#2b2e34] font-serif text-base leading-snug group-hover:text-[#755eb1] transition-colors duration-300 line-clamp-2">
                {event.title}
              </h2>
              {event.subtitle && (
                <p className="text-[#4f475d]/55 text-xs italic mt-1 line-clamp-1">{event.subtitle}</p>
              )}
              {event.description && (
                <p className="text-[#4f475d]/65 text-sm mt-2.5 leading-relaxed line-clamp-2">{event.description}</p>
              )}
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between pt-4 border-t border-[#f4f1fb] mt-auto">
              <div className="flex items-center gap-1.5 text-[#4f475d]/55 text-xs font-semibold">
                <MapPin size={11} className="text-[#4f7f5d]" />
                {event.city}
              </div>
              <motion.span
                animate={{ x: hovered ? 0 : -6, opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-1 text-[#755eb1] text-xs font-black"
              >
                View details <ArrowRight size={11} />
              </motion.span>
            </div>
          </div>

          {/* Bottom accent sweep */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#755eb1] to-[#4f7f5d] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-b-2xl" />
        </article>
      </Link>
    </Reveal>
  )
}

/* ─── PAGE ────────────────────────────────────────────────────────────────── */
export default function EventsPage() {
  const events       = getAllEvents()
  const upcoming     = events.filter(e => e.status === 'upcoming')
  const past         = events.filter(e => e.status === 'past')
  const featured     = upcoming[0] ?? past[0]
  const restUpcoming = upcoming.slice(featured?.status === 'upcoming' ? 1 : 0)
  const restPast     = past.slice(featured?.status === 'past' ? 1 : 0)

  /* parallax */
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const bgY      = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const fade     = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <div className="min-h-screen bg-[#f4f7f5] overflow-x-hidden">

      {/* ══════════════ HERO ════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ minHeight: '72vh' }}
      >
        {/* ── parallax background image ── */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110 origin-top">
          <Image
            src="/event12.jpeg"
            alt="Events background"
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
        </motion.div>

        {/* ── layered overlays ── */}
        {/* Dark base so image is rich, not washed */}
        <div className="absolute inset-0 bg-[#1a1c20]/40" />
        {/* Left fade for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4f7f5]/80 via-[#f4f7f5]/35 to-transparent" />
        {/* Bottom fade into page bg */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f4f7f5]/90 via-transparent to-transparent" />
        {/* Subtle purple tint top-right */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#755eb1]/15 rounded-full blur-[120px] pointer-events-none" />

        {/* ── content ── */}
        <motion.div
          style={{ y: contentY, opacity: fade, minHeight: '72vh' }}
          className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center"
        >
          {/* breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-[#4f475d]/50 text-sm font-black uppercase tracking-widest pt-24 mb-7"
          >
            <Link href="/" className="hover:text-[#755eb1] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#755eb1]">Events</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 pb-14">

            {/* ── LEFT: logo + text ── */}
            <div className="flex-1 max-w-2xl">
              {/* Logo + org name row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="flex items-center gap-4 mb-5"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="The Capital P Lab"
                    fill
                    className="object-contain"
                    sizes="64px"
                    quality={95}
                  />
                </div>
                <div>
                  <p className="text-[#4f7f5d] text-base font-black uppercase tracking-widest leading-none">The Capital P Lab</p>
                  <p className="text-[#4f475d]/50 text-sm mt-1">Events &amp; Conferences</p>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-[#755eb1] text-5xl md:text-6xl lg:text-7xl leading-tight mb-3"
              >
                Our Events
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32 }}
                className="font-serif italic text-[#4f7f5d] text-xl md:text-2xl leading-tight mb-7"
              >
                Where research meets policy
              </motion.p>

              {/* Stat pills */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.46 }}
                className="flex flex-wrap gap-3"
              >
                {upcoming.length > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm border border-[#c7d6c1] rounded-2xl px-5 py-4 text-center shadow-sm">
                    <p className="text-[#4f7f5d] text-2xl font-black leading-none"><Counter to={upcoming.length} /></p>
                    <p className="text-[#4f7f5d]/60 text-[10px] font-black uppercase tracking-wider mt-1">Upcoming</p>
                  </div>
                )}
                <div className="bg-white/90 backdrop-blur-sm border border-[#c1b4df]/60 rounded-2xl px-6 py-5 text-center shadow-sm">
                  <p className="text-[#755eb1] text-3xl font-black leading-none"><Counter to={events.length} /></p>
                  <p className="text-[#755eb1]/60 text-xs font-black uppercase tracking-wider mt-2">Total Events</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm border border-[#e8e4f0] rounded-2xl px-6 py-5 text-center shadow-sm">
                  <p className="text-[#2b2e34] text-3xl font-black leading-none"><Counter to={past.length} /></p>
                  <p className="text-[#4f475d]/50 text-xs font-black uppercase tracking-wider mt-2">Past Events</p>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: floating accent card (desktop only) ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block flex-shrink-0 w-90"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[#c1b4df]/30 shadow-2xl p-9 space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-[#f0edf8]">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <Image src="/logo.png" alt="Logo" fill className="object-contain" sizes="56px" quality={90} />
                  </div>
                  <div>
                    <p className="text-[#2b2e34] text-base font-black leading-none">The Capital P Lab</p>
                    <p className="text-[#4f475d]/50 text-sm mt-1">Policy · People · Planet</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Focus Area', value: 'Urban Policy' },
                    { label: 'Domain', value: 'Gender Equity' },
                    { label: 'Approach', value: 'Evidence-Based' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-[#4f475d]/50 text-sm font-semibold">{item.label}</span>
                      <span className="bg-[#f4f7f5] border border-[#c7d6c1] text-[#4f7f5d] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wide">{item.value}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/#contact"
                  className="block w-full text-center bg-gradient-to-r from-[#755eb1] to-[#4f475d] text-white rounded-xl py-4 text-sm font-black uppercase tracking-widest hover:from-[#6b54a5] hover:to-[#5a8a6a] transition-all shadow-md mt-2"
                >
                  Collaborate with us
                </Link>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* ══════════════ CONTENT ═════════════════════════════════════════ */}
      <div className="relative max-w-7xl mx-auto px-5 md:px-12 pb-28 space-y-20">

        {/* decoration */}
        <div className="pointer-events-none absolute -top-20 right-0 w-[400px] h-[400px] bg-[#c1b4df]/10 rounded-full blur-[100px]" />
        <div className="pointer-events-none absolute top-1/2 -left-32 w-[350px] h-[350px] bg-[#c7d6c1]/15 rounded-full blur-[90px]" />

        {/* ── FEATURED ────────────────────────────────────────────────── */}
        {featured && (
          <section>
            <Reveal>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[#4f475d]/35 text-[11px] font-black uppercase tracking-[0.2em]">Featured Event</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#c1b4df]/60 to-transparent" />
              </div>
            </Reveal>
            <FeaturedCard event={featured} />
          </section>
        )}

        {/* ── UPCOMING (rest) ─────────────────────────────────────────── */}
        {restUpcoming.length > 0 && (
          <section>
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <span className="w-2 h-2 rounded-full bg-[#4f7f5d] animate-pulse flex-shrink-0" />
                <h2 className="text-[#2b2e34] font-black text-sm uppercase tracking-[0.18em]">Upcoming Events</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#c7d6c1] to-transparent" />
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restUpcoming.map((event, i) => (
                <EventCard key={event.slug} event={event} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── PAST ────────────────────────────────────────────────────── */}
        {restPast.length > 0 && (
          <section>
            <Reveal>
              <div className="flex items-center gap-3 mb-10">
                <span className="w-2 h-2 rounded-full bg-[#755eb1] flex-shrink-0" />
                <h2 className="text-[#2b2e34] font-black text-sm uppercase tracking-[0.18em]">Past Events</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#c1b4df]/50 to-transparent" />
                <span className="text-[#4f475d]/35 text-[11px] font-bold">{restPast.length} event{restPast.length !== 1 ? 's' : ''}</span>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restPast.map((event, i) => (
                <EventCard key={event.slug} event={event} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── EMPTY ───────────────────────────────────────────────────── */}
        {events.length === 0 && (
          <Reveal>
            <div className="text-center py-32">
              <div className="w-16 h-16 rounded-full bg-[#c1b4df]/20 flex items-center justify-center mx-auto mb-5">
                <Calendar size={26} className="text-[#755eb1]/40" />
              </div>
              <h3 className="text-[#2b2e34] text-xl font-serif mb-2">No events yet</h3>
              <p className="text-[#4f475d]/50 text-sm">Check back soon.</p>
            </div>
          </Reveal>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#755eb1] via-[#5a47a0] to-[#4f475d] p-[1px] shadow-xl">
            <div className="relative bg-gradient-to-br from-[#755eb1] via-[#5a47a0] to-[#4f475d] rounded-[calc(1.5rem-1px)] px-8 md:px-14 py-12 md:py-14 overflow-hidden">
              {/* Inner blobs */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#4f7f5d]/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-[60px] pointer-events-none" />
              {/* Faint grid */}
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div>
                  <p className="text-white/50 text-[11px] font-black uppercase tracking-widest mb-2">Partner with us</p>
                  <h3 className="text-white font-serif text-2xl md:text-3xl leading-tight">
                    Collaborate on research <br className="hidden md:block" />
                    &amp; policy design
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3 flex-shrink-0">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 bg-white text-[#755eb1] rounded-full px-7 py-3.5 text-xs font-black uppercase tracking-widest hover:bg-[#f4f7f5] transition-all shadow-lg hover:-translate-y-0.5"
                  >
                    Get in Touch <ArrowUpRight size={13} />
                  </Link>
                  <Link
                    href="/research"
                    className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white rounded-full px-7 py-3.5 text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all hover:-translate-y-0.5"
                  >
                    View Research
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  )
}
