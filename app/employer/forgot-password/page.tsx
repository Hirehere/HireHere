'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      // Check if employer profile exists
      const { data: employer, error: fetchErr } = await supabase
        .from('employer_profiles')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (fetchErr || !employer) {
        setErrorMsg('यह ईमेल आईडी एम्प्लॉयर के रूप में रजिस्टर्ड नहीं है।');
        setLoading(false);
        return;
      }

      // Send Reset OTP Code via Supabase Auth
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(cleanEmail);

      if (resetErr) {
        setErrorMsg('OTP भेजने में समस्या आई: ' + resetErr.message);
      } else {
        setSuccessMsg(`आपके ईमेल ${cleanEmail} पर 6-अंकों का OTP भेज दिया गया है।`);
        setStep(2);
      }
    } catch (err: any) {
      setErrorMsg('कुछ तकनीकी समस्या आई है। कृपया पुन: प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Email OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'recovery',
      });

      if (error) {
        setErrorMsg('अमान्य (Invalid) या अमान्य OTP कोड। कृपया पुनः प्रयास करें।');
      } else if (data.session) {
        setSuccessMsg('OTP सफलतापूर्वक वेरीफाई हो गया! अब अपना नया पासवर्ड सेट करें।');
        setStep(3);
      }
    } catch (err: any) {
      setErrorMsg('OTP वेरिफिकेशन के दौरान एरर आया।');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Update New Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('दोनों पासवर्ड मैच नहीं कर रहे हैं।');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMsg(error.message || 'पासवर्ड अपडेट करने में समस्या आई।');
      } else {
        setSuccessMsg('🎉 पासवर्ड सफलतापूर्वक बदल दिया गया है! आपको लॉगिन पेज पर भेजा जा रहा है...');
        setTimeout(() => {
          router.push('/employer/login');
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg('पासवर्ड सेव करते समय एरर आया।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {step === 1 && 'पासवर्ड रीसेट - OTP भेजें'}
            {step === 2 && 'ईमेल OTP वेरीफाई करें'}
            {step === 3 && 'नया पासवर्ड बनाएं'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1 && 'अपनी रजिस्टर्ड ईमेल आईडी दर्ज करें जिस पर OTP भेजा जाएगा।'}
            {step === 2 && 'आपकी ईमेल पर आया 6-अंकों का OTP कोड दर्ज करें।'}
            {step === 3 && 'अपने एम्प्लॉयर अकाउंट के लिए नया पासवर्ड सेट करें।'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {successMsg}
          </div>
        )}

        {/* STEP 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                रजिस्टर्ड ईमेल आईडी (Registered Email) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'OTP भेजा जा रहा है...' : 'OTP कोड भेजें'}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Entry */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
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
                className="w-full px-4 py-3 border rounded-lg text-center tracking-widest text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg shadow transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'जांच हो रही है...' : 'OTP वेरीफाई करें'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 hover:underline text-center block pt-1"
            >
              ← ईमेल बदलें
            </button>
          </form>
        )}

        {/* STEP 3: Password Reset */}
        {step === 3 && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">नया पासवर्ड</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Save हो रहा है...' : 'नया पासवर्ड Save करें'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href="/employer/login" className="text-blue-600 font-bold hover:underline">
            ← Login Page पर वापस जाएं
          </Link>
        </div>
      </div>
    </div>
  );
}