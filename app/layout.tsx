'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployerLogin() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/employer/dashboard');
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false); // Loading state end hona zaroori hai
      }
    }
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 font-medium">डैशबोर्ड लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Employer Login</h2>
        {/* Aapka Login Form Form Elements Yahan Aayenge */}
        <p className="text-center text-sm text-gray-600">
          Aapka Login Form yahan active ho jayega.
        </p>
      </div>
    </div>
  );
}