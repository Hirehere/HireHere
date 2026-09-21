'use client';
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EmployeeRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    city: '',
    preferred_job_category: 'driver',
    experience_years: '0-1 year',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from('candidates')
      .insert([formData])
      .select();

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Aapka Worker Profile safaltapurvak ban gaya hai!');
      if (data && data[0]) {
        localStorage.setItem('hirehere_candidate_id', data[0].id);
      }
      router.push('/#jobs-section');
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] font-sans pb-20 text-[#1a1a1a]">
      <header className="w-full bg-[#0d47a1] text-white px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="w-full flex justify-between items-center max-w-5xl mx-auto">
          <Link href="/" className="text-2xl font-black tracking-tight leading-none">
            Hire<span className="text-[#ff6f00]">Here</span>
          </Link>
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
            Worker Registration
          </span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100">
          <div className="text-center mb-6">
            <span className="text-4xl block mb-2">📱</span>
            <h1 className="text-2xl font-black text-[#0d47a1]">
              काम पाने के लिए <span className="text-[#ff6f00]">प्रोफाइल बनाएं</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              ना रिज़्यूमे, ना फीस — 1 मिनट में डायरेक्ट काम पाओ!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                आपका पूरा नाम (Full Name) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. Ramesh Kumar"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0d47a1]"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                मोबाइल नंबर (Mobile Number) *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="10 अंकों का मोबाइल नंबर"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0d47a1]"
                value={formData.mobile_number}
                onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                आपका शहर (City) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. Pune, Mumbai, Delhi"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0d47a1]"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                किस तरह का काम चाहिए? *
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none bg-white focus:border-[#0d47a1]"
                value={formData.preferred_job_category}
                onChange={(e) => setFormData({ ...formData, preferred_job_category: e.target.value })}
              >
                <option value="driver">🚗 ड्राइवर (Driver)</option>
                <option value="delivery">📦 डिलीवरी (Delivery Boy)</option>
                <option value="security">🛡️ सिक्योरिटी गार्ड (Security)</option>
                <option value="electrician">⚡ इलेक्ट्रीशियन / प्लंबर</option>
                <option value="cleaning">🧹 सफाई / हाउसकीपिंग</option>
                <option value="factory">🏭 फैक्ट्री / हेल्पर</option>
                <option value="cook">👨‍🍳 कुक / शेफ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                अनुभव (Experience) *
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none bg-white focus:border-[#0d47a1]"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              >
                <option value="Fresher / No Exp">फ्रेशर (कोई अनुभव नहीं)</option>
                <option value="0-1 year">0 - 1 साल</option>
                <option value="1-3 years">1 - 3 साल</option>
                <option value="3+ years">3 साल से ज्यादा</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff6f00] hover:bg-[#e65100] text-white font-extrabold p-3.5 rounded-xl text-base transition shadow-md mt-2 disabled:opacity-50"
            >
              {loading ? 'रजिस्टर हो रहा है...' : '✅ प्रोफाइल बनाएं और काम देखें'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}