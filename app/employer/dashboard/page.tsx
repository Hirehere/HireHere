'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/employer/login');
        return;
      }
      setUser(data.user);
      fetchDashboardData(data.user.id);
    };
    checkUser();
  }, [router]);

  const fetchDashboardData = async (employerId: string) => {
    setLoading(true);
    try {
      // 1. Fetch Employer's Jobs
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false });

      setPostedJobs(jobData || []);

      // 2. Fetch Matching Candidate Profiles / Responses
      const { data: candidateData } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      setCandidates(candidateData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/employer/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="font-bold text-gray-600">डैशबोर्ड लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-[#0d47a1] text-white p-4 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black">
            Hire<span className="text-[#ff6f00]">Here</span> Employer Portal
          </h1>
          <p className="text-xs text-blue-200">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/post-job"
            className="bg-[#ff6f00] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
          >
            + नई जॉब पोस्ट करें
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
          >
            लॉगआउट
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        {/* Posted Jobs Section */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            📌 आपके द्वारा पोस्ट की गई नौकरियां ({postedJobs.length})
          </h2>

          {postedJobs.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border text-center text-gray-500">
              आपने अभी तक कोई जॉब पोस्ट नहीं की है।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {postedJobs.map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-xl border shadow-sm">
                  <h3 className="font-bold text-[#0d47a1] text-lg">{job.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {job.location_city} | 💰 ₹{job.min_salary} - ₹{job.max_salary}
                  </p>
                  <p className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded w-max mt-2">
                    कैटेगरी: {job.category}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Candidate Responses & CV Section */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            📋 उपलब्ध वर्कर एवं सीवी (Candidates & Responses)
          </h2>

          <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3">नाम</th>
                  <th className="p-3">मोबाइल</th>
                  <th className="p-3">शहर</th>
                  <th className="p-3">रोल / योग्यता</th>
                  <th className="p-3">अनुभव</th>
                  <th className="p-3">सीवी / रेज़्यूमे</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-bold">{c.full_name}</td>
                    <td className="p-3">
                      <a href={`tel:${c.phone}`} className="text-blue-600 font-bold underline">
                        📞 {c.phone}
                      </a>
                    </td>
                    <td className="p-3">{c.city}</td>
                    <td className="p-3">{c.designation} ({c.qualification})</td>
                    <td className="p-3">{c.experience}</td>
                    <td className="p-3">
                      {c.resume_url ? (
                        <a
                          href={c.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-green-600 text-white px-2.5 py-1 rounded text-xs font-bold"
                        >
                          📄 CV देखें
                        </a>
                      ) : (
                        <span className="text-gray-400">उपलब्ध नहीं</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}