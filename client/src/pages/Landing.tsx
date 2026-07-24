import React, { useEffect, useState, useCallback } from 'react';
import HeroSection from '../components/landing/HeroSection';
import AuthModal from '../components/auth/AuthModal';
import CampusDirectory from '../components/InteractiveCampusMap';
import { BUILDINGS } from '../data/campusBuildings';
import { UserRole } from '../services/firebase';

/* ---------- shared presentational helpers ---------- */

const SectionHeading: React.FC<{ eyebrow?: string; title: string; description?: string }> = ({
  eyebrow,
  title,
  description,
}) => (
  <div className="text-center mb-14 max-w-2xl mx-auto">
    {eyebrow && (
      <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary-700 mb-3">
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl font-semibold text-ink-900 tracking-tight">{title}</h2>
    {description && <p className="mt-4 text-base text-ink-500 leading-relaxed">{description}</p>}
  </div>
);

const IconBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center text-primary-700">
    {children}
  </div>
);

const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`rounded-xl border border-ink-100 bg-white p-6 ${className}`}>{children}</div>
);

/* ---------- static content (copy preserved from the original page) ---------- */

const PILLARS = [
  {
    title: 'Energy Efficiency',
    stat: '78%',
    statLabel: 'Efficiency achieved',
    items: ['Smart grid monitoring', 'Solar panel optimization', 'LED lighting systems', 'HVAC optimization'],
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />,
  },
  {
    title: 'Water Conservation',
    stat: '65%',
    statLabel: 'Water saved',
    items: ['Rainwater harvesting', 'Usage tracking systems', 'Leak detection alerts', 'Greywater recycling'],
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  },
  {
    title: 'Waste Management',
    stat: '82%',
    statLabel: 'Waste diverted',
    items: ['Segregation tracking', 'Composting programs', 'Recycling analytics', 'Zero-waste goals'],
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
  },
  {
    title: 'Green Mobility',
    stat: '72%',
    statLabel: 'Carbon reduced',
    items: ['Cycle tracking systems', 'EV charging stations', 'Carbon footprint calc', 'Public transport links'],
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />,
  },
];

const JOURNEY = [
  { phase: 'Phase 1', title: 'Baseline Assessment', status: 'In Development', desc: 'Planning comprehensive audit of current energy, water, and waste patterns' },
  { phase: 'Phase 2', title: 'IoT Deployment', status: 'Planned', desc: 'Future installation of smart sensors and monitoring systems campus-wide' },
  { phase: 'Phase 3', title: 'Behavior Programs', status: 'Future Phase', desc: 'Planned community engagement and gamification initiatives' },
  { phase: 'Phase 4', title: 'Net Zero Target', status: 'Vision 2026', desc: 'Goal to achieve carbon neutrality across all campus operations' },
];

const DEPARTMENT_LEADERBOARD = [
  { name: 'Computer Science', savings: '23%', rank: 1 },
  { name: 'Environmental Science', savings: '21%', rank: 2 },
  { name: 'Mechanical Engineering', savings: '19%', rank: 3 },
  { name: 'Civil Engineering', savings: '17%', rank: 4 },
  { name: 'Business Administration', savings: '15%', rank: 5 },
];

const ECO_WARRIORS = [
  { name: 'Priya Sharma', points: '2,847', level: 'Sustainability Master' },
  { name: 'Rahul Kumar', points: '2,634', level: 'Green Champion' },
  { name: 'Ananya Patel', points: '2,521', level: 'Eco Warrior' },
  { name: 'Vikram Singh', points: '2,398', level: 'Green Guardian' },
  { name: 'Sneha Reddy', points: '2,276', level: 'Sustainability Advocate' },
];

const IMPACT_METRICS = [
  { title: 'Energy Consumption', before: '1,250 kWh', after: '847 kWh', change: '↓ 32% improvement' },
  { title: 'Water Usage', before: '1,845 L', after: '1,234 L', change: '↓ 33% improvement' },
  { title: 'Waste Generation', before: '78 kg', after: '45 kg', change: '↓ 42% improvement' },
  { title: 'CO₂ Emissions', before: '2.8 tons', after: '1.6 tons', change: '↓ 43% improvement' },
];

const SENSORS = [
  { name: 'Smart Meters', count: '45' },
  { name: 'Climate Sensors', count: '28' },
  { name: 'Flow Meters', count: '32' },
  { name: 'Energy Monitors', count: '38' },
  { name: 'Waste Sensors', count: '15' },
  { name: 'Building Hubs', count: '8' },
];

const INTEGRATIONS = [
  { name: 'AI-Powered Analytics', desc: 'Machine learning algorithms for predictive insights and optimization recommendations', status: 'Active' },
  { name: 'Weather API Integration', desc: 'Real-time weather data for energy and water consumption forecasting', status: 'Active' },
  { name: 'Mobile App Platform', desc: 'iOS and Android apps for community engagement and real-time monitoring', status: 'Beta' },
  { name: 'Carbon Calculator', desc: 'Advanced algorithms for accurate carbon footprint measurement and tracking', status: 'Active' },
  { name: 'Smart Grid Integration', desc: 'Direct connection with campus power management systems', status: 'Coming Soon' },
];

const SDG_GOALS = [
  { number: 7, title: 'Affordable Clean Energy', progress: 78, achievements: ['Solar panels installed', 'LED lighting 90% complete', 'Smart grid deployed'] },
  { number: 12, title: 'Responsible Consumption', progress: 65, achievements: ['Waste segregation system', 'Zero single-use plastics', 'Sustainable procurement'] },
  { number: 13, title: 'Climate Action', progress: 72, achievements: ['Carbon footprint tracking', 'Tree plantation drive', 'Climate awareness programs'] },
];

const STORIES = [
  { name: 'Priya Sharma', role: 'Computer Science Student', story: 'How I reduced my carbon footprint by 30%', impact: 'Saved 245 kWh energy, 180L water', quote: 'The gamification made sustainability fun and engaging. I never thought small actions could create such a big impact!' },
  { name: 'Dr. Rajesh Kumar', role: 'Environmental Science Faculty', story: 'Leading by example in sustainable research', impact: 'Lab emissions reduced by 40%', quote: 'Integrating sustainability into curriculum has inspired both students and fellow faculty to take action.' },
  { name: 'Anita Singh', role: 'Campus Admin', story: 'Transforming campus operations sustainably', impact: 'Campus waste reduced by 55%', quote: 'The real-time monitoring system helped us identify waste hotspots and implement targeted solutions.' },
];

const AWARDS = [
  { title: 'Green Campus Certification 2024', organization: 'National Green Tribunal', level: 'Platinum' },
  { title: 'Best Sustainability Initiative', organization: 'Karnataka State', level: 'Winner' },
  { title: 'Carbon Neutral Campus', organization: 'Ministry of Environment', level: 'Certified' },
  { title: 'Innovation in EdTech', organization: 'AICTE', level: 'Excellence' },
];

const CTA_CARDS = [
  { title: 'Join Sustainability Club', desc: 'Connect with like-minded students and faculty', action: 'Join Now' },
  { title: 'Report Environmental Issues', desc: 'Help us identify and address campus issues', action: 'Report Issue' },
  { title: 'Suggest Improvements', desc: 'Share your ideas for campus sustainability', action: 'Share Idea' },
  { title: 'Download Mobile App', desc: 'Track your personal sustainability journey', action: 'Download' },
];

const NAV_LINKS = [
  { href: '#pillars', label: 'Pillars' },
  { href: '#campus', label: 'Campus' },
  { href: '#journey', label: 'Journey' },
  { href: '#community', label: 'Community' },
];

/* ---------- page ---------- */

const Landing: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '50px' },
    );
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handlePortalSelect = useCallback((portal: 'student' | 'faculty' | 'admin') => {
    setSelectedRole(portal as UserRole);
    setAuthModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-700 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="text-base font-semibold text-ink-900">
                  Net Zero Campus
                </span>
                <div className="text-[11px] text-ink-400 leading-none mt-0.5">@ DSCE</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-ink-600 hover:text-primary-700 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <HeroSection onPortalSelect={handlePortalSelect} />

      {/* Four Pillars */}
      <section id="pillars" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our approach"
            title="Four pillars of campus sustainability"
            description="Our comprehensive approach to achieving net-zero campus through intelligent monitoring and community engagement."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p) => (
              <Card key={p.title} className="animate-on-scroll">
                <IconBadge>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{p.icon}</svg>
                </IconBadge>
                <h3 className="mt-4 text-base font-semibold text-ink-900">{p.title}</h3>
                <ul className="mt-4 space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink-500">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-5 border-t border-ink-100">
                  <div className="text-2xl font-semibold text-primary-700">{p.stat}</div>
                  <div className="text-xs text-ink-400 mt-0.5">{p.statLabel}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Directory */}
      <section id="campus" className="py-24 bg-ink-50/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="DSCE Keymap"
            title="Campus building directory"
            description={`Every numbered block from the official campus keymap, with the departments and facilities it houses — ${BUILDINGS.length} blocks in total.`}
          />
          <Card className="p-8">
            <CampusDirectory />
          </Card>
        </div>
      </section>

      {/* Journey */}
      <section id="journey" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Roadmap"
            title="Our sustainability journey"
            description="Our roadmap and vision — planning the path to carbon neutrality through innovative technology."
          />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {JOURNEY.map((step, i) => (
              <div key={step.phase} className="animate-on-scroll relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-700 text-white text-xs font-semibold">
                    {i + 1}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-ink-400">{step.phase}</span>
                </div>
                <h3 className="text-base font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-1 text-sm font-medium text-primary-700">{step.status}</p>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard & Gamification */}
      <section className="py-24 bg-ink-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Community" title="Sustainability champions" description="Celebrating our eco-warriors and departments leading the charge towards carbon neutrality." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-semibold text-ink-900 mb-5">Top departments by energy savings</h3>
              <div className="space-y-3">
                {DEPARTMENT_LEADERBOARD.map((dept) => (
                  <Card key={dept.name} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-700 text-sm font-semibold">
                        {dept.rank}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-ink-900">{dept.name}</h4>
                        <p className="text-xs text-ink-400">Energy savings this month</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary-700">{dept.savings}</span>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink-900 mb-5">Student eco-warriors</h3>
              <div className="space-y-3">
                {ECO_WARRIORS.map((student) => (
                  <Card key={student.name} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-700 text-white text-xs font-semibold">
                        {student.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-ink-900">{student.name}</h4>
                        <p className="text-xs text-ink-400">{student.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary-700">{student.points}</div>
                      <div className="text-[11px] text-ink-400">points</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before vs After Impact */}
      <section className="py-24 bg-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Transformational impact: before vs today"
            description="Witness the journey of our campus sustainability transformation over the past year."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {IMPACT_METRICS.map((m) => (
              <div key={m.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-sm font-semibold text-white mb-4">{m.title}</h3>
                <div className="rounded-lg bg-white/5 px-3 py-2.5">
                  <div className="text-[11px] text-primary-200">Jan 2024</div>
                  <div className="text-lg font-semibold text-white">{m.before}</div>
                </div>
                <div className="flex justify-center py-2">
                  <svg className="w-4 h-4 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <div className="rounded-lg bg-white/10 px-3 py-2.5">
                  <div className="text-[11px] text-primary-200">Today</div>
                  <div className="text-lg font-semibold text-primary-200">{m.after}</div>
                  <div className="text-[11px] text-primary-300 mt-0.5">{m.change}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-semibold text-white">37%</div>
              <div className="mt-1 text-sm text-primary-200">Average resource savings</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-white">850+</div>
              <div className="mt-1 text-sm text-primary-200">Tons CO₂ prevented</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-white">₹2.3L</div>
              <div className="mt-1 text-sm text-primary-200">Cost savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Under the hood"
            title="Technology & innovation stack"
            description="Powered by IoT sensors, AI analytics, and smart integrations for comprehensive sustainability monitoring."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-semibold text-ink-900 mb-5">IoT sensor network</h3>
              <Card className="p-8">
                <div className="grid grid-cols-3 gap-5">
                  {SENSORS.map((s) => (
                    <div key={s.name} className="text-center">
                      <div className="text-lg font-semibold text-primary-700">{s.count}</div>
                      <div className="mt-1 text-xs text-ink-500">{s.name}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-ink-600 border border-ink-100 rounded-full px-4 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    166 active sensors
                  </span>
                </div>
              </Card>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink-900 mb-5">Smart integrations</h3>
              <div className="space-y-3">
                {INTEGRATIONS.map((tech) => (
                  <Card key={tech.name} className="flex items-start justify-between gap-4 py-4">
                    <div>
                      <h4 className="text-sm font-semibold text-ink-900">{tech.name}</h4>
                      <p className="mt-1 text-sm text-ink-500">{tech.desc}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        tech.status === 'Active'
                          ? 'bg-primary-50 text-primary-700'
                          : tech.status === 'Beta'
                          ? 'bg-info-50 text-info-600'
                          : 'bg-warning-50 text-warning-600'
                      }`}
                    >
                      {tech.status}
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDG Goals */}
      <section id="sdg-goals" className="py-24 bg-ink-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Global alignment" title="UN Sustainable Development Goals progress" description="Aligning our campus sustainability efforts with global goals for a better tomorrow." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SDG_GOALS.map((goal) => (
              <Card key={goal.number} className="text-center">
                <div className="text-xs font-semibold text-ink-400">SDG {goal.number}</div>
                <h3 className="mt-1 text-base font-semibold text-ink-900">{goal.title}</h3>

                <div className="relative w-28 h-28 mx-auto my-6">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="#eeeeec" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#2f6846"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${(goal.progress / 100) * 314} 314`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className="text-xl font-semibold text-ink-900">{goal.progress}%</div>
                      <div className="text-[10px] text-ink-400">Achieved</div>
                    </div>
                  </div>
                </div>

                <ul className="space-y-1.5 text-left">
                  {goal.achievements.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-xs text-ink-500">
                      <span className="w-1 h-1 rounded-full bg-primary-400" />
                      {a}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stories */}
      <section id="community" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Voices" title="Community impact stories" description="Stories from our campus community showcasing personal sustainability journeys and achievements." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STORIES.map((s) => (
              <Card key={s.name}>
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-11 h-11 rounded-full bg-primary-700 text-white text-sm font-semibold">
                    {s.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-900">{s.name}</h3>
                    <p className="text-xs text-ink-400">{s.role}</p>
                  </div>
                </div>
                <h4 className="mt-4 text-sm font-medium text-primary-700">{s.story}</h4>
                <div className="mt-4 rounded-lg bg-ink-50 px-4 py-3 text-center">
                  <div className="text-sm font-semibold text-ink-900">{s.impact}</div>
                  <div className="text-[11px] text-ink-400 mt-0.5">Personal impact this year</div>
                </div>
                <blockquote className="mt-4 text-sm text-ink-500 italic leading-relaxed">"{s.quote}"</blockquote>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-24 bg-ink-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Recognition" title="Awards & recognition" description="Our sustainability efforts have been recognized by leading organizations and institutions." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {AWARDS.map((award) => (
              <Card key={award.title} className="text-center">
                <IconBadge>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </IconBadge>
                <h3 className="mt-4 text-sm font-semibold text-ink-900">{award.title}</h3>
                <p className="mt-1 text-xs text-ink-400">{award.organization}</p>
                <span className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                  {award.level}
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Join the sustainability movement" description="Take action today and be part of the solution. Multiple ways to contribute to our campus sustainability goals." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CTA_CARDS.map((cta) => (
              <div key={cta.title} className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                <h3 className="text-sm font-semibold text-white">{cta.title}</h3>
                <p className="mt-2 text-sm text-primary-200">{cta.desc}</p>
                <button className="mt-5 w-full py-2.5 rounded-lg bg-white text-primary-800 text-sm font-semibold hover:bg-primary-50 transition-colors">
                  {cta.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-950 text-ink-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary-700 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-white">Net Zero Campus</span>
              </div>
              <p className="text-sm text-ink-400 max-w-md leading-relaxed">
                Empowering educational institutions to achieve carbon neutrality through smart monitoring, AI insights, and community engagement.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm text-ink-400">
                <li><a href="#pillars" className="hover:text-white transition-colors">4 Pillars</a></li>
                <li><a href="#journey" className="hover:text-white transition-colors">Our Journey</a></li>
                <li><a href="#community" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact & Support</h4>
              <ul className="space-y-2.5 text-sm text-ink-400">
                <li><a href="mailto:support@netzerocampus.edu" className="hover:text-white transition-colors">support@netzerocampus.edu</a></li>
                <li><a href="tel:+918012345678" className="hover:text-white transition-colors">+91 80 1234 5678</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-sm text-ink-500 text-center">
            © 2024 Net Zero Campus @ DSCE. Built for a sustainable future.
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-primary-700 hover:bg-primary-800 shadow-lg flex items-center justify-center text-white transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={selectedRole}
        hideRoleSelection={true}
      />
    </div>
  );
};

export default Landing;
