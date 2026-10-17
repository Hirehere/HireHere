'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if hash contains recovery token and let Supabase establish session
    const handleRecoverySession = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        // Supabase client automatically handles hash fragments on client init, 
        // but we can ensure session exists.
      }
    };
    handleRecoverySession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');

    if (newPassword.length < 6) {
      setErrorMsg('Password kam se kam 6 aksharon ka hona chahiye.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Dono password match nahi kar rahe hain.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setErrorMsg(error.message || 'Password update karne me samasya aayi. Kripya naya link mangaayein.');
    } else {
      setMessage('🎉 Password safaltapoorvak badal diya gaya hai! Aapko login page par bheja ja raha hai...');
      setTimeout(() => {
        router.push('/employer/login');
      }, 2500);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Naya Password Banayein (New Password)
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Kripya apne khate ke liye naya password darj karein.
        </p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {message}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

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
          {loading ? 'Password save ho raha hai...' : 'Naya Password Save Karein'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-center text-gray-600 font-medium">Load ho raha hai...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}