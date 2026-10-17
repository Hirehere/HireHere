'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployerAuth() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      router.push('/employer/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (isRegister) {
      // REGISTER LOGIC
      if (phone.trim().length < 10) {
        setErrorMsg('कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            company_name: companyName,
            phone_number: phone,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        alert('Account सफलतापूर्वक बन गया है! यदि ईमेल वेरिफिकेशन ऑन है तो इनबॉक्स चेक करें, अन्यथा लॉगिन करें।');
        setIsRegister(false);
      }
    } else {
      // LOGIN LOGIC
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMsg('गलत ईमेल आईडी या पासवर्ड। (Invalid login credentials)');
      } else {
        router.push('/employer/dashboard');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-blue-700">Hire</span>
            <span className="text-orange-500">Here</span>{' '}
            <span className="text-gray-800 font-semibold text-2xl">Employer</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isRegister ? 'नया Employer Account बनाएं' : 'अपने Account में Login करें'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Company Name (Registration Only) */}
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                कंपनी / दुकान का नाम (Company Name) *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. SL Polycoat Pvt Ltd"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>
          )}

          {/* Email Address (Mandatory for Both) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ईमेल आईडी (Email Address) *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hr@company.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium"
            />
          </div>

          {/* Mobile Number Field (Registration Only) */}
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                मोबाइल नंबर (Mobile Number) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium"
                />
              </div>
            </div>
          )}

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-gray-700">
                पासवर्ड (Password) *
              </label>
              {!isRegister && (
                <Link href="/employer/forgot-password" className="text-xs text-blue-600 hover:underline">
                  पासवर्ड भूल गए?
                </Link>
              )}
            </div>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow transition duration-150 disabled:opacity-50"
          >
            {loading
              ? 'कृपया प्रतीक्षा करें...'
              : isRegister
              ? 'Account बनाएं (Register)'
              : 'Login करें'}
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {isRegister ? (
            <p>
              पहले से अकाउंट है?{' '}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg('');
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Login करें
              </button>
            </p>
          ) : (
            <p>
              खाता नहीं है?{' '}
              <button
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg('');
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                नया Account बनाएं
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}