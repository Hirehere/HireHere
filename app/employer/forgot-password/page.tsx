'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // Step 1: Verify details, Step 2: Update password
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. Verify Name, Email & Phone against 'employers' table
  const handleVerifyDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanName = fullName.trim();

    try {
      const { data: employer, error } = await supabase
        .from('employers')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (error || !employer) {
        setErrorMsg('Yeh email ID registered nahi hai.');
        setLoading(false);
        return;
      }

      const dbName = String(employer.full_name || employer.name || '').trim().toLowerCase();
      const dbPhone = String(employer.phone || '').trim().replace(/\D/g, '');

      if (dbName !== cleanName.toLowerCase() || dbPhone !== cleanPhone) {
        setErrorMsg('Darj kiya gaya naam ya mobile number is email ID se match nahi kar raha hai.');
        setLoading(false);
        return;
      }

      // Details matched successfully, move to password update step
      setStep(2);
      setSuccessMsg('Pahchan safaltapoorvak verify ho gayi hai! Ab naya password set karein.');
    } catch (err: any) {
      setErrorMsg('Kuch takniki samasya aayi hai. Kripya punah prayas karein.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Update Password directly using Supabase Auth
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
      // Note: To update user password directly, we can use supabase auth updateUser 
      // or custom backend action if needed. Let's update password for the current auth user context.
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMsg(error.message || 'Password update karne me samasya aayi.');
      } else {
        setSuccessMsg('🎉 Password safaltapoorvak badal diya gaya hai! Aapko login page par bheja ja raha hai...');
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
            {step === 1 ? 'Password Reset - Verify Details' : 'Naya Password Banayein'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1 
              ? 'Apna naam, registered email aur mobile number darj karein.' 
              : 'Apne khate ke liye naya password darj karein.'}
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

        {step === 1 ? (
          <form onSubmit={handleVerifyDetails} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Pura Naam (Full Name)
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jaise: Sujit Shinde"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Registered Email ID
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
                Registered Mobile Number (10 Digits)
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
              {loading ? 'Janch ho rahi hai...' : 'Details Verify Karein'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Naya Password (New Password)
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
                Password ki pushti karein (Confirm Password)
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