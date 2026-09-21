'use client';
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PostJob() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    category: 'driver',
    location_city: '',
    min_salary: '',
    max_salary: '',
    hr_call_number: '',
    hr_whatsapp_number: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('jobs').insert([
      {
        ...formData,
        min_salary: Number(formData.min_salary),
        max_salary: Number(formData.max_salary),
        is_verified: true,
      },
    ]);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('🎉 Job safaltapurvak post ho gayi hai!');
      router.push('/');
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
          <span className="text-xs font-bold bg-[#ff6f00] text-white px-3 py-1 rounded-full">
            Employer Portal
          </span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100">
          <div className="text-center mb-6">
            <span className="text-4xl block mb-2">🏢</span>
            <h1 className="text-2xl font-black text-[#0d47a1]">
              अपनी दुकान/कंपनी के लिए <span className="text-[#ff6f00]">वर्कर खोजें</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              2 मिनट में जॉब पोस्ट करें — सीधे फोन या WhatsApp पर कॉल पाएं!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                काम का नाम (Job Title) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. कार ड्राइवर चाहिए / डिलीवरी बॉय"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0d47a1]"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                कंपनी/मालिक का नाम (Company / Owner Name) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. Royal Enterprise / Sujit Shinde"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0d47a1]"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                कैटेगरी (Category) *
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none bg-white focus:border-[#0d47a1]"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="driver">🚗 ड्राइवर (Driver)</option>
                <option value="delivery">📦 डिलीवरी (Delivery)</option>
                <option value="security">🛡️ सिक्योरिटी (Security)</option>
                <option value="electrician">⚡ इलेक्ट्रीशियन (Electrician)</option>
                <option value="cleaning">🧹 सफाई (Cleaning)</option>
                <option value="factory">🏭 फैक्ट्री (Factory)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                शहर (City / Location) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. Pune, Mumbai, Delhi"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0d47a1]"
                value={formData.location_city}
                onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  कम से कम सैलरी (₹/Month) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="15000"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0d47a1]"
                  value={formData.min_salary}
                  onChange={(e) => setFormData({ ...formData, min_salary: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ज्यादा से ज्यादा सैलरी (₹/Month) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="25000"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0d47a1]"
                  value={formData.max_salary}
                  onChange={(e) => setFormData({ ...formData, max_salary: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                कॉल करने का नंबर (Calling Number) *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="वर्कर जिस नंबर पर कॉल करेगा"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0d47a1]"
                value={formData.hr_call_number}
                onChange={(e) => setFormData({ ...formData, hr_call_number: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                WhatsApp नंबर *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="वर्कर जिस नंबर पर WhatsApp मैसेज करेगा"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0d47a1]"
                value={formData.hr_whatsapp_number}
                onChange={(e) => setFormData({ ...formData, hr_whatsapp_number: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d47a1] hover:bg-[#1976d2] text-white font-extrabold p-3.5 rounded-xl text-base transition shadow-md mt-2 disabled:opacity-50"
            >
              {loading ? 'जॉब पोस्ट हो रही है...' : '🚀 मुफ्त में जॉब पोस्ट करें'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}