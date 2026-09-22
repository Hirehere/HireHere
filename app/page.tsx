'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Safe Supabase Client Initialization (Prevents Prerender Build Errors)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Professional Translation Dictionary with updated Hero texts
const TRANSLATIONS = {
  hi: {
    workerRegister: '👤 वर्कर रजिस्ट्रेशन',
    jobPost: '+ जॉब पोस्ट करें',
    heroTitle: 'Your Dream Job is',
    heroTitleHighlight: 'Just a Click Away.',
    heroTitleSuffix: '',
    heroSubtitle: 'ज़ीरो फीस ! 2-मिनट में अप्लाई करें। 100% वेरिफाइड जॉब्स। तुरंत नौकरी पाएं!',
    wantJob: 'मुझे काम चाहिए',
    wantWorker: 'मुझे वर्कर चाहिए',
    searchPlaceholder: 'अपना शहर लिखें (उदा. Pune, Mumbai, Delhi)...',
    searchBtn: '🔍 खोजें',
    trust1: '✅ 100% वेरिफाइड जॉब्स',
    trust2: '🔒 ज़ीरो कंसल्टेंसी फीस',
    trust3: '⚡ डायरेक्ट HR कॉल और चैट',
    catQuestion: 'किस प्रकार की',
    catQuestionHighlight: 'जॉब',
    catQuestionSuffix: 'चाहिए?',
    workersStat: 'रजिस्टर्ड वर्कर',
    jobsProvidedStat: 'सफल भर्तियां',
    verifiedEmployersStat: 'वेरिफाइड कंपनियां',
    recentJobs: 'आपके',
    cityHighlight: 'शहर',
    recentJobsSuffix: 'की नई नौकरियां',
    allJobs: 'सभी नौकरियां',
    loadingText: 'नौकरियां लोड हो रही हैं...',
    noJobsFound: 'कोई जॉब नहीं मिली।',
    noJobsSub: "पहली जॉब लिस्ट करने के लिए ऊपर '+ जॉब पोस्ट करें' पर क्लिक करें।",
    verifiedBadge: '✅ वेरिफाइड कंपनी',
    monthSalary: '/महीना',
    applyCallBtn: '📞 कॉल करें / अप्लाई करें',
    navHome: 'होम',
    navJobs: 'नौकरियां',
    navPostJob: 'जॉब पोस्ट',
    quote: '"हर मेहनती नागरिक को उनके शहर में ही इज़्ज़तदार रोज़गार दिलाना HireHere का मुख्य उद्देश्य है।"',
    categories: {
      factory: 'क्वालिटी इंस्पेक्टर',
      driver: 'ड्राइवर',
      delivery: 'डिलीवरी',
      security: 'सिक्योरिटी',
      electrician: 'इलेक्ट्रीशियन',
      cleaning: 'हाउसकीपिंग',      
    },
  },
  en: {
    workerRegister: '👤 Worker Register',
    jobPost: '+ Post a Job',
    heroTitle: 'Your Dream Job is',
    heroTitleHighlight: 'Just a Click Away.',
    heroTitleSuffix: '',
    heroSubtitle: 'Zero Fees ! 2-Minute Apply. 100% Verified Jobs. Get Hired Fast!',
    wantJob: 'I Need a Job',
    wantWorker: 'I Need Workers',
    searchPlaceholder: 'Type your city (e.g. Pune, Mumbai, Delhi)...',
    searchBtn: '🔍 Search',
    trust1: '✅ 100% Verified Jobs',
    trust2: '🔒 Zero Consultancy Fee',
    trust3: '⚡ Direct HR Call & Chat',
    catQuestion: 'Which',
    catQuestionHighlight: 'Job Category',
    catQuestionSuffix: 'do you want?',
    workersStat: 'Registered Workers',
    jobsProvidedStat: 'Jobs Placed',
    verifiedEmployersStat: 'Verified Employers',
    recentJobs: 'Recent Job Openings in Your',
    cityHighlight: 'City',
    recentJobsSuffix: '',
    allJobs: 'All Jobs',
    loadingText: 'Loading jobs...',
    noJobsFound: 'No jobs found.',
    noJobsSub: "To list the first job, click on '+ Post a Job' at the top right.",
    verifiedBadge: '✅ Verified Company',
    monthSalary: '/month',
    applyCallBtn: '📞 Apply / Direct Call',
    navHome: 'Home',
    navJobs: 'Jobs',
    navPostJob: 'Post Job',
    quote: '"Connecting every hardworking individual with dignified local career opportunities is HireHere\'s vision."',
    categories: {
      factory: 'Quality Inspector'
      driver: 'Driver',
      delivery: 'Delivery',
      security: 'Security',
      electrician: 'Electrician',
      cleaning: 'Housekeeping',      
    },
  },
};

const CATEGORIES_LIST = [
  { id: 'driver', icon: '🚗' },
  { id: 'delivery', icon: '📦' },
  { id: 'security', icon: '🛡️' },
  { id: 'electrician', icon: '⚡' },
  { id: 'cleaning', icon: '🧹' },
  { id: 'factory', icon: '🏭' },
];

export default function JobPortal() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Load saved language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as 'hi' | 'en';
    if (savedLang === 'en' || savedLang === 'hi') {
      setLang(savedLang);
    }
  }, []);

  // Language Change Handler with immediate re-render trigger
  const handleLanguageChange = (newLang: 'hi' | 'en') => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = TRANSLATIONS[lang];

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

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] font-sans pb-20 text-[#1a1a1a]">
      {/* ===== HEADER ===== */}
      <header className="w-full bg-[#0d47a1] text-white px-4 md:px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="w-full flex justify-between items-center flex-wrap gap-2">
          <div>
            <div className="text-2xl md:text-3xl font-black tracking-tight leading-none">
              Hire<span className="text-[#ff6f00]">Here</span>
            </div>
            <div className="text-xs opacity-90 mt-1 tracking-wide">
              👤 Founded by Sujit Shinde
            </div>
          </div>

          {/* WORKING LANGUAGE SELECTOR DROPDOWN */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative inline-block">
              <select
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value as 'hi' | 'en')}
                className="bg-white/20 border border-white/40 text-white font-bold text-xs md:text-sm px-3 py-1.5 rounded-lg cursor-pointer outline-none focus:bg-[#0d47a1]"
              >
                <option value="hi" className="text-black">🇮🇳 हिंदी (Hindi)</option>
                <option value="en" className="text-black">🌐 English</option>
              </select>
            </div>

            {/* WORKER REGISTER BUTTON */}
            <Link
              href="/employee"
              className="bg-white text-[#0d47a1] hover:bg-gray-100 font-extrabold text-xs md:text-sm px-3 py-2 rounded-lg transition shadow-sm"
            >
              {t.workerRegister}
            </Link>

            {/* JOB POST BUTTON */}
            <Link
              href="/post-job"
              className="bg-[#ff6f00] hover:bg-[#e65100] text-white font-extrabold text-xs md:text-sm px-3 py-2 rounded-lg transition shadow-sm"
            >
              {t.jobPost}
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="w-full bg-gradient-to-b from-[#0d47a1] to-[#1976d2] text-white px-6 py-10 md:py-14 text-center">
        <div className="w-full">
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-3">
            {t.heroTitle} <span className="text-[#ff6f00]">{t.heroTitleHighlight}</span> {t.heroTitleSuffix}
          </h1>
          <p className="text-sm md:text-lg text-blue-100 opacity-95 mb-8 max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>

          {/* Dual Main Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
            <Link
              href="/employee"
              className="bg-[#ff6f00] hover:bg-[#e65100] text-white p-4 rounded-xl font-extrabold text-sm md:text-base flex flex-col sm:flex-row items-center justify-center gap-2 shadow-lg active:scale-95 transition"
            >
              <span className="text-2xl">📱</span>
              <span>{t.wantJob}</span>
            </Link>
            <Link
              href="/post-job"
              className="bg-white text-[#0d47a1] p-4 rounded-xl font-extrabold text-sm md:text-base flex flex-col sm:flex-row items-center justify-center gap-2 shadow-lg active:scale-95 transition"
            >
              <span className="text-2xl">🏢</span>
              <span>{t.wantWorker}</span>
            </Link>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-xl p-2 shadow-xl flex items-center max-w-2xl mx-auto">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="flex-1 p-3 text-sm md:text-base outline-none text-gray-800 bg-transparent w-full"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <button
              type="button"
              onClick={fetchJobs}
              className="bg-[#ff6f00] text-white px-6 py-3 rounded-lg text-sm md:text-base font-bold hover:bg-[#e65100] transition whitespace-nowrap cursor-pointer"
            >
              {t.searchBtn}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center flex-wrap gap-4 md:gap-6 mt-6 text-xs md:text-sm font-semibold text-blue-100">
            <span>{t.trust1}</span>
            <span>{t.trust2}</span>
            <span>{t.trust3}</span>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="w-full px-6 py-8">
        <h2 className="text-xl md:text-2xl font-black text-[#0d47a1] mb-4">
          {t.catQuestion} <span className="text-[#ff6f00]">{t.catQuestionHighlight}</span> {t.catQuestionSuffix}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4 w-full">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryFilter(cat.id)}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-center flex flex-col items-center justify-center active:scale-95 transition hover:border-[#ff6f00] shadow-sm hover:shadow-md cursor-pointer"
            >
              <span className="text-3xl md:text-4xl block mb-2">{cat.icon}</span>
              <span className="text-xs md:text-sm font-extrabold text-gray-800">
                {t.categories[cat.id as keyof typeof t.categories]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <div className="w-full px-6 mb-8">
        <div className="w-full bg-[#0d47a1] text-white py-6 px-6 rounded-2xl shadow-lg grid grid-cols-3 text-center divide-x divide-white/20">
          <div>
            <div className="text-2xl md:text-4xl font-black text-[#ff6f00]">5L+</div>
            <div className="text-xs md:text-sm opacity-90 mt-1">{t.workersStat}</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-black text-[#ff6f00]">50K+</div>
            <div className="text-xs md:text-sm opacity-90 mt-1">{t.jobsProvidedStat}</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-black text-[#ff6f00]">20K+</div>
            <div className="text-xs md:text-sm opacity-90 mt-1">{t.verifiedEmployersStat}</div>
          </div>
        </div>
      </div>

      {/* ===== JOB LISTINGS SECTION ===== */}
      <section className="w-full px-6 py-4" id="jobs-section">
        <h2 className="text-xl md:text-2xl font-black text-[#0d47a1] mb-4">
          {t.recentJobs} <span className="text-[#ff6f00]">{t.cityHighlight}</span> {t.recentJobsSuffix}
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
              {tab === 'all'
                ? t.allJobs
                : t.categories[tab as keyof typeof t.categories] || tab}
            </button>
          ))}
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <p className="text-center text-gray-500 py-16 text-base font-bold">{t.loadingText}</p>
        ) : jobs.length === 0 ? (
          <div className="w-full bg-white rounded-2xl p-10 text-center border shadow-sm my-4">
            <p className="text-gray-700 font-bold mb-2 text-lg">{t.noJobsFound}</p>
            <p className="text-xs md:text-sm text-gray-400">{t.noJobsSub}</p>
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
                        {t.verifiedBadge}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    🏢 <strong className="text-gray-800">{job.company_name}</strong>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                    <span className="font-extrabold text-[#2e7d32]">
                      💰 ₹{job.min_salary?.toLocaleString()} - ₹{job.max_salary?.toLocaleString()}{t.monthSalary}
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
                    {t.applyCallBtn}
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
          <div className="w-16 h-16 rounded-full bg-[#ff6f00] border-2 border-white flex items-center justify-center text-2xl font-black text-white shadow-md flex-shrink-0">
            SS
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-extrabold text-xl">Sujit Shinde</h4>
              <span className="text-xs bg-white/20 px-3 py-0.5 rounded-full font-bold">
                Founder & CEO
              </span>
            </div>
            <p className="text-sm md:text-base italic border-l-4 border-[#ff6f00] pl-3 py-1 opacity-95">
              {t.quote}
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="w-full bg-[#0d47a1] text-white text-center py-10 px-6 mt-8">
        <div className="text-2xl font-black mb-1">
          Hire<span className="text-[#ff6f00]">Here</span>
        </div>
        <div className="text-sm opacity-90 mb-4">
          Founded by <strong>Sujit Shinde</strong>
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
          <span>{t.navHome}</span>
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
          <span>{t.navJobs}</span>
        </button>
        <Link
          href="/post-job"
          className="flex flex-col items-center text-gray-500 font-bold text-[11px]"
        >
          <span className="text-xl">📋</span>
          <span>{t.navPostJob}</span>
        </Link>
      </nav>
    </div>
  );
}