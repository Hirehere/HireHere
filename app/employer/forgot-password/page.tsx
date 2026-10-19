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

  // STEP 1: Send OTP Code to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data: employer, error: checkError } = await supabase
        .from('employer_profiles')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (checkError || !employer) {
        setErrorMsg('Yeh Email ID registered nahi hai.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);

      if (error) {
        setErrorMsg(error.message || 'OTP bhejne me samasya aayi.');
      } else {
        setSuccessMsg(`OTP aapke email (${cleanEmail}) par bhej diya gaya hai!`);
        setStep(2);
      }
    } catch (err: any) {
      setErrorMsg('Kuch takniki samasya aayi hai.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify Standard OTP
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

      if (error || !data.session) {
        setErrorMsg('Galat ya expired OTP hai. Kripya firse check karein.');
      } else {
        setSuccessMsg('OTP verify ho gaya! Ab naya password banayein.');
        setStep(3);
      }
    } catch (err: any) {
      setErrorMsg('OTP verification me error aayi.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Password kam se kam 6 aksharon ka hona chahiye.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Dono password match nahi kar rahe hain.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMsg(error.message || 'Password update karne me samasya aayi.');
      } else {
        setSuccessMsg('🎉 Password safaltapoorvak badal diya gaya hai! Login page par bheja ja raha hai...');
        setTimeout(() => {
          router.push('/employer/login');
        }, 2500);
      }
    } catch (err: any) {
      setErrorMsg('Password update karte samay error aayi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Verify Email OTP'}
            {step === 3 && 'Naya Password Banayein'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1 && 'Apni registered Email ID darj karein.'}
            {step === 2 && 'Email par aaya 6-digit OTP code darj karein.'}
            {step === 3 && 'Apne account ke liye naya password set karein.'}
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

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Registered Email ID *
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
              {loading ? 'OTP Bheja ja raha hai...' : 'OTP Bhejen'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Enter 6-Digit OTP *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-2.5 border rounded-lg text-center tracking-widest text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg shadow transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Verify ho raha hai...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 hover:underline text-center block pt-1"
            >
              ← Email ID badlein
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Naya Password *
              </label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Confirm Naya Password *
              </label>
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
              {loading ? 'Save ho raha hai...' : 'Naya Password Save Karein'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href="/employer/login" className="text-blue-600 font-bold hover:underline">
            ← Login Page par wapas jayein
          </Link>
        </div>
      </div>
    </div>
  );
}