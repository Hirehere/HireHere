'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerifyDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanName = fullName.trim();

    // 1. Check in 'employers' table
    const { data: employer, error } = await supabase
      .from('employers')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error || !employer) {
      setErrorMsg('यह ईमेल आईडी रजिस्टर्ड नहीं है।');
      setLoading(false);
      return;
    }

    // 2. Cross-check name and phone
    const dbName = String(employer.full_name || employer.name || '').trim().toLowerCase();
    const dbPhone = String(employer.phone || '').trim().replace(/\D/g, '');

    if (dbName !== cleanName.toLowerCase() || dbPhone !== cleanPhone) {
      setErrorMsg('दर्ज किया गया नाम या मोबाइल नंबर इस ईमेल आईडी से मैच नहीं कर रहा है।');
      setLoading(false);
      return;
    }

    // 3. Redirect securely to reset-password page
    router.push(`/employer/reset-password?email=${encodeURIComponent(cleanEmail)}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            पासवर्ड रीसेट करें (Verify Details)
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            अपनी सही जानकारी दर्ज करें ताकि हम आपकी पहचान सत्यापित कर सकें।
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleVerifyDetails} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              पूरा नाम (Full Name)
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="उदा. Sujit Shinde"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              रजिस्टर्ड ईमेल आईडी (Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hr@company.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              रजिस्टर्ड मोबाइल नंबर (10-Digit Mobile)
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'जांच हो रही है...' : 'आगे बढ़ें (Verify)'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/employer/login" className="text-blue-600 font-bold hover:underline">
            ← Login पेज पर वापस जाएं
          </Link>
        </div>
      </div>
    </div>
  );
}