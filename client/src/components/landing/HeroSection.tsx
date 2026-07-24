import React, { useEffect, useState } from 'react';

interface HeroSectionProps {
  onPortalSelect: (portal: 'student' | 'faculty' | 'admin') => void;
}

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  duration = 1400,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const PORTALS: {
  key: 'admin' | 'faculty' | 'student';
  label: string;
  icon: JSX.Element;
}[] = [
  {
    key: 'admin',
    label: 'Admin Portal',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    ),
  },
  {
    key: 'faculty',
    label: 'Faculty Portal',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
  },
  {
    key: 'student',
    label: 'Student Portal',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    ),
  },
];

const FEATURES = [
  {
    title: 'Energy Tracking',
    desc: 'Monitor real-time consumption',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  },
  {
    title: 'Water Conservation',
    desc: 'Optimize water usage',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    ),
  },
  {
    title: 'Waste Management',
    desc: 'Reduce and recycle',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    ),
  },
  {
    title: 'AI Insights',
    desc: 'Smart recommendations',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    ),
  },
];

const HeroSection: React.FC<HeroSectionProps> = ({ onPortalSelect }) => {
  return (
    <div className="relative bg-white overflow-hidden border-b border-ink-100">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pt-36 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-primary-700 bg-primary-50 rounded-full px-3 py-1">
              Dayananda Sagar College of Engineering
            </span>

            <h1 className="mt-6 text-4xl lg:text-5xl font-semibold text-ink-900 leading-[1.1] tracking-tight">
              Revolutionizing campus sustainability, together
            </h1>
            <p className="mt-5 text-lg text-ink-600 leading-relaxed max-w-xl">
              Connecting students, faculty, and administrators through advanced
              sustainability tracking technology for accessible environmental
              monitoring in educational communities.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              {PORTALS.map((portal) => (
                <button
                  key={portal.key}
                  onClick={() => onPortalSelect(portal.key)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-primary-700 hover:bg-primary-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {portal.icon}
                  </svg>
                  {portal.label}
                </button>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-500">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Real-time monitoring
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                AI-powered insights
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Secure &amp; reliable
              </span>
            </div>
          </div>

          {/* Right column */}
          <div className="relative">
            <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-10">
              <div className="w-14 h-14 rounded-xl bg-primary-700 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-ink-900">Smart Campus</h3>
              <p className="mt-1.5 text-sm text-ink-500">Real-time environmental monitoring across every block</p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-white border border-ink-100 px-3 py-4 text-center">
                  <div className="text-xl font-semibold text-primary-700">
                    <AnimatedCounter value={85} suffix="%" />
                  </div>
                  <p className="mt-1 text-[11px] text-ink-500">Energy saved</p>
                </div>
                <div className="rounded-lg bg-white border border-ink-100 px-3 py-4 text-center">
                  <div className="text-xl font-semibold text-primary-700">
                    <AnimatedCounter value={12} suffix="k+" />
                  </div>
                  <p className="mt-1 text-[11px] text-ink-500">Students</p>
                </div>
                <div className="rounded-lg bg-white border border-ink-100 px-3 py-4 text-center">
                  <div className="text-xl font-semibold text-primary-700">
                    <AnimatedCounter value={95} suffix="%" />
                  </div>
                  <p className="mt-1 text-[11px] text-ink-500">Uptime</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div className="mt-20 pt-14 border-t border-ink-100 grid grid-cols-2 md:grid-cols-4 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-ink-900">{f.title}</h3>
              <p className="mt-0.5 text-sm text-ink-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
