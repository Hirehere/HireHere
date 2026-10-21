'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Supabase Client Initialization (Direct Keys + Env Fallback)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tumyhkuybineeodtgcka.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_HDaKMDhyr6HkCXEVYX8apg_s2cdR9hg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TRANSLATIONS = {
  hi: {
    workerRegister: '👤 वर्कर रजिस्ट्रेशन',
    employerZone: '🏢 एप्लॉयडर ज़ोन (लॉगिन / जॉब पोस्ट)',
    heroTitle: 'Your Dream Job is',
    heroTitleHighlight: 'Just a Click Away.',
    heroTitleSuffix: '',
    heroSubtitle: 'ज़ीरो फीस ! 2-मिनट में अप्लाई करें। 100% वेरिफाइड जॉब्स। तुरंत नौकरी पाएं!',
    wantJob: 'मुझे काम चाहिए',
    wantWorker: 'मुझे वर्कर चाहिए (Employer)',
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
    noJobsSub: 'नया जॉब लिस्ट करने के लिए ऊपर एप्लॉयडर ज़ोन में जाएं।',
    verifiedBadge: '✅ वेरिफाइड कंपनी',
    monthSalary: '/महीना',
    applyCallBtn: '📞 Apply / Direct Call',
    navHome: 'होम',
    navJobs: 'नौकरियां',
    navEmployer: 'एप्लॉयडर',
    quote: '"हर मेहनती नागरिक को उनके शहर में ही इज़्ज़तदार रोज़गार दिलाना HireHere का मुख्य उद्देश्य है।"',
    newsHeading: '📰 HireHere in the Media & News',
    newsSubheading: 'Sujit Shinde\'s mission featured across top national news platforms',
    videoHeading: '🎥 Watch HireHere in Action',
    videoSubheading: '10-Second Quick Overview',
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
    employerZone: '🏢 Employer Zone (Login / Post Job)',
    heroTitle: 'Your Dream Job is',
    heroTitleHighlight: 'Just a Click Away.',
    heroTitleSuffix: '',
    heroSubtitle: 'Zero Fees ! 2-Minute Apply. 100% Verified Jobs. Get Hired Fast!',
    wantJob: 'I Need a Job',
    wantWorker: 'I Need Workers (Employer)',
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
    noJobsSub: 'To list a job, go to Employer Zone above.',
    verifiedBadge: '✅ Verified Company',
    monthSalary: '/month',
    applyCallBtn: '📞 Apply / Direct Call',
    navHome: 'Home',
    navJobs: 'Jobs',
    navEmployer: 'Employer Zone',
    quote: '"Connecting every hardworking individual with dignified local career opportunities is HireHere\'s vision."',
    newsHeading: '📰 HireHere in the Media & News',
    newsSubheading: 'Sujit Shinde\'s mission featured across top national news platforms',
    videoHeading: '🎥 Watch HireHere in Action',
    videoSubheading: '10-Second Quick Overview',
    categories: {
      factory: 'Quality Inspector',
      driver: 'Driver',
      delivery: 'Delivery',
      security: 'Security',
      electrician: 'Electrician',
      cleaning: 'Housekeeping',      
    },
  },
};

const CATEGORIES_LIST = [
  { id: 'factory', icon: '🏭' },
  { id: 'driver', icon: '🚗' },
  { id: 'delivery', icon: '📦' },
  { id: 'security', icon: '🛡️' },
  { id: 'electrician', icon: '⚡' },
  { id: 'cleaning', icon: '🧹' }, 
];

export default function JobPortal() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as 'hi' | 'en';
    if (savedLang === 'en' || savedLang === 'hi') {
      setLang(savedLang);
    }
  }, []);
  
// Auto-redirect if user lands on homepage with recovery token from Gmail
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && (hash.includes('access_token') || hash.includes('type=recovery') || hash.includes('recovery'))) {
        router.push(`/employer/reset-password${hash}`);
      }
    }
  }, [router]);

  // Force play video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay failed, waiting for interaction", err);
      });
    }
  }, []);

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
        console.error('Error fetching jobs:', error.message || error);
      } else {
        setJobs(data || []);
      }
    } catch (err: any) {
      console.error('Fetch error:', err.message || err);
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

  const handleApplyAndCall = async (job: any) => {
    const candidatePhone = prompt(
      lang === 'hi'
        ? 'आवेदन करने के लिए अपना 10 अंकों का रजिस्टर्ड मोबाइल नंबर दर्ज करें:'
        : 'Enter your 10-digit registered mobile number to apply:'
    );

    if (!candidatePhone || candidatePhone.trim().length < 10) {
      alert(lang === 'hi' ? 'कृपया सही मोबाइल नंबर दर्ज करें।' : 'Please enter a valid mobile number.');
      return;
    }

    const cleanPhone = candidatePhone.trim().replace(/\D/g, '');

    const { data: existingCandidate } = await supabase
      .from('candidates')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle();

    let applicantName = 'Candidate';
    let resumeUrl = '';

    if (!existingCandidate) {
      const goToRegister = confirm(
        lang === 'hi'
          ? 'आपका यह मोबाइल नंबर रजिस्टर्ड नहीं है। क्या आप पहले वर्कर रजिस्ट्रेशन करना चाहते हैं?'
          : 'Your mobile number is not registered. Would you like to complete Worker Registration first?'
      );
      if (goToRegister) {
        router.push('/employee');
      }
      return;
    } else {
      applicantName = existingCandidate.full_name || 'Candidate';
      resumeUrl = existingCandidate.resume_url || '';
    }

    const payloadToInsert: any = {
      job_id: job.id,
      applicant_name: applicantName,
      applicant_phone: cleanPhone,
      resume_url: resumeUrl,
    };

    if (job.employer_id) {
      payloadToInsert.employer_id = job.employer_id;
    }

    let { error } = await supabase.from('job_applications').insert([payloadToInsert]);

    if (error && error.message.includes('column')) {
      const fallbackPayload = {
        job_id: job.id,
        name: applicantName,
        phone: cleanPhone,
        resume_url: resumeUrl,
      };
      if (job.employer_id) (fallbackPayload as any).employer_id = job.employer_id;
      const res = await supabase.from('job_applications').insert([fallbackPayload]);
      error = res.error;
    }

    if (error) {
      alert((lang === 'hi' ? 'आवेदन करने में त्रुटि: ' : 'Error applying: ') + error.message);
      return;
    }

    alert(
      lang === 'hi'
        ? `🎉 बधाई हो ${applicantName}! आपका आवेदन सफलतापूर्वक भेज दिया गया है।`
        : `🎉 Congratulations ${applicantName}! Your application has been submitted successfully.`
    );

    if (job.allow_direct_call !== false) {
      const callNow = confirm(lang === 'hi' ? 'क्या आप HR को सीधा कॉल करना चाहते हैं?' : 'Do you want to call the HR directly?');
      if (callNow) {
        const hrNumber = job.hr_call_number || job.hr_phone || job.employer_phone || job.phone;
        if (hrNumber) {
          window.location.href = `tel:${hrNumber}`;
        }
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };
  const [isMuted2, setIsMuted2] = useState(true);
const videoRef2 = useRef<HTMLVideoElement | null>(null);

const toggleMute2 = () => {
  if (videoRef2.current) {
    videoRef2.current.muted = !videoRef2.current.muted;
    setIsMuted2(videoRef2.current.muted);
  }
};

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] font-sans pb-20 text-[#1a1a1a]">
      {/* HEADER */}
      <header className="w-full bg-[#0d47a1] text-white px-4 md:px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="w-full flex justify-between items-center flex-wrap gap-2">
          <div>
            <div className="text-2xl md:text-3xl font-black tracking-tight leading-none">
              Hire<span className="text-[#ff6f00]">Here</span>
            </div>
            <div className="text-xs opacity-90 mt-1 tracking-wide">
            Start Your Professional Journey!
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <select
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value as 'hi' | 'en')}
              className="bg-white/20 border border-white/40 text-white font-bold text-xs md:text-sm px-3 py-1.5 rounded-lg cursor-pointer outline-none focus:bg-[#0d47a1]"
            >
              <option value="hi" className="text-black">🇮🇳 हिंदी (Hindi)</option>
              <option value="en" className="text-black">🌐 English</option>
            </select>

            <Link
              href="/employer/login"
              className="bg-[#ff6f00] hover:bg-[#e65100] text-white font-extrabold text-xs md:text-sm px-3 py-2 rounded-lg transition shadow-sm"
            >
              {t.employerZone}
            </Link>

            <Link
              href="/employee"
              className="bg-white text-[#0d47a1] hover:bg-gray-100 font-extrabold text-xs md:text-sm px-3 py-2 rounded-lg transition shadow-sm"
            >
              {t.workerRegister}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="w-full bg-gradient-to-b from-[#0d47a1] to-[#1976d2] text-white px-6 py-10 md:py-14 text-center">
        <div className="w-full">
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-3">
            {t.heroTitle} <span className="text-[#ff6f00]">{t.heroTitleHighlight}</span> {t.heroTitleSuffix}
          </h1>
          <p className="text-sm md:text-lg text-blue-100 opacity-95 mb-8 max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
            <Link
              href="/employee"
              className="bg-[#ff6f00] hover:bg-[#e65100] text-white p-4 rounded-xl font-extrabold text-sm md:text-base flex flex-col sm:flex-row items-center justify-center gap-2 shadow-lg active:scale-95 transition"
            >
              <span className="text-2xl">📱</span>
              <span>{t.wantJob}</span>
            </Link>

            <Link
              href="/employer/login"
              className="bg-white text-[#0d47a1] p-4 rounded-xl font-extrabold text-sm md:text-base flex flex-col sm:flex-row items-center justify-center gap-2 shadow-lg active:scale-95 transition hover:bg-gray-50"
            >
              <span className="text-2xl">🏢</span>
              <span>{t.wantWorker}</span>
            </Link>
          </div>

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

          <div className="flex justify-center flex-wrap gap-4 md:gap-6 mt-6 text-xs md:text-sm font-semibold text-blue-100">
            <span>{t.trust1}</span>
            <span>{t.trust2}</span>
            <span>{t.trust3}</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="w-full px-6 py-6">
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

      {/* STATS STRIP */}
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

      {/* JOB LISTINGS SECTION */}
      <section className="w-full px-6 py-4" id="jobs-section">
        <h2 className="text-xl md:text-2xl font-black text-[#0d47a1] mb-4">
          {t.recentJobs} <span className="text-[#ff6f00]">{t.cityHighlight}</span> {t.recentJobsSuffix}
        </h2>

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
                    🏢 <strong className="text-gray-800">{job.company || job.company_name}</strong>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                    <span className="font-extrabold text-[#2e7d32]">
                      💰 {job.salary || `₹${job.min_salary || 0} - ₹${job.max_salary || 0}`} {t.monthSalary}
                    </span>
                    <span>📍 {job.location_city}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-100 mt-2">
                  <button
                    type="button"
                    onClick={() => handleApplyAndCall(job)}
                    className="flex-1 bg-[#0d47a1] hover:bg-[#1976d2] text-white text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition shadow-sm cursor-pointer"
                  >
                    {t.applyCallBtn}
                  </button>
                  <a
                    href={`https://wa.me/${job.hr_whatsapp_number || job.hr_call_number || job.hr_phone || job.employer_phone}?text=Hi,%20I%20am%20interested%20in%20the%20${encodeURIComponent(job.title)}%20job%20posted%20on%20HireHere.in`}
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

      {/* FOUNDER CARD */}
      <section className="w-full px-6 py-6">
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

      {/* NEWS ARTICLE / MEDIA COVERAGE SECTION */}
      <section className="w-full px-6 py-6">
        <div className="w-full bg-white rounded-2xl p-6 md:p-8 border shadow-sm">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-black text-[#0d47a1]">
              {t.newsHeading}
            </h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              {t.newsSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-[#ff6f00] bg-orange-50 px-2.5 py-1 rounded-md">
                  📰 Daily Startup News
                </span>
                <span className="text-[11px] text-gray-400">Oct 2026</span>
              </div>
              <h4 className="font-extrabold text-gray-800 text-sm md:text-base mb-2 leading-snug">
                {lang === 'hi'
                  ? 'HireHere: स्थानीय युवाओं और ब्लू-कॉलर वर्कर्स को 2 मिनट में रोज़गार देने वाली क्रांति'
                  : 'HireHere: Revolutionizing Local Hiring & Blue-Collar Employment in 2 Minutes'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {lang === 'hi'
                  ? 'संस्थापक सुजीत शिंदे ने एक ऐसा डिजिटल प्लेटफ़ॉर्म तैयार किया है जो बिचौलियों और फीस को खत्म कर सीधे कंपनियों को वर्कर्स से जोड़ता है।'
                  : 'Founder Sujit Shinde built a zero-fee digital recruitment platform connecting local workers directly with employers without middlemen.'}
              </p>
              <div className="text-xs font-bold text-[#0d47a1]">
                {lang === 'hi' ? 'विशेष कवरेज →' : 'Featured Coverage →'}
              </div>
            </div>

            <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-[#2e7d32] bg-green-50 px-2.5 py-1 rounded-md">
                  💼 Maharashtra Business
                </span>
                <span className="text-[11px] text-gray-400">Sep 2026</span>
              </div>
              <h4 className="font-extrabold text-gray-800 text-sm md:text-base mb-2 leading-snug">
                {lang === 'hi'
                  ? 'पुणे और इंडस्ट्रियल बेल्ट में हजारों फैक्ट्री वर्कर्स को बिना फीस मिला काम'
                  : 'Empowering Thousands of Factory Workers Across Industrial Hubs'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {lang === 'hi'
                  ? 'चाकण, पिंपरी और पुणे क्षेत्र की 20,000 से अधिक सत्यापित कंपनियां अब भर्ती के लिए सीधे HireHere का उपयोग कर रही हैं।'
                  : 'Over 20,000 verified employers in Chakan and Pune region now use HireHere for direct, scam-free candidate hiring.'}
              </p>
              <div className="text-xs font-bold text-[#0d47a1]">
                {lang === 'hi' ? 'पूरा लेख पढ़ें →' : 'Read Full Story →'}
              </div>
            </div>

            <div className="bg-[#f8fafc] border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-[#0d47a1] bg-blue-50 px-2.5 py-1 rounded-md">
                  🚀 Entrepreneur India
                </span>
                <span className="text-[11px] text-gray-400">Aug 2026</span>
              </div>
              <h4 className="font-extrabold text-gray-800 text-sm md:text-base mb-2 leading-snug">
                {lang === 'hi'
                  ? 'बिना कंसल्टेंसी चार्ज: सुजीत शिंदे का विज़न भारत को रोज़गार युक्त बनाना है'
                  : 'Zero Consultancy Scams: Sujit Shinde\'s Mission to Dignify Work'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {lang === 'hi'
                  ? 'सुजीत शिंदे का मानना है कि हर वर्कर को उसके होमटाउन में ही सम्मानजनक नौकरी का अधिकार मिलना चाहिए।'
                  : 'HireHere eliminates job consultancy frauds by providing direct HR contact & verified job opportunities locally.'}
              </p>
              <div className="text-xs font-bold text-[#0d47a1]">
                {lang === 'hi' ? 'इंटरव्यू देखें →' : 'View Interview →'}
              </div>
            </div>
          </div>
        </div>
     </section>
    {/* ===== 10-SECOND SHORT VIDEO SECTION (NEWS SECTION KE THEEK NICHE) ===== */}
<section className="w-full px-6 py-6 flex flex-col items-center justify-center">
  <div className="text-center mb-6">
    <h3 className="text-lg md:text-xl font-black text-[#0d47a1]">
      {t.videoHeading}
    </h3>
    <p className="text-xs text-gray-500 mt-0.5">
      {t.videoSubheading}
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[600px] justify-items-center">
    
    {/* Video 1: hero-video.mp4 */}
    <div className="relative w-full max-w-[280px] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-black group">
      <video
        ref={videoRef}
        src="/hero-video.mp4"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="w-full h-auto object-cover max-h-[380px]"
      />
      <button
        type="button"
        onClick={toggleMute}
        className="absolute bottom-3 right-3 bg-black/80 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md transition border border-white/40 cursor-pointer shadow-md"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>

    {/* Video 2: hero-video1.mp4 */}
    <div className="relative w-full max-w-[280px] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-black group">
      <video
        ref={videoRef2}
        src="/hero-video1.mp4"
        autoPlay
        loop
        muted={isMuted2}
        playsInline
        className="w-full h-auto object-cover max-h-[380px]"
      />
      <button
        type="button"
        onClick={toggleMute2}
        className="absolute bottom-3 right-3 bg-black/80 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md transition border border-white/40 cursor-pointer shadow-md"
      >
        {isMuted2 ? '🔇' : '🔊'}
      </button>
    </div>

  </div>
</section>
{/* FOOTER */}
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

      
     {/* FIXED BOTTOM NAVIGATION (MOBILE ONLY) */}
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
          href="/employer/login"
          className="flex flex-col items-center text-gray-500 font-bold text-[11px]"
        >
          <span className="text-xl">🏢</span>
          <span>{t.navEmployer}</span>
        </Link>
      </nav>

      {/* ===== FLOATING AI CHATBOT WIDGET (WITH HH LOGO) ===== */}
      <div className="fixed bottom-24 md:bottom-8 right-4 z-[9999] flex items-center gap-2">
        {/* Tooltip Badge */}
        <span className="bg-white text-[#0d47a1] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-blue-200 animate-bounce">
          🤖 AI Support
        </span>

        {/* Floating Chat Button with HH Branding */}
        <a
          href="https://gemini.google.com/gem/151KREZVIfVpekWxFpOtBhZP4a8dektm9?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0d47a1] hover:bg-[#1976d2] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border-2 border-[#ff6f00] cursor-pointer transition transform hover:scale-110 active:scale-95 group"
          title="HireHere AI Support"
        >
          <span className="text-lg font-black tracking-tighter">
            H<span className="text-[#ff6f00]">H</span>
          </span>
        </a>
      </div>

    </div>
  );
}