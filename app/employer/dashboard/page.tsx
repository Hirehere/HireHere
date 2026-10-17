'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState<'applicants' | 'post-job' | 'candidates'>('applicants');
  const [lang, setLang] = useState<'hi' | 'en'>('hi'); // Language state
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // New Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [category, setCategory] = useState('Driver');
  const [customCategory, setCustomCategory] = useState('');
  const [allowDirectCall, setAllowDirectCall] = useState(true); // Allow Direct Call toggle

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/employer/login');
    } else {
      setUser(user);
      fetchEmployerData(user.id);
    }
  };

  const fetchEmployerData = async (employerId: string) => {
    setLoading(true);
    try {
      // 1. Fetch Employer's Posted Jobs
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false });
      
      const currentJobs = jobData || [];
      setJobs(currentJobs);

      // 2. Fetch Job Applications for these specific jobs along with Job title
      const { data: appData } = await supabase
        .from('job_applications')
        .select('*, jobs(title)')
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false });

      const currentApps = appData || [];
      setApplications(currentApps);

      // 3. Fetch Synced Candidate Profiles (Designation, Qualification, Resume) based on applicant phones
      if (currentApps.length > 0) {
        const applicantPhones = currentApps.map((app) => app.applicant_phone);
        
        const { data: candidateData } = await supabase
          .from('candidates')
          .select('*')
          .in('phone', applicantPhones);

        // Map application details with candidate profile info
        const enrichedCandidates = currentApps.map((app) => {
          const profile = (candidateData || []).find((c: any) => c.phone === app.applicant_phone);
          return {
            ...app,
            designation: profile?.designation || 'N/A',
            qualification: profile?.qualification || 'N/A',
            experience: profile?.experience || 'N/A',
            resume_url: app.resume_url || profile?.resume_url || '',
          };
        });

        setCandidates(enrichedCandidates);
      } else {
        setCandidates([]);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const finalCategory = category === 'Other' ? customCategory.trim() : category;

    if (!finalCategory) {
      alert(lang === 'hi' ? 'कृपया कैटेगिरी दर्ज करें।' : 'Please enter category.');
      return;
    }

    const { error } = await supabase.from('jobs').insert([
      {
        title: jobTitle,
        company,
        location_city: location,
        salary,
        category: finalCategory,
        employer_id: user.id,
        allow_direct_call: allowDirectCall, // Direct call flag saved to database
      },
    ]);

    if (!error) {
      alert(lang === 'hi' ? 'जॉब सफलतापूर्वक पोस्ट हो गई!' : 'Job Posted Successfully!');
      setJobTitle('');
      setCompany('');
      setLocation('');
      setSalary('');
      setCategory('Driver');
      setCustomCategory('');
      setAllowDirectCall(true);
      setActiveTab('applicants');
      fetchEmployerData(user.id);
    } else {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="font-bold text-gray-600">डैशबोर्ड लोड हो रहा है / Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        
        {/* Header & Language Toggle */}
        <div className="flex justify-between items-center border-b pb-4 mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800">
              Hire<span className="text-[#ff6f00]">Here</span> Employer Portal
            </h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switch Button */}
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-300 transition cursor-pointer"
            >
              🌐 {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/employer/login');
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 cursor-pointer"
            >
              {lang === 'hi' ? 'लॉगआउट (Logout)' : 'Logout'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 md:gap-4 border-b mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('applicants')}
            className={`pb-2 px-4 font-bold whitespace-nowrap cursor-pointer ${
              activeTab === 'applicants'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            📋 {lang === 'hi' ? `कैंडिडेट्स और आवेदन (${applications.length})` : `Candidates & Applications (${applications.length})`}
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`pb-2 px-4 font-bold whitespace-nowrap cursor-pointer ${
              activeTab === 'candidates'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            👥 {lang === 'hi' ? `मेरी जॉब्स के आवेदक (${candidates.length})` : `Applicants for My Jobs (${candidates.length})`}
          </button>
          <button
            onClick={() => setActiveTab('post-job')}
            className={`pb-2 px-4 font-bold whitespace-nowrap cursor-pointer ${
              activeTab === 'post-job'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            ➕ {lang === 'hi' ? 'नई जॉब पोस्ट करें' : 'Post New Job'}
          </button>
        </div>

        {/* TAB 1: Job Applications */}
        {activeTab === 'applicants' && (
          <div>
            <h2 className="text-lg font-bold mb-4">
              {lang === 'hi' ? 'प्राप्त जॉब आवेदन (Received Applications)' : 'Received Job Applications'}
            </h2>
            {applications.length === 0 ? (
              <p className="text-gray-500 py-8 text-center bg-gray-50 rounded-lg border">
                {lang === 'hi' ? 'अभी तक कोई आवेदन प्राप्त नहीं हुआ है।' : 'No applications received yet.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm">
                      <th className="p-3 border">{lang === 'hi' ? 'कैंडिडेट का नाम' : 'Candidate Name'}</th>
                      <th className="p-3 border">{lang === 'hi' ? 'फ़ोन / व्हाट्सएप' : 'Phone / WhatsApp'}</th>
                      <th className="p-3 border">{lang === 'hi' ? 'किस जॉब के लिए' : 'Applied For Job'}</th>
                      <th className="p-3 border">{lang === 'hi' ? 'दिनांक' : 'Date'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b hover:bg-gray-50 text-sm">
                        <td className="p-3 border font-bold">{app.applicant_name}</td>
                        <td className="p-3 border">
                          <a href={`tel:${app.applicant_phone}`} className="text-blue-600 font-bold underline">
                            📞 {app.applicant_phone}
                          </a>
                        </td>
                        <td className="p-3 border">{app.jobs?.title || 'General'}</td>
                        <td className="p-3 border text-gray-500">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Posted Jobs Summary Box */}
            <div className="mt-8">
              <h3 className="text-md font-bold text-gray-800 mb-3">
                {lang === 'hi' ? `📌 आपकी पोस्ट की गई नौकरियां (${jobs.length})` : `📌 Your Posted Jobs (${jobs.length})`}
              </h3>
              {jobs.length === 0 ? (
                <p className="text-sm text-gray-500">
                  {lang === 'hi' ? 'आपने अभी तक कोई जॉब पोस्ट नहीं की है।' : 'You have not posted any jobs yet.'}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {jobs.map((job) => (
                    <div key={job.id} className="bg-gray-50 p-4 rounded-lg border text-sm">
                      <h4 className="font-bold text-[#0d47a1]">{job.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">📍 {job.location_city} | 💰 {job.salary} | 🏷️ {job.category}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Candidates who applied to employer's jobs with full synced profile */}
        {activeTab === 'candidates' && (
          <div>
            <h2 className="text-lg font-bold mb-4">
              {lang === 'hi' ? 'आवेदकों की योग्यता एवं रिज्यूम (Applicants Full Profiles)' : 'Applicants Full Profiles & CV'}
            </h2>
            {candidates.length === 0 ? (
              <p className="text-gray-500 py-8 text-center bg-gray-50 rounded-lg border">
                {lang === 'hi' ? 'आपकी किसी भी जॉब पर अभी तक किसी वर्कर ने आवेदन नहीं किया है।' : 'No candidates have applied to your jobs yet.'}
              </p>
            ) : (
              <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="p-3">{lang === 'hi' ? 'नाम' : 'Name'}</th>
                      <th className="p-3">{lang === 'hi' ? 'मोबाइल' : 'Mobile'}</th>
                      <th className="p-3">{lang === 'hi' ? 'जॉब शीर्षक' : 'Job Title'}</th>
                      <th className="p-3">{lang === 'hi' ? 'पद / रोल (Designation)' : 'Designation'}</th>
                      <th className="p-3">{lang === 'hi' ? 'योग्यता / डिग्री' : 'Qualification'}</th>
                      <th className="p-3">{lang === 'hi' ? 'अनुभव' : 'Experience'}</th>
                      <th className="p-3">{lang === 'hi' ? 'रिज्यूम' : 'Resume'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((c, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-bold">{c.applicant_name}</td>
                        <td className="p-3">
                          <a href={`tel:${c.applicant_phone}`} className="text-blue-600 font-bold underline">
                            📞 {c.applicant_phone}
                          </a>
                        </td>
                        <td className="p-3 font-medium text-blue-900">{c.jobs?.title || 'N/A'}</td>
                        <td className="p-3 font-semibold text-gray-700">{c.designation}</td>
                        <td className="p-3">{c.qualification}</td>
                        <td className="p-3">{c.experience}</td>
                        <td className="p-3">
                          {c.resume_url ? (
                            <a
                              href={c.resume_url}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-green-600 text-white px-2.5 py-1 rounded text-xs font-bold inline-block"
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
            )}
          </div>
        )}

        {/* TAB 3: Post Job Form */}
        {activeTab === 'post-job' && (
          <form onSubmit={handlePostJob} className="max-w-lg space-y-4">
            <h2 className="text-lg font-bold mb-2">
              {lang === 'hi' ? 'नया जॉब फॉर्म भरें (Create Job Post)' : 'Create Job Post'}
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Store Executive, Driver"
                className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location / City</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Chakan, Pune"
                className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Monthly Salary</label>
              <input
                type="text"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. ₹15,000 - ₹20,000"
                className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Driver">Driver</option>
                <option value="Delivery">Delivery</option>
                <option value="Security">Security</option>
                <option value="Quality Inspector">Quality Inspector</option>
                <option value="Electrician">Electrician</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Store Executive">Store Executive</option>
                <option value="Welder">Welder</option>
                <option value="Operator">Machine Operator</option>
                <option value="Other">Other (अन्य)</option>
              </select>
            </div>

            {category === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  अपनी कैटेगिरी लिखें (Specify Category) *
                </label>
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g. Accountant, Cook, Helper"
                  className="w-full border rounded p-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {/* Direct Call & WhatsApp Checkbox Toggle */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="allowDirectCall"
                checked={allowDirectCall}
                onChange={(e) => setAllowDirectCall(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <label htmlFor="allowDirectCall" className="text-sm font-medium text-gray-700 cursor-pointer">
                {lang === 'hi' 
                  ? 'अप्लाई करने के बाद कैंडिडेट को डायरेक्ट कॉल/व्हाट्सएप बटन दिखाएं' 
                  : 'Allow candidates to call/WhatsApp directly after applying'}
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff6f00] text-white font-bold py-2.5 rounded-lg hover:bg-orange-700 transition cursor-pointer"
            >
              {lang === 'hi' ? 'जॉब पब्लिश करें (Publish Job)' : 'Publish Job'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}