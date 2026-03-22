/* eslint-disable @next/next/no-img-element */

// ── Complete team roster from tumlinsonelectric.com ────────────────────────
const EXEC = [
  { name: 'Suanna Tumlinson', title: 'Chief Executive Officer', img: '/images/Suanna-Tumlinson.jpg' },
  { name: 'Kenneth Tumlinson', title: 'Chief Operations Officer', img: '/images/Kenneth-Tumlinson.jpg' },
  { name: 'Justin Tumlinson', title: 'President', img: '/images/jUSTIN-tUMLINSON.jpg' },
  { name: 'Glenn Garrett', title: 'Vice President', img: '/images/Glenn-Garrett.jpg' },
  { name: 'Steven Grymes', title: 'Chief Financial Officer', img: '/images/Steevn-Grymes.jpg' },
  { name: 'Brian Frizzell', title: 'Director of Network Solutions', img: '/images/Brian.jpg' },
  { name: 'Mark Swartz', title: 'Director of Pre-Construction', img: '/images/MSwartz.jpg' },
];

const ESTIMATING = [
  { name: 'Ross Kasher', title: 'Senior Estimator', img: '/images/RKasher.jpg' },
  { name: 'Anthony Vigliotti', title: 'Senior Estimator', img: '/images/Anthony.jpg' },
  { name: 'Donavon Woolley', title: 'Senior Estimator, RCDD', img: '/images/DWoolley.jpg' },
  { name: 'David Rudzinski', title: 'Senior Estimator', img: '/images/DRudzinksi.jpg' },
  { name: 'Moses Calderon', title: 'Low Voltage Estimator', img: '/images/MCalderon.jpg' },
  { name: 'Manuel Delgado', title: 'Senior Estimator', img: '/images/MDelgado-1.jpg' },
  { name: 'Robert O\'Conner', title: 'Senior Estimator', img: '/images/numbered-11.png' },
  { name: 'Nicholas Young', title: 'Senior Estimator', img: '/images/Nicholas-Young.png' },
  { name: 'Ulisses Galarza', title: 'Junior Estimator', img: '/images/UGarlaza.jpg' },
  { name: 'Deborah Blunt', title: 'Junior Estimator', img: '/images/DeborahBlunt-new.png' },
];

const PM = [
  { name: 'Vernon Long', title: 'Senior Project Executive', img: '/images/VLong-Web.jpg' },
  { name: 'Dereck Crockett', title: 'Senior Project Manager', img: '/images/DCrockett.jpg' },
  { name: 'Cody Henry', title: 'Senior Project Manager', img: '/images/CHenry.jpg' },
  { name: 'Joe Hill', title: 'Senior Project Manager', img: '/images/Joe-Hill.jpg' },
  { name: 'Jeremy Miles', title: 'Senior Project Executive', img: '/images/numbered-17.png' },
  { name: 'Eric Middaugh', title: 'Senior Project Manager', img: '/images/EMiddaugh.jpg' },
  { name: 'Chris Durocher', title: 'Senior Project Executive', img: '/images/CDurocher-Web.jpg' },
  { name: 'Will Thornell', title: 'Project Manager', img: '/images/Will-Thornell.jpg' },
  { name: 'Logan Sunvison', title: 'Senior Project Manager', img: '/images/LSunvison.jpg' },
  { name: 'Jason Salas', title: 'Senior Project Manager', img: '/images/numbered-22.png' },
  { name: 'Grant Garrett', title: 'Project Manager', img: '/images/Grant-new.png' },
  { name: 'Jack Spurlock', title: 'Project Manager', img: '/images/Jack-Spurlock.jpg' },
  { name: 'Rolando Reyes', title: 'Project Manager', img: '/images/numbered-25.png' },
  { name: 'Terri Lyon', title: 'Assistant Project Manager', img: '/images/numbered-26.png' },
  { name: 'Blake Watson', title: 'Project Manager', img: '/images/numbered-27.png' },
  { name: 'Landon Pritchett', title: 'Assistant Project Manager', img: '/images/numbered-28.png' },
  { name: 'Joshua Brown', title: 'Assistant Project Manager', img: '/images/numbered-29.png' },
  { name: 'Trae Sammons', title: 'Assistant Project Manager', img: '/images/numbered-30.png' },
  { name: 'Chase Heffernan', title: 'Assistant Project Manager', img: '/images/numbered-31.png' },
  { name: 'Shawn McDade', title: 'Senior Project Manager', img: '/images/Shawn-new.png' },
  { name: 'Clay Hurst', title: 'Senior Project Manager', img: '/images/numbered-33.png' },
  { name: 'Dallas Metcalf', title: 'Senior Project Manager', img: '/images/numbered-34.png' },
  { name: 'Brandon Garrett', title: 'Safety Manager', img: '/images/numbered-40.png' },
];

const FIELD = [
  { name: 'Nick Arellano', title: 'General Superintendent' }, { name: 'Mike Nelson', title: 'General Superintendent' },
  { name: 'Donovan Selvera', title: 'General Superintendent' }, { name: 'Daniel Taylor', title: 'GS - Lighting Controls' },
  { name: 'Ray Munoz', title: 'General Superintendent' }, { name: 'Angel Carbajal', title: 'Low Voltage' },
  { name: 'James Peebles', title: 'General Superintendent' },
  { name: 'Matt Winfield', title: 'Superintendent' }, { name: 'Chris Allen', title: 'Superintendent' },
  { name: 'Mariano Ayala', title: 'Superintendent' }, { name: 'Chris Marron', title: 'Superintendent' },
  { name: 'Roland Navejas', title: 'Superintendent' }, { name: 'Peter Duckworth', title: 'Superintendent' },
  { name: 'Jim Burns', title: 'Superintendent' }, { name: 'Scott Brown', title: 'Superintendent' },
  { name: 'Josh Armendariz', title: 'Superintendent' }, { name: 'Silvio Mayen', title: 'Superintendent' },
  { name: 'Brad Newcomb', title: 'Superintendent' },
];

const FOREMEN = [
  'Erik Carroll', 'Chris Ramos', 'David Donnelly', 'Jesse Merlan', 'Jeff Evans',
  'Jeremiah Elizondo', 'Martin Rodriguez', 'Ernesto Barajas', 'Raymond Silva', 'Brooks Horridge',
  'Ben Dinscore', 'Luis Rios', 'Geoff Phillips', 'Jesse Padilla', 'Lucio Valdez',
  'Damarcus Dasher', 'Joseph Lowery', 'Steven Haycock', 'Jett Moore', 'Ben Watson',
  'Paul Rocha', 'Marcos Ponce', 'Corey Thomas', 'Decrayon Banks', 'Jose Alvarez',
  'Bradley Meeker', 'Miguel Juarez', 'Luis Ponce', 'Devyn Halloran', 'Allan Velasquez',
  'Andrew Roland', 'Frank Jaimes', 'Franky Rodriguez', 'Edgar Carbajal',
];

const BIM = [
  { name: 'Jeff Crim', title: 'BIM Manager' }, { name: 'Kamie Crim', title: 'BIM Coordinator' },
  { name: 'Cory Forsythe', title: 'Assistant BIM Manager' }, { name: 'William Blades', title: 'BIM Modeler' },
  { name: 'Elise Franki', title: 'BIM Coordinator' }, { name: 'Taylor Jessen', title: 'BIM Coordinator' },
  { name: 'Tanner Felkins', title: 'BIM Modeler' }, { name: 'Ian Danos', title: 'BIM Coordinator' },
  { name: 'Natalie Wendt', title: 'Project Support Manager' }, { name: 'Dyna Boggs', title: 'Detailing Manager' },
  { name: 'Jacquie Palmer', title: 'Senior Detailer' }, { name: 'Brian Anderson', title: 'BIM Coordinator' },
  { name: 'Troy Harrell', title: 'BIM Coordinator' }, { name: 'Siavesh Pourfazli', title: 'BIM Modeler' },
  { name: 'Kevin Adrian', title: 'Project Support Manager' },
];

const MGMT = [
  { name: 'Logan Coker', title: 'Software Implementation Manager' },
  { name: 'Kelvin Brown', title: 'Procurement Verification Manager' },
  { name: 'Shaun Blumhoff', title: 'Director of Procurement' },
  { name: 'Marco Jimenez', title: 'Tool Manager' },
  { name: 'Sandra Garrett', title: 'Analytics Manager' },
  { name: 'Emily Gleich', title: 'Buyer Agent' },
  { name: 'Greg Aguado', title: 'QA/QC Manager' },
  { name: 'Robert Rybarski', title: 'Senior Verification Analyst' },
  { name: 'Zachary Evans', title: 'System Integrations Manager' },
  { name: 'Chris Callahan', title: 'Field Support Process Manager' },
  { name: 'Theresa Duffey', title: 'Verification Analyst' },
];

const ADMIN = [
  { name: 'Brandi Watson', title: 'Office Manager' }, { name: 'Grace Roberts', title: 'HR/Payroll Manager' },
  { name: 'Jackie Jury', title: 'HR/Payroll Admin' }, { name: 'Sandra Swartz', title: 'Project Admin/Estimating' },
  { name: 'Sara Justice', title: 'Accounts Receivable Manager' }, { name: 'Shena Meyer', title: 'Executive Assistant' },
  { name: 'Jayme Johns', title: 'Accounts Payable Manager' }, { name: 'Mayra Wiley', title: 'HR/Payroll Admin' },
  { name: 'Jennifer Peebles', title: 'Operations Manager' },
];

const SERVICES = [
  { title: 'Electrical Construction', desc: 'Commercial, industrial, medical, high-tech, educational, and institutional power systems.', icon: '⚡' },
  { title: 'Low Voltage Systems', desc: 'Structured cabling, fiber optics, AV, security, access control, and DAS systems.', icon: '🔌' },
  { title: 'Design-Assist & Build', desc: 'Collaborative design-build with BIM coordination and value engineering.', icon: '📐' },
  { title: 'Pre-Construction Planning', desc: 'Budgetary estimating, constructability reviews, and scheduling.', icon: '📋' },
  { title: 'Instrumentation & Controls', desc: 'PLC, SCADA, building automation, and process control integration.', icon: '🎛️' },
  { title: 'Medium Voltage', desc: 'Installation, termination, splicing, and testing up to 35kV.', icon: '🔋' },
  { title: 'Fire Alarm Systems', desc: 'Design, installation, programming, and commissioning of life safety.', icon: '🚨' },
  { title: 'Budgetary Estimating', desc: 'Detailed cost analysis, value engineering, and competitive pricing.', icon: '💰' },
];

const MARKETS = ['Higher Education', 'K-12 Education', 'Healthcare', 'Commercial', 'Manufacturing', 'Municipal', 'Bio-Medical', 'Hospitality', 'Water/Wastewater', 'Heavy Industry', 'Data Centers', 'Tenant Finish-out'];

function TeamGrid({ people, showImg = true }: { people: { name: string; title: string; img?: string }[]; showImg?: boolean }) {
  return (
    <div className={`grid ${showImg ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'} gap-3`}>
      {people.map(p => (
        <div key={p.name} className="glass-card rounded-xl overflow-hidden text-center group">
          {showImg && p.img ? (
            <div className="aspect-square bg-gray-800 overflow-hidden">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
            </div>
          ) : showImg ? (
            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-2xl font-black text-gray-700">{p.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
          ) : null}
          <div className={`${showImg ? 'p-2.5' : 'p-3'}`}>
            <h4 className="text-xs font-bold leading-tight text-white">{p.name}</h4>
            <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{p.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function NameGrid({ names, title: roleTitle }: { names: string[]; title: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {names.map(n => (
        <span key={n} className="glass px-3 py-1.5 rounded-lg text-xs text-gray-300">
          <span className="font-medium text-white">{n}</span> <span className="text-gray-600">· {roleTitle}</span>
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ══ NAV ═══════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="TE" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight">TUMLINSON</span>
              <span className="text-lg font-light tracking-tight text-te-teal ml-1">ELECTRIC</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            {['services', 'projects', 'about', 'team', 'careers', 'safety', 'contact'].map(s => (
              <a key={s} href={`#${s}`} className="hover:text-te-teal transition-colors capitalize">{s}</a>
            ))}
          </div>
          <a href="https://tumlinsonnetworks.vercel.app/login" target="_blank" rel="noopener"
            className="glass-teal px-4 py-2 text-white text-sm font-semibold rounded-lg hover:scale-105 transition-transform">
            Portal
          </a>
        </div>
      </nav>

      {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background orbs */}
        <div className="orb w-96 h-96 bg-te-teal top-1/4 -left-48 animate-float" />
        <div className="orb w-80 h-80 bg-blue-600 bottom-1/4 -right-40 animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-te-dark via-gray-950 to-te-dark" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'url(/images/Tumlinson_Electric_02.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <p className="text-sm uppercase tracking-[0.4em] text-te-teal font-semibold mb-6">Experienced · Professional · Dedicated</p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2">TUMLINSON</h1>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-te-teal glow-teal mb-8">ELECTRIC</h1>
          </div>
          <p className="animate-fade-in-up delay-100 text-xl md:text-2xl font-light text-gray-300 mb-4 max-w-2xl mx-auto">
            Providing the financial strength, skilled staff, knowledge &amp; resources that every project demands.
          </p>
          <p className="animate-fade-in-up delay-200 text-base text-gray-500 mb-10 max-w-xl mx-auto">
            Full-service electrical and low-voltage contractor · Central Texas
          </p>
          <div className="animate-fade-in-up delay-300 flex items-center justify-center gap-4">
            <a href="#projects" className="glass-teal px-8 py-3.5 text-white font-semibold rounded-xl hover:scale-105 transition-transform">View Our Work</a>
            <a href="#contact" className="glass px-8 py-3.5 text-white font-semibold rounded-xl hover:scale-105 transition-transform">Get a Quote</a>
          </div>

          <div className="animate-fade-in-up delay-400 mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[['50+', 'Active Projects'], ['$25M+', 'Under Contract'], ['20+', 'Years Experience'], ['130+', 'Team Members']].map(([n, l]) => (
              <div key={l} className="glass rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-te-teal tabular-nums">{n}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DIVISIONS ═════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="orb w-72 h-72 bg-yellow-500 top-0 left-1/4" />
        <div className="orb w-72 h-72 bg-te-teal bottom-0 right-1/4" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">Our Divisions</h2>
          <p className="text-center text-3xl md:text-4xl font-bold mb-16">Two Disciplines. One Team.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl">⚡</div>
                <div>
                  <p className="text-xs text-yellow-400 uppercase tracking-wider font-semibold">Division 26</p>
                  <h3 className="text-2xl font-bold">Electrical</h3>
                </div>
              </div>
              <ul className="space-y-3 text-gray-400">
                {['Power Distribution', 'Lighting & Controls', 'Medium Voltage', 'Fire Alarm Systems', 'Instrumentation & Controls', 'Emergency/Standby Power'].map(s => (
                  <li key={s} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60 glow-dot" />{s}</li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-te-teal/10 flex items-center justify-center text-2xl">🔌</div>
                <div>
                  <p className="text-xs text-te-teal uppercase tracking-wider font-semibold">Division 27</p>
                  <h3 className="text-2xl font-bold">Low Voltage</h3>
                </div>
              </div>
              <ul className="space-y-3 text-gray-400">
                {['Structured Cabling (Cat6/Cat6A)', 'Fiber Optics (SM/MM)', 'Audio Visual Systems', 'Security & Access Control', 'DAS / Wireless', 'Telecom Rooms & Infrastructure'].map(s => (
                  <li key={s} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-te-teal/60 glow-dot" />{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══════════════════════════════════════════════════════ */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">What We Do</h2>
          <p className="text-center text-3xl md:text-4xl font-bold mb-16">Our Services</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map(s => (
              <div key={s.title} className="glass-card rounded-xl p-6">
                <span className="text-3xl mb-4 block">{s.icon}</span>
                <h3 className="text-base font-bold mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══════════════════════════════════════════════════════ */}
      <section id="projects" className="py-24 relative overflow-hidden">
        <div className="orb w-96 h-96 bg-te-teal top-1/3 -right-48" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">Portfolio</h2>
          <p className="text-center text-3xl md:text-4xl font-bold mb-16">Featured Projects</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'UT Engineering Discovery Building', city: 'Austin', gc: 'Hensel Phelps', value: '$1.1M', status: 'Active', img: '/images/project-1.png' },
              { name: 'Employee Retirement System', city: 'Austin', gc: 'Flintco', value: '$335K', status: 'Active', img: '/images/project-2.png' },
              { name: 'VA Met Center', city: 'Austin', gc: 'Joeris', value: '$660K', status: 'Complete', img: '/images/project-3.png' },
              { name: 'Scheels Cedar Park', city: 'Cedar Park', gc: 'Sampson', value: '$580K', status: 'Active', img: '/images/project-4.png' },
              { name: 'Georgetown ISD Frost ES', city: 'Georgetown', gc: 'Bartlett Cocke', value: '$269K', status: 'Active', img: '/images/service-1.png' },
              { name: 'DSISD Elementary #6', city: 'Dripping Springs', gc: 'Bartlett Cocke', value: '$269K', status: 'Active', img: '/images/market-1.png' },
            ].map(p => (
              <div key={p.name} className="glass-card rounded-2xl overflow-hidden">
                <div className="h-44 bg-gray-800 overflow-hidden relative">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${p.status === 'Active' ? 'bg-te-teal/30 text-te-teal border border-te-teal/30' : 'bg-white/10 text-gray-300 border border-white/10'}`}>{p.status}</span>
                    <span className="text-lg font-mono font-black text-te-teal">{p.value}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold">{p.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{p.city} · {p.gc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MARKETS ═══════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">Industries</h2>
          <p className="text-center text-3xl md:text-4xl font-bold mb-12">Markets We Serve</p>
          <div className="flex flex-wrap justify-center gap-3">
            {MARKETS.map(m => (
              <span key={m} className="glass px-5 py-2.5 rounded-full text-sm text-gray-300 hover:text-white transition-all cursor-default">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CLIENTS ═══════════════════════════════════════════════════════ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass rounded-2xl px-8 py-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-4">Trusted by Texas&apos;s Leading Institutions</p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {['UT Austin', 'Austin ISD', 'U.S. Veterans Affairs', 'Texas State University', 'Georgetown ISD', 'Comal ISD', 'Dripping Springs ISD', 'Austin Community College', 'Manor ISD', 'Hutto ISD', 'Bastrop ISD', 'Pflugerville ISD'].map(c => (
                <span key={c} className="text-sm font-semibold text-gray-500 hover:text-te-teal transition-colors">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ ABOUT ═════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="orb w-80 h-80 bg-te-teal -left-40 top-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">About Us</h2>
              <p className="text-3xl md:text-4xl font-bold mb-6">Experienced. Professional. Dedicated.</p>
              <p className="text-gray-400 leading-relaxed mb-4">
                Tumlinson Electric is a full-service electrical contractor providing construction services throughout the state of Texas.
                Our people are what make Tumlinson Electric the company that it is.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                Our management is actively involved from start to finish, to ensure project goals and needs are being met.
                Our long-standing commitment to quality, performance and service has given us an excellent reputation among our clients.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                From the pre-construction phase to owner occupancy and beyond, Tumlinson Electric is committed to devoting the necessary
                time and resources needed to complete every project safely, on schedule, and within budget.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[['Quality', 'Excellence in every connection'], ['Safety', 'Zero-incident culture'], ['Team', 'Collaborative from bid to closeout'], ['Innovation', 'Technology-driven management']].map(([t, d]) => (
                  <div key={t} className="glass rounded-xl p-4">
                    <h4 className="font-bold text-te-teal text-sm mb-1">{t}</h4>
                    <p className="text-[11px] text-gray-500">{d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-2xl overflow-hidden">
                <img src="/images/Bottom-of-Our-Team-Page-img.jpg" alt="Tumlinson Electric team" className="w-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-teal px-6 py-4 rounded-xl">
                <p className="text-3xl font-black text-white">20+</p>
                <p className="text-sm font-medium text-white/70">Years in Business</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TEAM ══════════════════════════════════════════════════════════ */}
      <section id="team" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">Our People</h2>
          <p className="text-center text-3xl md:text-4xl font-bold mb-4">Meet the Team</p>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">It is our people and their experience that make Tumlinson Electric what it is. Our team brings the leadership, experience and integrity to successfully manage and complete any project.</p>

          {/* Executive Board */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.25em] text-te-teal font-semibold mb-4 flex items-center gap-2"><span className="w-8 h-px bg-te-teal" />Executive Board</h3>
            <TeamGrid people={EXEC} />
          </div>

          {/* Estimating */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.25em] text-te-teal font-semibold mb-4 flex items-center gap-2"><span className="w-8 h-px bg-te-teal" />Estimating</h3>
            <TeamGrid people={ESTIMATING} />
          </div>

          {/* Project Management */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.25em] text-te-teal font-semibold mb-4 flex items-center gap-2"><span className="w-8 h-px bg-te-teal" />Project Management</h3>
            <TeamGrid people={PM} />
          </div>

          {/* Field Leadership */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.25em] text-te-teal font-semibold mb-4 flex items-center gap-2"><span className="w-8 h-px bg-te-teal" />Field Leadership</h3>
            <TeamGrid people={FIELD} showImg={false} />
          </div>

          {/* Foremen */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.25em] text-te-teal font-semibold mb-4 flex items-center gap-2"><span className="w-8 h-px bg-te-teal" />Foremen ({FOREMEN.length})</h3>
            <NameGrid names={FOREMEN} title="Foreman" />
          </div>

          {/* BIM */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.25em] text-te-teal font-semibold mb-4 flex items-center gap-2"><span className="w-8 h-px bg-te-teal" />BIM &amp; Detailing</h3>
            <TeamGrid people={BIM} showImg={false} />
          </div>

          {/* Management Team */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-[0.25em] text-te-teal font-semibold mb-4 flex items-center gap-2"><span className="w-8 h-px bg-te-teal" />Management Team</h3>
            <TeamGrid people={MGMT} showImg={false} />
          </div>

          {/* Administration */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.25em] text-te-teal font-semibold mb-4 flex items-center gap-2"><span className="w-8 h-px bg-te-teal" />Administration</h3>
            <TeamGrid people={ADMIN} showImg={false} />
          </div>
        </div>
      </section>

      {/* ══ SAFETY ════════════════════════════════════════════════════════ */}
      <section id="safety" className="py-24 relative overflow-hidden">
        <div className="orb w-72 h-72 bg-green-500 -right-36 top-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="glass rounded-2xl p-10 max-w-3xl mx-auto text-center">
            <h2 className="text-sm uppercase tracking-[0.3em] text-green-400 font-semibold mb-3">Safety First</h2>
            <p className="text-3xl md:text-4xl font-bold mb-6">Zero-Incident Culture</p>
            <p className="text-gray-400 leading-relaxed mb-6">
              At Tumlinson Electric, safety is not just a priority — it&apos;s a core value. Every team member is empowered to stop
              work if conditions are unsafe. Our comprehensive safety program includes daily toolbox talks, weekly audits,
              and continuous training to maintain our industry-leading safety record.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[['0', 'Target Incidents'], ['100%', 'OSHA Trained'], ['Daily', 'Safety Talks']].map(([n, l]) => (
                <div key={l} className="glass rounded-xl p-4">
                  <p className="text-2xl font-black text-green-400">{n}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CAREERS ═══════════════════════════════════════════════════════ */}
      <section id="careers" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-teal rounded-2xl p-10">
            <h2 className="text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">Careers</h2>
            <p className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</p>
            <p className="text-gray-400 mb-8 max-w-2xl">We&apos;re looking for skilled professionals to join our growing team. Competitive pay, benefits, and the opportunity to work on Central Texas&apos;s biggest projects.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {['Assistant Project Manager', 'Project Manager', 'Journeyman Electricians', 'State Apprentice Electricians', 'Low Voltage Technicians', 'Trimble Operator/Surveyor'].map(j => (
                <div key={j} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-te-teal glow-dot" /><span className="text-sm font-medium">{j}</span>
                </div>
              ))}
            </div>
            <a href="mailto:bwatson@tumlinsonelectric.com" className="glass-teal inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl hover:scale-105 transition-transform">
              Apply Now <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ═══════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="orb w-80 h-80 bg-te-teal left-1/3 -bottom-40" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-te-teal font-semibold mb-3">Get in Touch</h2>
          <p className="text-center text-3xl md:text-4xl font-bold mb-16">Connect With Us</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: '📞', title: 'Call Us', content: <a href="tel:5126934444" className="text-te-teal text-lg font-mono">512-693-4444</a> },
              { icon: '✉️', title: 'Email Us', content: <a href="mailto:bwatson@tumlinsonelectric.com" className="text-te-teal text-sm">bwatson@tumlinsonelectric.com</a> },
              { icon: '📍', title: 'Visit Us', content: <p className="text-gray-400 text-sm">200 University Blvd<br />Suite 225-286<br />Round Rock, TX 78665</p> },
            ].map(c => (
              <div key={c.title} className="glass rounded-2xl p-8 text-center">
                <span className="text-3xl mb-4 block">{c.icon}</span>
                <h3 className="font-bold mb-3">{c.title}</h3>
                {c.content}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/images/logo.png" alt="TE" className="h-8 w-auto" />
                <span className="text-sm font-bold">TUMLINSON <span className="text-te-teal font-light">ELECTRIC</span></span>
              </div>
              <p className="text-xs text-gray-600">Full-service electrical and low-voltage contractor serving Central Texas.</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Services</h4>
              <ul className="space-y-1.5 text-xs text-gray-500">
                {['Electrical Construction', 'Low Voltage / Cabling', 'Design-Assist & Build', 'Pre-Construction', 'Fire Alarm'].map(s => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Company</h4>
              <ul className="space-y-1.5 text-xs text-gray-500">
                {['About Us', 'Our Team', 'Projects', 'Careers', 'Safety'].map(s => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-3">Connect</h4>
              <ul className="space-y-1.5 text-xs text-gray-500">
                <li>512-693-4444</li>
                <li>bwatson@tumlinsonelectric.com</li>
                <li>Round Rock, TX 78665</li>
                <li className="pt-2 text-gray-600">License: EC-31651</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex items-center justify-between">
            <p className="text-[10px] text-gray-700">&copy; 2026 Tumlinson Electric LLC. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/tumlinsonelectric/" target="_blank" rel="noopener" className="text-gray-600 hover:text-te-teal text-xs">Facebook</a>
              <a href="https://www.linkedin.com/company/tumlinson-electric" target="_blank" rel="noopener" className="text-gray-600 hover:text-te-teal text-xs">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
