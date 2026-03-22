/* eslint-disable @next/next/no-img-element */
const TEAM = [
  { name: 'Suanna Tumlinson', title: 'Chief Executive Officer', img: '/images/team-suanna.jpg' },
  { name: 'Kenneth Tumlinson', title: 'Chief Operations Officer', img: '/images/team-kenneth.jpg' },
  { name: 'Justin Tumlinson', title: 'President', img: '/images/team-justin.jpg' },
  { name: 'Glenn Garrett', title: 'Vice President', img: '/images/team-glenn.jpg' },
  { name: 'Steven Grymes', title: 'Chief Financial Officer', img: '/images/team-steven.jpg' },
  { name: 'Brian Frizzell', title: 'Director of Network Solutions', img: '/images/team-brian.jpg' },
  { name: 'Mark Swartz', title: 'Director of Pre-Construction', img: '/images/team-mswartz.jpg' },
  { name: 'Vernon Long', title: 'Senior Project Executive', img: '/images/team-vlong.jpg' },
  { name: 'Dereck Crockett', title: 'Senior Project Manager', img: '/images/team-dcrockett.jpg' },
  { name: 'Cody Henry', title: 'Senior Project Manager', img: '/images/team-chenry.jpg' },
  { name: 'Joe Hill', title: 'Senior Project Manager', img: '/images/team-joehill.jpg' },
  { name: 'Jack Spurlock', title: 'General Superintendent', img: '/images/team-jack.jpg' },
  { name: 'Ross Kasher', title: 'Senior Estimator', img: '/images/team-rkasher.jpg' },
  { name: 'Anthony Vigliotti', title: 'Senior Estimator', img: '/images/team-anthony.jpg' },
  { name: 'Donavon Woolley', title: 'Senior Estimator, RCDD', img: '/images/team-dwoolley.jpg' },
  { name: 'David Rudzinski', title: 'Senior Estimator', img: '/images/team-drudzinski.jpg' },
  { name: 'Ulisses Galarza', title: 'Junior Estimator', img: '/images/team-ugarlaza.jpg' },
];

const SERVICES = [
  { title: 'Electrical Construction', desc: 'Commercial, industrial, medical, high-tech, educational, and institutional power systems.', icon: '⚡' },
  { title: 'Low Voltage Systems', desc: 'Structured cabling, fiber optics, AV, security, access control, and DAS systems.', icon: '🔌' },
  { title: 'Design-Assist & Build', desc: 'Collaborative design-build with BIM coordination and value engineering from day one.', icon: '📐' },
  { title: 'Pre-Construction Planning', desc: 'Budgetary estimating, constructability reviews, and scheduling from concept through IFC.', icon: '📋' },
  { title: 'Instrumentation & Controls', desc: 'PLC, SCADA, building automation, and process control system integration.', icon: '🎛️' },
  { title: 'Medium Voltage', desc: 'Medium voltage installation, termination, splicing, and testing up to 35kV.', icon: '🔋' },
  { title: 'Fire Alarm Systems', desc: 'Design, installation, programming, and commissioning of fire alarm and life safety systems.', icon: '🚨' },
];

const MARKETS = [
  'Higher Education', 'K-12 Education', 'Healthcare', 'Commercial', 'Manufacturing',
  'Municipal', 'Bio-Medical', 'Hospitality', 'Water/Wastewater', 'Heavy Industry',
  'Data Centers', 'Tenant Finish-out',
];

const PROJECTS = [
  { name: 'UT Engineering Discovery Building', city: 'Austin', gc: 'Hensel Phelps', value: '$1.1M', status: 'Active' },
  { name: 'Employee Retirement System', city: 'Austin', gc: 'Flintco', value: '$335K', status: 'Active' },
  { name: 'VA Met Center', city: 'Austin', gc: 'Joeris', value: '$660K', status: 'Complete' },
  { name: 'Scheels Cedar Park', city: 'Cedar Park', gc: 'Sampson', value: '$580K', status: 'Active' },
  { name: 'Georgetown ISD Frost ES', city: 'Georgetown', gc: 'Bartlett Cocke', value: '$269K', status: 'Active' },
  { name: 'DSISD Elementary #6', city: 'Dripping Springs', gc: 'Bartlett Cocke', value: '$269K', status: 'Active' },
];

const CLIENTS = [
  'UT Austin', 'Austin ISD', 'U.S. Veterans Affairs', 'Texas State University',
  'Georgetown ISD', 'Comal ISD', 'Dripping Springs ISD', 'Austin Community College',
  'Manor ISD', 'Hutto ISD', 'Bastrop ISD', 'Pflugerville ISD',
];

export default function Home() {
  return (
    <>
      {/* ══ NAVIGATION ══════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 w-full z-50 bg-te-dark/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Tumlinson" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight">TUMLINSON</span>
              <span className="text-lg font-light tracking-tight text-te-teal ml-1">NETWORKS</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#services" className="hover:text-te-teal transition-colors">Services</a>
            <a href="#projects" className="hover:text-te-teal transition-colors">Projects</a>
            <a href="#about" className="hover:text-te-teal transition-colors">About</a>
            <a href="#team" className="hover:text-te-teal transition-colors">Team</a>
            <a href="#careers" className="hover:text-te-teal transition-colors">Careers</a>
            <a href="#contact" className="hover:text-te-teal transition-colors">Contact</a>
          </div>
          <a href="https://tumlinsonnetworks.vercel.app/login" target="_blank" rel="noopener"
            className="px-4 py-2 bg-te-teal hover:bg-te-teal-light text-white text-sm font-semibold rounded-lg transition-colors">
            Login
          </a>
        </div>
      </nav>

      {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-te-dark via-gray-900 to-te-dark" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(/images/hero.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-te-dark via-transparent to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2">
              TUMLINSON
            </h1>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-te-teal mb-8">
              NETWORKS
            </h1>
          </div>
          <p className="animate-fade-in-up delay-100 text-xl md:text-2xl font-light text-gray-300 mb-4 max-w-2xl mx-auto">
            Building Texas Infrastructure — From Power to Data
          </p>
          <p className="animate-fade-in-up delay-200 text-base text-gray-500 mb-10 max-w-xl mx-auto">
            Full-service electrical and low-voltage contractor serving Central Texas
          </p>
          <div className="animate-fade-in-up delay-300 flex items-center justify-center gap-4">
            <a href="#projects" className="px-8 py-3.5 bg-te-teal hover:bg-te-teal-light text-white font-semibold rounded-lg transition-all hover:scale-105">
              View Our Work
            </a>
            <a href="#contact" className="px-8 py-3.5 border border-white/20 hover:border-te-teal text-white font-semibold rounded-lg transition-all hover:scale-105">
              Get a Quote
            </a>
          </div>

          {/* Stats strip */}
          <div className="animate-fade-in-up delay-400 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              ['50+', 'Active Projects'],
              ['$25M+', 'Under Contract'],
              ['20+', 'Years Experience'],
              ['100+', 'Team Members'],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-te-teal tabular-nums">{num}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ══ DIVISIONS ═════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">Our Divisions</h2>
          <p className="text-center text-3xl md:text-4xl font-bold mb-16">Two Disciplines. One Team.</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* DIV 26 */}
            <div className="group relative bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-te-teal/40 transition-all hover:shadow-[0_0_40px_rgba(22,99,92,0.15)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl">⚡</div>
                <div>
                  <p className="text-xs text-yellow-400 uppercase tracking-wider font-semibold">Division 26</p>
                  <h3 className="text-2xl font-bold">Electrical</h3>
                </div>
              </div>
              <ul className="space-y-3 text-gray-400">
                {['Power Distribution', 'Lighting & Controls', 'Medium Voltage', 'Fire Alarm Systems', 'Instrumentation & Controls', 'Emergency/Standby Power'].map(s => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* DIV 27 */}
            <div className="group relative bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-te-teal/40 transition-all hover:shadow-[0_0_40px_rgba(22,99,92,0.15)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-te-teal/10 flex items-center justify-center text-2xl">🔌</div>
                <div>
                  <p className="text-xs text-te-teal uppercase tracking-wider font-semibold">Division 27</p>
                  <h3 className="text-2xl font-bold">Low Voltage</h3>
                </div>
              </div>
              <ul className="space-y-3 text-gray-400">
                {['Structured Cabling (Cat6/Cat6A)', 'Fiber Optics (SM/MM)', 'Audio Visual Systems', 'Security & Access Control', 'DAS / Wireless', 'Telecom Rooms & Infrastructure'].map(s => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-te-teal/60" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══════════════════════════════════════════════════════ */}
      <section id="services" className="py-24 bg-te-dark">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">What We Do</h2>
          <p className="text-center text-3xl md:text-4xl font-bold mb-16">Our Services</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {SERVICES.map(s => (
              <div key={s.title} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50 hover:border-te-teal/30 transition-all group">
                <span className="text-3xl mb-4 block">{s.icon}</span>
                <h3 className="text-lg font-bold mb-2 group-hover:text-te-teal transition-colors">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══════════════════════════════════════════════════════ */}
      <section id="projects" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">Portfolio</h2>
          <p className="text-center text-3xl md:text-4xl font-bold mb-16">Featured Projects</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map(p => (
              <div key={p.name} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-te-teal/30 transition-all group">
                <div className="h-44 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-5xl opacity-20">🏗️</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${p.status === 'Active' ? 'bg-te-teal/20 text-te-teal' : 'bg-gray-700 text-gray-400'}`}>{p.status}</span>
                    <span className="text-sm font-mono font-bold text-te-teal">{p.value}</span>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-te-teal transition-colors">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{p.city} &middot; {p.gc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MARKETS ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-te-dark">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">Industries</h2>
          <p className="text-center text-3xl md:text-4xl font-bold mb-16">Markets We Serve</p>

          <div className="flex flex-wrap justify-center gap-3">
            {MARKETS.map(m => (
              <span key={m} className="px-5 py-2.5 bg-gray-900 rounded-full text-sm text-gray-300 border border-gray-800 hover:border-te-teal/40 hover:text-white transition-all cursor-default">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CLIENTS ═══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-950 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-gray-600 mb-8">Trusted by Texas&apos;s Leading Institutions</p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {CLIENTS.map(c => (
              <span key={c} className="text-sm font-semibold text-gray-500 hover:text-te-teal transition-colors">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ABOUT ═════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 bg-te-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">About Us</h2>
              <p className="text-3xl md:text-4xl font-bold mb-6">Experienced. Professional. Dedicated.</p>
              <p className="text-gray-400 leading-relaxed mb-6">
                Tumlinson Electric is a full-service electrical contractor providing construction services throughout the state of Texas.
                Our people are what make Tumlinson Electric the company that it is. The management brings a vast history of leadership,
                experience and integrity needed to manage and grow our company.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                From the pre-construction phase to owner occupancy and beyond, we are committed to devoting the necessary time and
                resources needed to complete every project safely, on schedule, and within budget.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[['Quality', 'Commitment to excellence in every connection'], ['Safety', 'Zero-incident culture across all jobsites'], ['Team', 'Collaborative approach from bid to closeout'], ['Innovation', 'Technology-driven project management']].map(([t, d]) => (
                  <div key={t} className="p-4 bg-gray-900/50 rounded-xl border border-gray-800/50">
                    <h4 className="font-bold text-te-teal mb-1">{t}</h4>
                    <p className="text-xs text-gray-500">{d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src="/images/hero.png" alt="Tumlinson Electric at work" className="rounded-2xl w-full object-cover shadow-2xl" />
              <div className="absolute -bottom-6 -left-6 bg-te-teal text-white px-6 py-4 rounded-xl shadow-xl">
                <p className="text-3xl font-black">20+</p>
                <p className="text-sm font-medium opacity-80">Years in Business</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TEAM ══════════════════════════════════════════════════════════ */}
      <section id="team" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">Our People</h2>
          <p className="text-center text-3xl md:text-4xl font-bold mb-16">Meet the Team</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {TEAM.map(t => (
              <div key={t.name} className="group text-center">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-gray-800">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <h4 className="text-sm font-bold leading-tight">{t.name}</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CAREERS ═══════════════════════════════════════════════════════ */}
      <section id="careers" className="py-24 bg-te-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-te-teal/10 to-transparent rounded-2xl p-10 border border-te-teal/20">
            <h2 className="text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">Careers</h2>
            <p className="text-3xl md:text-4xl font-bold mb-4">Join Our Team — We&apos;re Hiring</p>
            <p className="text-gray-400 mb-8 max-w-2xl">
              We&apos;re looking for skilled professionals to join our growing team. Competitive pay, benefits, and the opportunity to work on Central Texas&apos;s biggest projects.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {['Assistant Project Manager', 'Project Manager', 'Journeyman Electricians', 'State Apprentice Electricians', 'Low Voltage Technicians', 'Trimble Operator/Surveyor'].map(j => (
                <div key={j} className="flex items-center gap-3 bg-gray-900/50 rounded-xl px-4 py-3 border border-gray-800/50">
                  <span className="w-2 h-2 rounded-full bg-te-teal" />
                  <span className="text-sm font-medium">{j}</span>
                </div>
              ))}
            </div>

            <a href="mailto:bwatson@tumlinsonelectric.com" className="inline-flex items-center gap-2 px-6 py-3 bg-te-teal hover:bg-te-teal-light text-white font-semibold rounded-lg transition-all hover:scale-105">
              Apply Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ═══════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">Get in Touch</h2>
          <p className="text-center text-3xl md:text-4xl font-bold mb-16">Connect With Us</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-800">
              <div className="w-12 h-12 rounded-full bg-te-teal/10 flex items-center justify-center mx-auto mb-4 text-2xl">📞</div>
              <h3 className="font-bold mb-2">Call Us</h3>
              <a href="tel:5126934444" className="text-te-teal hover:text-te-teal-light transition-colors text-lg font-mono">512-693-4444</a>
            </div>
            <div className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-800">
              <div className="w-12 h-12 rounded-full bg-te-teal/10 flex items-center justify-center mx-auto mb-4 text-2xl">✉️</div>
              <h3 className="font-bold mb-2">Email Us</h3>
              <a href="mailto:bwatson@tumlinsonelectric.com" className="text-te-teal hover:text-te-teal-light transition-colors text-sm">bwatson@tumlinsonelectric.com</a>
            </div>
            <div className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-800">
              <div className="w-12 h-12 rounded-full bg-te-teal/10 flex items-center justify-center mx-auto mb-4 text-2xl">📍</div>
              <h3 className="font-bold mb-2">Visit Us</h3>
              <p className="text-gray-400 text-sm">200 University Blvd<br />Suite 225-286<br />Round Rock, TX 78665</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
      <footer className="py-12 bg-te-dark border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/images/logo.png" alt="TE" className="h-8 w-auto" />
                <div>
                  <span className="text-sm font-bold">TUMLINSON</span>
                  <span className="text-sm font-light text-te-teal ml-1">NETWORKS</span>
                </div>
              </div>
              <p className="text-xs text-gray-600">Full-service electrical and low-voltage contractor serving Central Texas.</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Electrical Construction</li>
                <li>Low Voltage / Cabling</li>
                <li>Design-Assist & Build</li>
                <li>Pre-Construction</li>
                <li>Fire Alarm</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Our Team</li>
                <li>Projects</li>
                <li>Careers</li>
                <li>Safety</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>512-693-4444</li>
                <li>bwatson@tumlinsonelectric.com</li>
                <li>Round Rock, TX 78665</li>
                <li className="pt-2">License: EC-31651</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex items-center justify-between">
            <p className="text-xs text-gray-600">&copy; 2026 Tumlinson Electric LLC. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/tumlinsonelectric/" target="_blank" rel="noopener" className="text-gray-600 hover:text-te-teal transition-colors text-sm">Facebook</a>
              <a href="https://www.linkedin.com/company/tumlinson-electric" target="_blank" rel="noopener" className="text-gray-600 hover:text-te-teal transition-colors text-sm">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
