
'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/employer/login`,
    });

    if (error) {
      setErrorMsg(error.message || 'पासवर्ड रीसेट ईमेल भेजने में समस्या आई।');
    } else {
      setMessage('आपकी ईमेल आईडी पर पासवर्ड रीसेट लिंक भेज दिया गया है। अपना इनबॉक्स / स्पैम फोल्डर चेक करें।');
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
            अपनी रजिस्टर्ड ईमेल आईडी दर्ज करें, हम आपको रीसेट लिंक भेजेंगे।
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
              रजिस्टर्ड ईमेल आईडी (Registered Email)
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow transition disabled:opacity-50"
          >
            {loading ? 'भेजा जा रहा है...' : 'पासवर्ड रीसेट लिंक भेजें'}
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
} y
