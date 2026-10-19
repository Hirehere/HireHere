'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployerSignup() {
  const [step, setStep] = useState<'details' | 'verify'>('details');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1: Request Signup & Send OTP to Email (Saving metadata for trigger)
  const handleInitialSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
            phone: phone,
          },
        },
      });

      if (error) throw error;

      alert('Verification OTP aapki email par bhej diya gaya hai. Kripya enter karein.');
      setStep('verify');
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Email OTP and Redirect
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      });

      if (error) throw error;

      if (data.user) {
        // Fallback safety insert in case trigger takes a moment
        await supabase.from('employer_profiles').upsert([
          {
            id: data.user.id,
            company_name: companyName,
            email: email,
            phone: phone,
          },
        ], { onConflict: 'id' });

        alert('🎉 Email verify ho gaya aur account safaltapurvak ban gaya!');
        router.push('/employer/dashboard');
      }
    } catch (err: any) {
      alert('Invalid OTP ya Error: ' + err.message);
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
          <p className="text-sm text-gray-500 mt-1">
            {step === 'details' ? 'नया Employer Account बनाएं' : 'ईमेल ओटीपी वेरीफाई करें'}
          </p>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleInitialSignup} className="space-y-4">
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
              {loading ? 'OTP भेजा जा रहा है...' : 'OTP भेजें और आगे बढ़ें'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-200">
              Humne aapke email <b>{email}</b> par verification OTP bhej diya hai. Kripya niche enter karein.
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter Email OTP *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full border rounded p-3 mt-1 text-center tracking-widest text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700 transition cursor-pointer"
            >
              {loading ? 'Verify हो रहा है...' : 'Verify OTP & Complete Registration'}
            </button>

            <button
              type="button"
              onClick={() => setStep('details')}
              className="w-full text-sm text-gray-500 hover:underline text-center block pt-2"
            >
              ← Email या details बदलें
            </button>
          </form>
        )}

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