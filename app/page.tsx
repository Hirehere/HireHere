'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Supabase Initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function JobPortal() {
  const [currentLang, setCurrentLang] = useState<'hi' | 'en'>('hi');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Load Google Translate Widget dynamically
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);

        (window as any).googleTranslateElementInit = () => {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'hi,en',
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          );
        };
      }
    };

    addGoogleTranslateScript();
  }, []);

  // Function to switch languages in real-time
  const changeLanguage = (langCode: 'hi' | 'en') => {
    setCurrentLang(langCode);
    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event('change'));
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });

      if (searchCategory && searchCategory !== 'all') {
        query = query.ilike('category', `%${searchCategory}%`);
      }
      if (searchLocation) {
        query = query.ilike('location_city', `%${searchLocation}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchCategory]);

  const handleCategoryFilter = (category: string) => {
    setActiveTab(category);
    setSearchCategory(category === 'all' ? '' : category);
  };

  const categories = [
    { id: 'driver', label: 'Driver / ड्राइवर', icon: '🚗' },
    { id: 'delivery', label: 'Delivery / डिलीवरी', icon: '📦' },
    { id: 'security', label: 'Security / गार्ड', icon: '🛡️' },
    { id: 'electrician', label: 'Electrician / इलेक्ट्रीशियन', icon: '⚡' },
    { id: 'cleaning', label: 'Housekeeping / सफाई', icon: '🧹' },
    { id: 'factory', label: 'Factory Worker / फैक्ट्री', icon: '🏭' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] font-sans pb-20 text-[#1a1a1a]">
      {/* Hidden Google Translate Element Container */}
      <div id="google_translate_element" className="hidden" />

      {/* CSS to hide Google Translate Toolbar Banner overlay */}
      <style jsx global>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0px !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
      `}</style>

      {/* ===== HEADER ===== */}
      <header className="w-full bg-[#0d47a1] text-white px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="w-full flex justify-between items-center">
          <div>
            <div className="text-2xl md:text-3xl font-black tracking-tight leading-none notranslate">
              Hire<span className="text-[#ff6f00]">Here</span>
            </div>
            <div className="text-xs opacity-90 mt-1 tracking-wide">
              👤 Founded by Sujit Shinde
            </div>
          </div>

          {/* REAL-TIME LANGUAGE SWITCHER TOGGLE */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-white/10 p-1 rounded-full border border-white/20 flex items-center">
              <button
                type="button"
                onClick={() => changeLanguage('hi')}
                className={`px-3 py-1 text-xs font-black rounded-full transition cursor-pointer ${
                  currentLang === 'hi'
                    ? 'bg-[#ff6f00] text-white shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                🇮🇳 हिंदी
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 text-xs font-black rounded-full transition cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#ff6f00] text-white shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                🇬🇧 English
              </button>
            </div>

            {/* WORKER REGISTER BUTTON */}
            <Link
              href="/employee"
              className="bg-white text-[#0d47a1] hover:bg-gray-100 font-extrabold text-xs md:text-sm px-3.5 py-2 rounded-lg transition shadow-sm"
            >
              👤 Worker Register
            </Link>

            {/* JOB POST BUTTON */}
            <Link
              href="/post-job"
              className="bg-[#ff6f00] hover:bg-[#e65100] text-white font-extrabold text-xs md:text-sm px-3.5 py-2 rounded-lg transition shadow-sm"
            >
              + Post Job
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="w-full bg-gradient-to-b from-[#0d47a1] to-[#1976d2] text-white px-6 py-10 md:py-14 text-center">
        <div className="w-full">
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-3">
            Land Your Dream Job, <span className="text-[#ff6f00]">Connect With Top Employers</span>
          </h1>
          <p className="text-sm md:text-lg text-blue-100 opacity-95 mb-8">
            No middlemen, zero fees — apply to verified companies in under 2 minutes and get hired fast.
          </p>

          {/* Dual Main Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
            <Link
              href="/employee"
              className="bg-[#ff6f00] hover:bg-[#e65100] text-white p-4 rounded-xl font-extrabold text-sm md:text-base flex flex-col sm:flex-row items-center justify-center gap-2 shadow-lg active:scale-95 transition"
            >
              <span className="text-2xl">📱</span>
              <span>I Need a Job</span>
            </Link>
            <Link
              href="/post-job"
              className="bg-white text-[#0d47a1] p-4 rounded-xl font-extrabold text-sm md:text-base flex flex-col sm:flex-row items-center justify-center gap-2 shadow-lg active:scale-95 transition"
            >
              <span className="text-2xl">🏢</span>
              <span>I Need Workers</span>
            </Link>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-xl p-2 shadow-xl flex items-center max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Type your city (e.g. Pune, Mumbai, Delhi)..."
              className="flex-1 p-3 text-sm md:text-base outline-none text-gray-800 bg-transparent w-full"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <button
              type="button"
              onClick={fetchJobs}
              className="bg-[#ff6f00] text-white px-6 py-3 rounded-lg text-sm md:text-base font-bold hover:bg-[#e65100] transition whitespace-nowrap cursor-pointer"
            >
              🔍 Search
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center flex-wrap gap-6 mt-6 text-xs md:text-sm font-semibold text-blue-100">
            <span>✅ 100% Verified Jobs</span>
            <span>🔒 Zero Consultancy Fee</span>
            <span>⚡ Direct HR Call & Chat</span>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="w-full px-6 py-8">
        <h2 className="text-xl md:text-2xl font-black text-[#0d47a1] mb-4">
          Which <span className="text-[#ff6f00]">Job Category</span> do you want?
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4 w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryFilter(cat.id)}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-center flex flex-col items-center justify-center active:scale-95 transition hover:border-[#ff6f00] shadow-sm hover:shadow-md cursor-pointer"
            >
              <span className="text-3xl md:text-4xl block mb-2">{cat.icon}</span>
              <span className="text-xs md:text-sm font-extrabold text-gray-800">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <div className="w-full px-6 mb-8">
        <div className="w-full bg-[#0d47a1] text-white py-6 px-6 rounded-2xl shadow-lg grid grid-cols-3 text-center divide-x divide-white/20">
          <div>
            <div className="text-2xl md:text-4xl font-black text-[#ff6f00]">5L+</div>
            <div className="text-xs md:text-sm opacity-90 mt-1">Registered Workers</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-black text-[#ff6f00]">50K+</div>
            <div className="text-xs md:text-sm opacity-90 mt-1">Jobs Placed</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-black text-[#ff6f00]">20K+</div>
            <div className="text-xs md:text-sm opacity-90 mt-1">Verified Employers</div>
          </div>
        </div>
      </div>

      {/* ===== JOB LISTINGS SECTION ===== */}
      <section className="w-full px-6 py-4" id="jobs-section">
        <h2 className="text-xl md:text-2xl font-black text-[#0d47a1] mb-4">
          Recent Job Openings in Your <span className="text-[#ff6f00]">City</span>
        </h2>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {['all', 'driver', 'delivery', 'security', 'factory', 'electrician'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleCategoryFilter(tab)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold capitalize flex-shrink-0 transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#0d47a1] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-[#0d47a1]'
              }`}
            >
              {tab === 'all' ? 'All Jobs' : tab}
            </button>
          ))}
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <p className="text-center text-gray-500 py-16 text-base font-bold">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="w-full bg-white rounded-2xl p-10 text-center border shadow-sm my-4">
            <p className="text-gray-700 font-bold mb-2 text-lg">No jobs found.</p>
            <p className="text-xs md:text-sm text-gray-400">To list the first job, click on '+ Post a Job' at top right.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-[#0d47a1] hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-extrabold text-[#0d47a1] text-lg leading-snug">{job.title}</h3>
                    {job.is_verified && (
                      <span className="bg-[#e8f5e9] text-[#2e7d32] text-xs font-extrabold px-2.5 py-1 rounded-md whitespace-nowrap">
                        ✅ Verified Company
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    🏢 <strong className="text-gray-800">{job.company_name}</strong>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                    <span className="font-extrabold text-[#2e7d32]">
                      💰 ₹{job.min_salary?.toLocaleString()} - ₹{job.max_salary?.toLocaleString()} /month
                    </span>
                    <span>📍 {job.location_city}</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex gap-3 pt-3 border-t border-gray-100 mt-2">
                  <a
                    href={`tel:${job.hr_call_number}`}
                    className="flex-1 bg-[#0d47a1] hover:bg-[#1976d2] text-white text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition shadow-sm"
                  >
                    📞 Apply / Direct Call
                  </a>
                  <a
                    href={`https://wa.me/${job.hr_whatsapp_number}?text=Hi,%20I%20am%20interested%20in%20the%20${encodeURIComponent(job.title)}%20job%20posted%20on%20HireHere.in`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 bg-[#25D366] hover:bg-green-600 text-white flex items-center justify-center rounded-xl text-xl transition shadow-sm"
                  >
                    💬
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== FOUNDER CARD ===== */}
      <section className="w-full px-6 py-8">
        <div className="w-full bg-gradient-to-r from-[#0d47a1] to-[#1976d2] text-white rounded-2xl p-6 md:p-8 shadow-lg flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[#ff6f00] border-2 border-white flex items-center justify-center text-2xl font-black text-white shadow-md flex-shrink-0 notranslate">
            SS
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-extrabold text-xl notranslate">Sujit Shinde</h4>
              <span className="text-xs bg-white/20 px-3 py-0.5 rounded-full font-bold">
                Founder & CEO
              </span>
            </div>
            <p className="text-sm md:text-base italic border-l-4 border-[#ff6f00] pl-3 py-1 opacity-95">
              "Connecting every hardworking individual with dignified local career opportunities is HireHere's vision."
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="w-full bg-[#0d47a1] text-white text-center py-10 px-6 mt-8">
        <div className="text-2xl font-black mb-1 notranslate">
          Hire<span className="text-[#ff6f00]">Here</span>
        </div>
        <div className="text-sm opacity-90 mb-4">
          Founded by <strong className="notranslate">Sujit Shinde</strong>
        </div>
        <div className="text-xs opacity-75">
          © 2026 HireHere Technologies Pvt Ltd. Made in India 🇮🇳<br />
          hirehere.in
        </div>
      </footer>

      {/* ===== FIXED BOTTOM NAVIGATION (MOBILE ONLY) ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 py-2.5 px-4 flex justify-around items-center z-50 shadow-2xl">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center text-[#0d47a1] font-extrabold text-[11px] cursor-pointer"
        >
          <span className="text-xl">🏠</span>
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('jobs-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center text-gray-500 font-bold text-[11px] cursor-pointer"
        >
          <span className="text-xl">🔍</span>
          <span>Jobs</span>
        </button>
        <Link
          href="/post-job"
          className="flex flex-col items-center text-gray-500 font-bold text-[11px]"
        >
          <span className="text-xl">📋</span>
          <span>Post Job</span>
        </Link>
      </nav>
    </div>
  );
}