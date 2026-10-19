'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployerSignup() {
  const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // STEP 1: Send OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('कृपया अपनी ईमेल आईडी दर्ज करें।');
      return;
    }
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: 'TempPassword123!',
      });

      if (error && !error.message.includes('already registered')) {
        throw error;
      }

      alert('Verification OTP आपकी ईमेल पर भेज दिया गया है। कृपया दर्ज करें।');
      setStep('otp');
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      alert('कृपया 6 अंकों का OTP दर्ज करें।');
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'signup',
      });

      if (error) throw error;

      if (data.session || data.user) {
        alert('🎉 ईमेल सफलतापूर्वक वेरीफाई हो गया! अब अपनी अन्य जानकारी दर्ज करें।');
        setStep('details');
      }
    } catch (err: any) {
      alert('Invalid OTP या Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Save Password & Profile Details
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password,
      });

      if (passwordError) throw passwordError;

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (user) {
        const { error: profileError } = await supabase.from('employer_profiles').upsert([
          {
            id: user.id,
            company_name: companyName,
            email: email.trim().toLowerCase(),
            phone: phone,
          },
        ], { onConflict: 'id' });

        if (profileError) throw profileError;

        alert('🚀 अकाउंट सफलतापूर्वक बन गया है!');
        router.push('/employer/dashboard');
      }
    } catch (err: any) {
      alert('Registration Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-800">
            Hire<span className="text-[#ff6f00]">Here</span> Employer
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === 'email' && 'स्टेप 1: ईमेल आईडी दर्ज करें'}
            {step === 'otp' && 'स्टेप 2: ईमेल ओटीपी वेरीफाई करें'}
            {step === 'details' && 'स्टेप 3: कंपनी और पासवर्ड विवरण भरें'}
          </p>
        </div>

        {/* STEP 1: Enter Email Only */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ईमेल आईडी (Email Address) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition disabled:opacity-50 cursor-pointer block text-center"
            >
              {loading ? 'OTP भेजा जा रहा है...' : 'OTP भेजें और आगे बढ़ें'}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-200">
              हमने आपके ईमेल <b>{email}</b> पर 6 अंकों का OTP भेजा है।
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Enter Email OTP *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full border border-gray-300 rounded-lg p-3 text-center tracking-widest text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition disabled:opacity-50 cursor-pointer block text-center"
            >
              {loading ? 'वेरीफाई हो रहा है...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-sm text-gray-500 hover:underline text-center block pt-2"
            >
              ← दूसरी ईमेल दर्ज करें
            </button>
          </form>
        )}

        {/* STEP 3: Details & Password */}
        {step === 'details' && (
          <form onSubmit={handleCompleteRegistration} className="space-y-4">
            <div className="bg-green-50 p-2.5 rounded-lg text-xs text-green-800 border border-green-200 text-center font-medium">
              ✓ Email Verified: {email}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                कंपनी / दुकान का नाम (Company Name) *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="अपनी कंपनी का नाम यहाँ लिखें"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                मोबाइल नंबर (Mobile Number) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                पासवर्ड (Password) *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition disabled:opacity-50 cursor-pointer block text-center"
            >
              {loading ? 'अकाउंट बन रहा है...' : 'अकाउंट रजिस्टर करें (Complete)'}
            </button>
          </form>
        )}

        <div className="text-center mt-6 text-sm text-gray-600">
          पहले से अकाउंट है?{' '}
          <Link href="/employer/login" className="text-blue-600 font-bold hover:underline">
            Login करें
          </Link>
        </div>
      </div>
    </div>
  );
}