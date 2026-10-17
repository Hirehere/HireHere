'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPassword() {
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');
    setLoading(true);

    if (phone.trim().length < 10) {
      setErrorMsg('कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।');
      setLoading(false);
      return;
    }

    // Mobile number to dummy email mapping
    const formattedEmail = `${phone.trim().replace(/\D/g, '')}@hirehere.in`;

    // Reset password request via Supabase Auth
    const { error } = await supabase.auth.resetPasswordForEmail(formattedEmail, {
      redirectTo: `${window.location.origin}/employer/login`,
    });

    if (error) {
      setErrorMsg('इस मोबाइल नंबर से कोई अकाउंट नहीं मिला या कोई एरर आया।');
    } else {
      setMessage('पासवर्ड रीसेट करने का लिंक जारी कर दिया गया है। कृपया लॉग इन करने का प्रयास करें।');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            पासवर्ड भूल गए? (Forgot Password)
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            अपना रजिस्टर्ड मोबाइल नंबर दर्ज करके पासवर्ड रीसेट करें।
          </p>
        </div>

        {/* Success Alert */}
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {message}
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              रजिस्टर्ड मोबाइल नंबर
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 font-medium">+91</span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow transition disabled:opacity-50"
          >
            {loading ? 'प्रक्रिया जारी है...' : 'पासवर्ड रीसेट की रिक्वेस्ट भेजें'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/employer/login" className="text-blue-600 font-bold hover:underline">
            ← Login पेज पर वापस जाएं
          </Link>
        </div>

      </div>
    </div>
  );
}