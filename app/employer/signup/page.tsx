'use client';

import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase'; // Apne project ke mutabiq path check kar lein
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployerSignup() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    try {
      // 1. Supabase Auth me user banayein
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
      });

      if (authError) {
        setErrorMsg(authError.message || 'Signup karne me samasya aayi.');
        setLoading(false);
        return;
      }

      if (authData.user) {
        // 2. employer_profiles table me details insert karein
        const { error: profileError } = await supabase
          .from('employer_profiles')
          .insert([
            {
              id: authData.user.id,
              company_name: companyName.trim(),
              email: cleanEmail,
              phone: cleanPhone,
            },
          ]);

        if (profileError) {
          setErrorMsg('Auth ban gaya par profile save karne me error aayi: ' + profileError.message);
          setLoading(false);
          return;
        }

        alert('Account safaltapoorvak ban gaya hai! Ab aap login kar sakte hain.');
        router.push('/employer/login');
      }
    } catch (err: any) {
      setErrorMsg('Kuch takniki samasya aayi hai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Naya Employer Account Banayein</h1>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Company / Dukan ka Naam</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email ID</label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              required
              maxLength={15}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Kripya pratiksha karein...' : 'Register Karein'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/employer/login" className="text-blue-600 font-bold hover:underline">
            Pehle se account hai? Login karein
          </Link>
        </div>
      </div>
    </div>
  );
}