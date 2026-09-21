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
    qualification: '10th Pass',
    designation: '',
    notice_period: 'Immediate',
    expected_salary: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let resumeUrl = '';

      // 1. Upload Resume to Supabase Storage if file is selected
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Date.now()}_${formData.mobile_number}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resumeFile);

        if (uploadError) {
          console.error('Resume upload error:', uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('resumes')
            .getPublicUrl(fileName);
          resumeUrl = publicUrlData.publicUrl;
        }
      }

      // 2. Insert Candidate Record in Database
      const { data, error } = await supabase
        .from('candidates')
        .insert([
          {
            ...formData,
            resume_url: resumeUrl,
          },
        ])
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
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
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
              डायरेक्ट काम पाओ — 1 मिनट में प्रोफाइल बनाएं!
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
                पद / Designation *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. Sr. Driver, Accountant, Sales Executive"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0d47a1]"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                किस तरह का काम चाहिए? (Category) *
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
                <option value="office">💻 ऑफिस / अकाउंट्स / सेल्स</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                शैक्षणिक योग्यता (Qualification) *
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none bg-white focus:border-[#0d47a1]"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              >
                <option value="below_10th">10th से कम</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="ITI / Diploma">ITI / Diploma</option>
                <option value="Graduate">Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
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

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                नोटिस पीरियड (Notice Period) *
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none bg-white focus:border-[#0d47a1]"
                value={formData.notice_period}
                onChange={(e) => setFormData({ ...formData, notice_period: e.target.value })}
              >
                <option value="Immediate">तुरंत ज्वाइन कर सकते हैं (Immediate)</option>
                <option value="15 Days">15 दिन</option>
                <option value="1 Month">1 महीना</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                अपेक्षित वेतन (Expected Salary per Month) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. ₹15,000 - ₹20,000"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0d47a1]"
                value={formData.expected_salary}
                onChange={(e) => setFormData({ ...formData, expected_salary: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                रिज्यूमे अटैच करें (Attach Resume - Optional)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full p-2.5 border border-gray-300 rounded-xl text-xs outline-none bg-gray-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0d47a1] file:text-white hover:file:bg-[#0a3880]"
                onChange={(e) => e.target.files && setResumeFile(e.target.files[0])}
              />
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