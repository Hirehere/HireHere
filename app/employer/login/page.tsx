'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployerAuth() {
  const [isRegister, setIsRegister] = useState(false);
  const [regStep, setRegStep] = useState<'email' | 'otp' | 'details'>('email');

  // Form States
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      router.push('/employer/dashboard');
    }
  };

  // Switch between Login and Register Mode
  const toggleAuthMode = (toRegister: boolean) => {
    setIsRegister(toRegister);
    setRegStep('email');
    setErrorMsg('');
    setSuccessMsg('');
    setOtp('');
  };

  // --- LOGIN HANDLER ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      setErrorMsg('गलत ईमेल आईडी या पासवर्ड। (Invalid login credentials)');
    } else {
      router.push('/employer/dashboard');
    }

    setLoading(false);
  };

  // --- REGISTER STEP 1: SEND OTP ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // Initiate signup OTP via Supabase
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: 'TempPassword123!', // Dummy password until Step 3
      });

      if (error && !error.message.includes('already registered')) {
        throw error;
      }

      setSuccessMsg(`Verification OTP आपकी ईमेल (${cleanEmail}) पर भेज दिया गया है।`);
      setRegStep('otp');
    } catch (err: any) {
      setErrorMsg('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- REGISTER STEP 2: VERIFY OTP ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'signup',
      });

      if (error) throw error;

      if (data.session || data.user) {
        setSuccessMsg('🎉 ईमेल सफलतापूर्वक वेरीफाई हो गया! अब कंपनी विवरण और पासवर्ड भरें।');
        setRegStep('details');
      }
    } catch (err: any) {
      setErrorMsg('अमान्य (Invalid) OTP या एरर: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- REGISTER STEP 3: COMPLETE REGISTRATION ---
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (phone.trim().length < 10) {
      setErrorMsg('कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।');
      return;
    }

    setLoading(true);

    try {
      // 1. Update user password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password,
      });

      if (passwordError) throw passwordError;

      // 2. Get active user id
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (user) {
        // 3. Upsert employer profile
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
      setErrorMsg('Registration Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-blue-700">Hire</span>
            <span className="text-orange-500">Here</span>{' '}
            <span className="text-gray-800 font-semibold text-2xl">Employer</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {!isRegister && 'अपने Account में Login करें'}
            {isRegister && regStep === 'email' && 'स्टेप 1: ईमेल आईडी दर्ज करें'}
            {isRegister && regStep === 'otp' && 'स्टेप 2: ईमेल OTP वेरीफाई करें'}
            {isRegister && regStep === 'details' && 'स्टेप 3: कंपनी और पासवर्ड विवरण भरें'}
          </p>
        </div>

        {/* Alerts */}
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

        {/* --- LOGIN FORM --- */}
        {!isRegister && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ईमेल आईडी (Email Address) *
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

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">
                  पासवर्ड (Password) *
                </label>
                <Link href="/employer/forgot-password" className="text-xs text-blue-600 hover:underline">
                  पासवर्ड भूल गए?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow transition duration-150 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'कृपया प्रतीक्षा करें...' : 'Login करें'}
            </button>
          </form>
        )}

        {/* --- REGISTER STEP 1: EMAIL INPUT --- */}
        {isRegister && regStep === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ईमेल आईडी (Email Address) *
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow transition duration-150 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'OTP भेजा जा रहा है...' : 'OTP भेजें और आगे बढ़ें'}
            </button>
          </form>
        )}

        {/* --- REGISTER STEP 2: OTP VERIFY --- */}
        {isRegister && regStep === 'otp' && (
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
                className="w-full border rounded-lg p-3 text-center tracking-widest text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg shadow transition duration-150 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'वेरीफाई हो रहा है...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => {
                setRegStep('email');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="w-full text-sm text-gray-500 hover:underline text-center block pt-1"
            >
              ← दूसरी ईमेल दर्ज करें
            </button>
          </form>
        )}

        {/* --- REGISTER STEP 3: COMPANY & PASSWORD DETAILS --- */}
        {isRegister && regStep === 'details' && (
          <form onSubmit={handleCompleteRegistration} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                कंपनी / दुकान का नाम (Company Name) *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Company Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                मोबाइल नंबर (Mobile Number) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                पासवर्ड बनाएं (Password) *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow transition duration-150 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'अकाउंट बन रहा है...' : 'Account बनाएं (Complete)'}
            </button>
          </form>
        )}

        {/* Toggle Login / Register */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {isRegister ? (
            <p>
              पहले से अकाउंट है?{' '}
              <button
                type="button"
                onClick={() => toggleAuthMode(false)}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Login करें
              </button>
            </p>
          ) : (
            <p>
              खाता नहीं है?{' '}
              <button
                type="button"
                onClick={() => toggleAuthMode(true)}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                नया Account बनाएं
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}