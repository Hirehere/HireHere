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
    if (!email) return;
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      alert('Verification OTP aapki email par bhej diya gaya hai. Kripya enter karein.');
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
    if (!otp) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'email',
      });

      if (error) throw error;

      if (data.session || data.user) {
        alert('🎉 Email safaltapurvak verify ho gaya! Ab apni baaki details bharein.');
        setStep('details');
      }
    } catch (err: any) {
      alert('Invalid OTP ya Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Save Password & Employer Profile
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

        alert('🚀 Account safaltapurvak ban gaya hai!');
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
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-800">
            Hire<span className="text-[#ff6f00]">Here</span> Employer
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === 'email' && 'Step 1: Email ID darj karein'}
            {step === 'otp' && 'Step 2: Email OTP verify karein'}
            {step === 'details' && 'Step 3: Company aur Password details bharein'}
          </p>
        </div>

        {/* STEP 1: Enter Email */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full border rounded p-2.5 mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              {loading ? 'OTP bheja ja raha hai...' : 'OTP Bhejen'}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-200">
              Humne aapke email <b>{email}</b> par 6 अंकों ka OTP bhej diya hai.
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
              {loading ? 'Verify ho raha hai...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-sm text-gray-500 hover:underline text-center block pt-2"
            >
              ← Dusri Email ID badlein
            </button>
          </form>
        )}

        {/* STEP 3: Complete Details Form */}
        {step === 'details' && (
          <form onSubmit={handleCompleteRegistration} className="space-y-4">
            <div className="bg-green-50 p-2.5 rounded-lg text-xs text-green-800 border border-green-200 text-center font-medium">
              ✓ Email Verified: {email}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Apni company ka naam likhein"
                className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number *
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
                Create Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
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
              {loading ? 'Account ban raha hai...' : 'Account Register Karein'}
            </button>
          </form>
        )}

        <div className="text-center mt-4 text-sm text-gray-600">
          Pehle se account hai?{' '}
          <Link href="/employer/login" className="text-blue-600 font-bold hover:underline">
            Login karein
          </Link>
        </div>
      </div>
    </div>
  );
}