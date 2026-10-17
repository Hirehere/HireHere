'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      router.push('/employer/forgot-password');
    }
  }, [email, router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');

    if (newPassword.length < 6) {
      setErrorMsg('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('दोनों पासवर्ड मैच नहीं कर रहे हैं।');
      return;
    }

    setLoading(true);

    // Note: To update password directly via email without active session, 
    // we can use a server-side action or Supabase admin API if needed, 
    // but let's check if the user is logged in or use direct sign-in fallback.
    
    // For safety, let's update user password directly
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      // Fallback: If not logged in, we can update via direct RPC or sign in temporarily if needed.
      // But since they verified name/phone, let's inform or handle error.
      setErrorMsg(error.message || 'पासवर्ड अपडेट करने में समस्या आई। कृपया पहले लॉगिन करें।');
    } else {
      setMessage('🎉 पासवर्ड सफलतापूर्वक बदल दिया गया है! आपको लॉगिन पेज पर भेजा जा रहा है...');
      setTimeout(() => {
        router.push('/employer/login');
      }, 2500);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            नया पासवर्ड बनाएं (New Password)
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            सत्यापन सफल रहा! कृपया अपने खाते के लिए नया पासवर्ड दर्ज करें।
          </p>
          {email && <p className="text-xs text-blue-600 font-semibold mt-1">({email})</p>}
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
              नया पासवर्ड (New Password)
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
              पासवर्ड की पुष्टि करें (Confirm Password)
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
            {loading ? 'पासवर्ड सेव हो रहा है...' : 'नया पासवर्ड सेव करें'}
          </button>
        </form>
      </div>
    </div>
  );
}