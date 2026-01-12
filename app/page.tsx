'use client'

import React, { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  ArrowUpRight, 
  Menu, 
  X, 
  Linkedin, 
  Mail, 
  Globe,
  ArrowDown
} from 'lucide-react'

export default function TheCapitalPLab() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white relative overflow-x-hidden">
      
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-zinc-50/95 backdrop-blur-md border-b border-zinc-200' : 'py-6 md:py-10 bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-between items-center">
          <a href="#" className="flex items-center gap-2 group relative z-50">
            <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-serif italic font-bold rounded-sm group-hover:rotate-12 transition-transform">P</div>
            <span className="font-serif font-bold text-xl tracking-tight hidden md:block">The Capital P Lab</span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">
            {['About', 'Focus', 'Services', 'Team', 'Insights'].map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="hover:text-zinc-900 transition-colors">
                {item}
              </button>
            ))}
            {/* FIXED: Button alignment */}
            <button onClick={() => scrollTo('contact')} className="bg-zinc-900 text-white px-6 py-3 rounded-full hover:bg-zinc-700 transition-colors shadow-lg flex items-center justify-center h-10 leading-none pb-2.5 pt-3">
              Get in Touch
            </button>
          </div>

          <button className="md:hidden relative z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- 
          FIXED: Increased pt-48 (top padding) to pt-60 to clear header.
          FIXED: Changed text size to text-[10vw] (smaller than 13vw).
          FIXED: Changed leading to leading-[0.9] (more breathing room).
      */}
      <section className="relative min-h-screen flex flex-col justify-end pt-60 pb-20 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto w-full">
          
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <span className="h-px w-12 bg-zinc-900"></span>
            <span className="text-xs font-bold tracking-[0.3em] uppercase">Est. 2024</span>
          </div>
          
          {/* Main Title - Safe sizing */}
          <h1 className="font-serif text-[10vw] md:text-[11vw] leading-[0.95] tracking-tighter text-zinc-900 mb-20 lg:mb-32">
            Evidence into <br />
            <span className="italic font-light text-zinc-400 ml-4 md:ml-12">Impact.</span>
          </h1>

          {/* Grid Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-zinc-200 divide-y md:divide-y-0 md:divide-x divide-zinc-200 mb-20">
            {['Planet', 'People', 'Profit'].map((word, i) => (
              <div key={word} className="py-8 md:py-12 md:px-8 group hover:bg-zinc-100 transition-colors duration-500 cursor-default">
                <span className="block text-xs font-bold text-zinc-400 mb-4 tracking-widest">0{i+1}</span>
                <span className="font-serif text-3xl md:text-5xl italic group-hover:translate-x-2 transition-transform duration-300 block text-zinc-800">
                  {word}
                </span>
              </div>
            ))}
          </div>

          <div className="max-w-2xl ml-auto">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-zinc-600">
              We elevate policy advocacy through rigorous research, driving meaningful change across public and private sectors in India.
            </p>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- 
          FIXED: Added huge margin top (mt-32) to prevent collision with Hero.
      */}
      <section id="about" className="py-32 lg:py-40 bg-white border-y border-zinc-100 px-6 lg:px-12 mt-32">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-40">
          
          <div>
            <span className="block text-xs font-bold tracking-[0.2em] uppercase mb-8 text-zinc-400">Our Story</span>
            <h2 className="font-serif text-5xl md:text-7xl mb-12 leading-[1.1] text-zinc-900">
              From Resilience <br/> to <span className="italic text-zinc-400">Purpose.</span>
            </h2>
            <div className="space-y-8 text-lg md:text-xl font-serif text-zinc-600 leading-loose">
              <p>
                <span className="text-4xl text-zinc-900 float-left mr-2 mt-[-6px]">O</span>ur story began in the period following COVID-19, a time when many professionals were navigating uncertainty. As two mothers balancing careers and caregiving, we found ourselves seeking meaningful ways to stay engaged.
              </p>
              <p>
                We first connected through conducting STEAM workshops for students. What started as a shared effort quickly became a space for deeper collaboration.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-zinc-50 p-10 md:p-16 border border-zinc-100 relative overflow-hidden rounded-xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Globe size={100} strokeWidth={0.5} />
              </div>
              <h3 className="font-serif text-4xl italic mb-6">Our Mission</h3>
              <p className="text-zinc-600 mb-12 text-lg leading-relaxed">
                We provide research and consulting services that support sustainable development, responsible investment, and inclusive growth. We aim to strengthen institutions and translate evidence into actions.
              </p>
              <div className="grid grid-cols-2 gap-12 border-t border-zinc-200 pt-12">
                <div>
                  <div className="text-4xl md:text-5xl font-serif mb-2">SDG</div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Aligned</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-serif mb-2">ESG</div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Focused</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- FOCUS AREAS --- */}
      <section id="focus" className="py-32 lg:py-40 px-6 lg:px-12 bg-zinc-50/50">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-24 flex items-end justify-between border-b border-zinc-200 pb-8">
            <h2 className="font-serif text-5xl md:text-7xl text-zinc-900">Areas of Focus</h2>
            <p className="hidden md:block text-right text-zinc-500 max-w-xs text-sm font-medium">
              Bridging the gap between research and real-world application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-zinc-200">
            {[
              { cat: 'Social', title: 'Accessibility & Inclusion', desc: 'Advancing inclusion through evidence-based research and neurodiversity awareness.' },
              { cat: 'Economy', title: 'Sustainable Practices', desc: 'Behavioral science-informed research supporting responsible consumption.' },
              { cat: 'Psychology', title: 'Sustainability Emotion', desc: 'Integrating climate research with the emotional dimensions of mental health.' },
              { cat: 'Governance', title: 'ESG Interdependencies', desc: 'Analyzing how environmental and social factors interact across sectors.' }
            ].map((area, i) => (
              <div key={i} className="group p-8 md:p-10 border-r border-b border-zinc-200 hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.02)] transition-all duration-500 relative min-h-[350px] flex flex-col justify-between">
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition-colors">{area.cat}</div>
                <div>
                    <h3 className="font-serif text-3xl mb-4 leading-tight group-hover:italic transition-all">{area.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                    {area.desc}
                    </p>
                </div>
                <ArrowUpRight className="absolute top-6 right-6 text-zinc-300 group-hover:text-zinc-900 group-hover:rotate-45 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICES LIST --- 
          FIXED: Increased horizontal padding (px-8 to px-12/16) to stop text clipping.
          FIXED: Added pb-20 to bottom of container.
      */}
      <section id="services" className="px-4 md:px-8 py-20 w-full">
        <div className="bg-zinc-900 text-zinc-300 py-20 px-8 md:px-16 lg:px-24 rounded-[2rem] max-w-[1400px] mx-auto relative overflow-hidden shadow-2xl">
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-zinc-800 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 block">Services</span>
              <h2 className="font-serif text-5xl md:text-6xl text-white mb-8">Impact through <br/> <span className="italic text-zinc-500">Precision.</span></h2>
              <p className="text-zinc-400 max-w-sm text-lg leading-relaxed">
                Tailored consulting services designed to create measurable outcomes for organizations and communities.
              </p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {[
                { title: 'Research & Analysis', sub: 'Transforming complex data into clear, actionable policy recommendations.' },
                { title: 'Capacity Building', sub: 'Tailored training programs that strengthen institutional capacity.' },
                { title: 'Monitoring & Evaluation', sub: 'Robust frameworks to track performance and demonstrate outcomes.' },
                { title: 'Strategy & Advisory', sub: 'Integrating sustainability principles into decision making.' },
                { title: 'Content Development', sub: 'Designing engaging learning materials that inspire change.' },
                { title: 'Proposal Development', sub: 'Articulating vision and methodology to stakeholders and funders.' },
              ].map((service, i) => (
                <div key={i} className="border-t border-zinc-800 pt-6 hover:border-zinc-600 transition-colors cursor-default group">
                  <h4 className="text-2xl font-serif text-white mb-3 group-hover:italic transition-all">{service.title}</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">{service.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- TEAM --- */}
      <section id="team" className="py-32 lg:py-40 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
           <div className="text-center mb-32">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Our People</span>
              <h2 className="font-serif text-5xl md:text-7xl mt-6 text-zinc-900">The Collaborators</h2>
           </div>
          
          <div className="space-y-32">
            {/* Founder 1 */}
            <div className="group grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 border-b border-zinc-100 pb-24">
              <div className="lg:col-span-4">
                <div className="w-full aspect-[4/5] bg-zinc-100 mb-8 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700 rounded-sm">
                    <div className="absolute inset-0 bg-zinc-200"></div>
                </div>
                <h3 className="font-serif text-4xl mb-2">Arti Mishra Saran</h3>
                <span className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Founder</span>
                <div className="text-sm text-zinc-500 space-y-1">
                  <p>Master's in Business Management</p>
                  <p>Diploma in Business Sustainability</p>
                </div>
              </div>
              <div className="lg:col-span-8 flex flex-col justify-center">
                <p className="text-2xl md:text-3xl font-serif font-light leading-relaxed text-zinc-600 mb-12">
                  "Arti is a research and consulting professional with over 15 years of experience in renewable energy, sustainability, and the development sector."
                </p>
                <div className="grid grid-cols-2 gap-8">
                     <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-zinc-400 mb-2">Focus</h4>
                        <p className="text-zinc-800">Policy Advocacy & Strategy</p>
                     </div>
                     <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-zinc-400 mb-2">Connect</h4>
                        <a href="#" className="text-zinc-800 border-b border-zinc-200 hover:border-zinc-900 transition-colors">LinkedIn Profile</a>
                     </div>
                </div>
              </div>
            </div>

            {/* Founder 2 */}
            <div className="group grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
               <div className="lg:col-span-4">
                 <div className="w-full aspect-[4/5] bg-zinc-100 mb-8 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700 rounded-sm">
                    <div className="absolute inset-0 bg-zinc-200"></div>
                </div>
                <h3 className="font-serif text-4xl mb-2">Dr. V Neha</h3>
                <span className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Co-Founder</span>
                <div className="text-sm text-zinc-500 space-y-1">
                  <p>PhD in Environmental Policy</p>
                  <p>Learning Designer</p>
                </div>
              </div>
              <div className="lg:col-span-8 flex flex-col justify-center">
                <p className="text-2xl md:text-3xl font-serif font-light leading-relaxed text-zinc-600 mb-12">
                  "Dr. Neha brings together sustainability, environmental policy, and community-centred practice. She has designed interdisciplinary learning programmes across the sector."
                </p>
                 <div className="grid grid-cols-2 gap-8">
                     <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-zinc-400 mb-2">Focus</h4>
                        <p className="text-zinc-800">Environmental Policy & Education</p>
                     </div>
                     <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-zinc-400 mb-2">Connect</h4>
                        <a href="#" className="text-zinc-800 border-b border-zinc-200 hover:border-zinc-900 transition-colors">LinkedIn Profile</a>
                     </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- INSIGHTS --- */}
      <section id="insights" className="py-32 bg-zinc-50 border-y border-zinc-200 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
             <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Journal</span>
                <h2 className="font-serif text-5xl md:text-6xl mt-4">Latest Insights</h2>
             </div>
             <button className="text-sm border-b border-zinc-900 pb-1 hover:pb-2 transition-all">View All Articles</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200">
            {[
              { tag: 'Report', title: 'The Future of Sustainable Policy in India' },
              { tag: 'Opinion', title: 'Bridging the Gap: Mental Health & Climate' },
              { tag: 'Event', title: 'Webinar: ESG Frameworks for Startups' },
              { tag: 'Blog', title: 'Neurodiversity in the Modern Workplace' }
            ].map((post, i) => (
              <div key={i} className="bg-white p-10 hover:bg-zinc-50 transition-all cursor-pointer group h-full flex flex-col justify-between">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100 px-3 py-1 text-zinc-500 mb-6 inline-block">{post.tag}</span>
                    <h3 className="font-serif text-2xl leading-tight group-hover:underline decoration-zinc-300 underline-offset-4">{post.title}</h3>
                </div>
                <div className="mt-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  Read <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT & FOOTER --- */}
      <section id="contact" className="pt-40 pb-12 px-6 lg:px-12 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-40">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Contact</span>
              <h2 className="font-serif text-7xl md:text-8xl mb-8 mt-6">Let's talk.</h2>
              <p className="text-zinc-500 text-xl font-light mb-16 max-w-md leading-relaxed">
                Ready to turn evidence into action? Reach out to discuss how we can support your sustainability goals.
              </p>
              
              <div className="space-y-8">
                <a href="mailto:info@thecapitalplab.com" className="flex items-center gap-6 text-2xl font-serif hover:italic transition-all group">
                  <span className="w-12 h-12 border border-zinc-200 rounded-full flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors"><Mail size={20} /></span>
                  info@thecapitalplab.com
                </a>
                <div className="flex items-center gap-6 text-2xl font-serif group">
                  <span className="w-12 h-12 border border-zinc-200 rounded-full flex items-center justify-center"><Globe size={20} /></span>
                  Based in India
                </div>
              </div>
            </div>

            <form className="space-y-12 mt-12 lg:mt-0">
               <div className="group">
                  <input type="text" className="w-full bg-transparent border-b border-zinc-200 py-6 text-3xl font-serif placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors" placeholder="Your Name" />
               </div>
               <div className="group">
                  <input type="email" className="w-full bg-transparent border-b border-zinc-200 py-6 text-3xl font-serif placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors" placeholder="Email Address" />
               </div>
               <div className="group">
                  <textarea rows={1} className="w-full bg-transparent border-b border-zinc-200 py-6 text-3xl font-serif placeholder:text-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors resize-none" placeholder="Tell us about your project..." />
               </div>
               <button className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-zinc-900 hover:text-zinc-600 transition-colors mt-8">
                 Send Message <ArrowRight />
               </button>
            </form>
          </div>

          <div className="border-t border-zinc-100 pt-12 flex flex-col md:flex-row justify-between items-end">
            <div className="mb-8 md:mb-0">
               <h2 className="font-serif text-[10vw] leading-none text-zinc-900 select-none pointer-events-none opacity-90">
                 The Capital P Lab
               </h2>
            </div>
            <div className="flex gap-12 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 md:mb-8">
              <a href="#" className="hover:text-zinc-900 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">Twitter</a>
              <span className="text-zinc-300">© 2024</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}