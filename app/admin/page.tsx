'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates'>('jobs');
  const [loading, setLoading] = useState(false);

  // Simple Security Check (Aap apna secret password yahan badal sakte hain)
  const ADMIN_SECRET = 'sujit123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Galat Password! Kripya sahi password dalein.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    // Fetch Jobs
    const { data: jobsData } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Fetch Candidates
    const { data: candidatesData } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });

    setJobs(jobsData || []);
    setCandidates(candidatesData || []);
    setLoading(false);
  };

  const deleteJob = async (id: string) => {
    if (confirm('Kya aap sach me is job post ko delete karna chahte hain?')) {
      await supabase.from('jobs').delete().eq('id', id);
      fetchData();
    }
  };

  const deleteCandidate = async (id: string) => {
    if (confirm('Kya aap sach me is worker profile ko delete karna chahte hain?')) {
      await supabase.from('candidates').delete().eq('id', id);
      fetchData();
    }
  };

  // PASSWORD LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center border">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-black text-[#0d47a1] mb-1">HireHere Admin Login</h1>
          <p className="text-xs text-gray-500 mb-6">Sujit Shinde Admin Access Only</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password Daalein"
              className="w-full p-3 border rounded-xl text-sm outline-none focus:border-[#0d47a1]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-[#0d47a1] hover:bg-[#1976d2] text-white font-bold p-3 rounded-xl transition shadow"
            >
              Unlock Admin Panel
            </button>
          </form>
          <div className="mt-4 text-xs text-gray-400">
            Default Password: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">sujit123</code>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD
  return (
    <div className="w-full min-h-screen bg-[#f8fafc] font-sans pb-20 text-[#1a1a1a]">
      {/* Header */}
      <header className="w-full bg-[#0d47a1] text-white px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="w-full flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-black tracking-tight leading-none">
              Hire<span className="text-[#ff6f00]">Here</span>
            </Link>
            <span className="bg-[#ff6f00] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              ADMIN CONTROL
            </span>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition"
          >
            Logout 🔒
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase">Total Jobs Posted</div>
              <div className="text-3xl font-black text-[#0d47a1]">{jobs.length}</div>
            </div>
            <span className="text-4xl">📋</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase">Registered Workers</div>
              <div className="text-3xl font-black text-[#ff6f00]">{candidates.length}</div>
            </div>
            <span className="text-4xl">👷‍♂️</span>
          </div>
        </div>

        {/* TABS BUTTONS */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === 'jobs'
                ? 'bg-[#0d47a1] text-white shadow'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            📋 All Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === 'candidates'
                ? 'bg-[#0d47a1] text-white shadow'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            👷‍♂️ All Workers ({candidates.length})
          </button>
        </div>

        {/* DATA TABLE */}
        {loading ? (
          <p className="text-center py-10 font-bold text-gray-500">Data Load Ho Raha Hai...</p>
        ) : activeTab === 'jobs' ? (
          /* JOBS TABLE */
          <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b text-gray-600 text-xs uppercase">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Salary</th>
                  <th className="p-4">Contact HR</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-[#0d47a1]">{job.title}</td>
                    <td className="p-4 font-medium">{job.company_name}</td>
                    <td className="p-4">{job.location_city}</td>
                    <td className="p-4 text-green-700 font-bold">₹{job.min_salary} - ₹{job.max_salary}</td>
                    <td className="p-4 text-xs">
                      <div>📞 {job.hr_call_number}</div>
                      <div>💬 {job.hr_whatsapp_number}</div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition"
                      >
                        Delete 🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* CANDIDATES TABLE */
          <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b text-gray-600 text-xs uppercase">
                <tr>
                  <th className="p-4">Worker Name</th>
                  <th className="p-4">Mobile Number</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Preferred Job</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {candidates.map((worker) => (
                  <tr key={worker.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{worker.full_name}</td>
                    <td className="p-4 font-bold text-[#0d47a1]">📞 {worker.mobile_number}</td>
                    <td className="p-4">{worker.city}</td>
                    <td className="p-4 capitalize font-semibold">{worker.preferred_job_category}</td>
                    <td className="p-4 text-xs">{worker.experience_years}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteCandidate(worker.id)}
                        className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition"
                      >
                        Delete 🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}