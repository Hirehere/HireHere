'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployerSignup() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Insert into employer_profiles table
        const { error: profileError } = await supabase.from('employer_profiles').insert([
          {
            id: authData.user.id,
            company_name: companyName,
            email: email,
            phone: phone,
          },
        ]);

        if (profileError) throw profileError;

        alert('Account created successfully!');
        router.push('/employer/dashboard');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-800">
            Hire<span className="text-[#ff6f00]">Here</span> Employer
          </h1>
          <p className="text-sm text-gray-500 mt-1">नया Employer Account बनाएं</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              कंपनी / दुकान का नाम (Company Name) *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="अपनी कंपनी का नाम यहाँ लिखें"
              className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ईमेल आईडी (Email Address) *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              मोबाइल नंबर (Mobile Number) *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              पासवर्ड (Password) *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            {loading ? 'बना रहा है...' : 'Account बनाएं (Register)'}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          पहले से अकाउंट है?{' '}
          <Link href="/employer/login" className="text-blue-600 font-bold hover:underline">
            Login करें
          </Link>
        </div>
      </div>
    </div>
  );
}