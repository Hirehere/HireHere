"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CITIES = [
  "Pune",
  "Sanand",
  "Gurgaon / NCR",
  "Bengaluru",
  "Chennai",
  "Aurangabad",
  "Hydrabad",
  "Kolkata",
  "Nagpur",
  "Mehsana",
  "Other / अन्य",
];

const CATEGORY_DESIGNATION_MAP: Record<string, string[]> = {
  "Driver / ड्राइवर": [
    "Car Driver (कार ड्राइवर)",
    "Truck Driver (ट्रक ड्राइवर)",
    "Delivery Driver (डिलीवरी ड्राइवर)",
    "Bus / Van Driver (बस / वैन ड्राइवर)",
    "Personal Driver (पर्सनल ड्राइवर)",
  ],
  "Delivery / डिलीवरी": [
    "Delivery Boy (डिलीवरी बॉय)",
    "Field Executive (फील्ड एग्जीक्यूटिव)",
    "Rider (राइडर)",
  ],
  "Factory / फैक्ट्री": [
    "Factory / Quality Inspector",
    "Machine Operator (मशीन ऑपरेटर)",
    "Production Helper (प्रोडक्शन हेल्पर)",
    "Packer / Sorter (पैकर)",
    "Assembly Worker (असेंबली वर्कर)",
  ],
  "Office & Admin / ऑफिस": [
    "Office Boy / Peon (ऑफिस बॉय)",
    "Data Entry Operator (डाटा एंट्री ऑपरेटर)",
    "Receptionist (रिसेप्शनिस्ट)",
    "Accountant (अकाउंटेंट)",
    "Telecaller / BPO (टेलीकॉलर)",
  ],
  "Security / सिक्योरिटी": [
    "Security Guard (सिक्योरिटी गार्ड)",
    "Security Supervisor (सिक्योरिटी सुपरवाइजर)",
    "CCTV Operator (सीसीटीवी ऑपरेटर)",
  ],
  "Hotel & Restaurant / होटल": [
    "Cook / Chef (कुक / शेफ)",
    "Waiter / Steward (वेटर)",
    "Kitchen Helper (किचन हेल्पर)",
    "Housekeeping (हाउसकीपिंग)",
  ],
  "Other / अन्य": [
    "General Helper (हेल्पर)",
    "Technician / Mechanic (तकनीशियन)",
    "Other (अन्य)",
  ],
};

export default function EmployeeRegister() {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Driver / ड्राइवर");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: CITIES[0],
    job_category: "Driver / ड्राइवर",
    designation: CATEGORY_DESIGNATION_MAP["Driver / ड्राइवर"][0],
    qualification: "10th Pass",
    experience: "0 - 1 साल",
    notice_period: "Immediate",
    expected_salary: "",
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const availableDesignations = CATEGORY_DESIGNATION_MAP[category] || [];
    setFormData({
      ...formData,
      job_category: category,
      designation: availableDesignations[0] || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedPhone = formData.phone.trim();

      // 1. Explicit Check: Mobile number already exists in Database?
      const { data: existingCandidate } = await supabase
        .from("candidates")
        .select("id")
        .eq("phone", formattedPhone)
        .maybeSingle();

      if (existingCandidate) {
        alert("यह मोबाइल नंबर पहले से ही रजिस्टर्ड है। कृपया दूसरा मोबाइल नंबर दर्ज करें! (This mobile number is already registered. Please use another number.)");
        setLoading(false);
        return;
      }

      // 2. Upload Resume if selected
      let resumeUrl = "";
      if (resumeFile) {
        const fileExt = resumeFile.name.split(".").pop();
        const fileName = `${Date.now()}_${formattedPhone}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("resumes")
          .getPublicUrl(fileName);

        resumeUrl = publicUrlData.publicUrl;
      }

      // 3. Insert Candidate Data
      const { error } = await supabase.from("candidates").insert([
        {
          full_name: formData.name,
          phone: formattedPhone,
          city: formData.city,
          job_category: formData.job_category,
          designation: formData.designation,
          qualification: formData.qualification,
          experience: formData.experience,
          notice_period: formData.notice_period,
          expected_salary: formData.expected_salary,
          resume_url: resumeUrl,
        },
      ]);

      if (error) throw error;

      alert("प्रोफाइल सफलतापूर्वक बन गई है!");
      
      // Reset Form
      const defaultCategory = "Driver / ड्राइवर";
      setSelectedCategory(defaultCategory);
      setFormData({
        name: "",
        phone: "",
        city: CITIES[0],
        job_category: defaultCategory,
        designation: CATEGORY_DESIGNATION_MAP[defaultCategory][0],
        qualification: "10th Pass",
        experience: "0 - 1 साल",
        notice_period: "Immediate",
        expected_salary: "",
      });
      setResumeFile(null);
    } catch (err: any) {
      const errStr = JSON.stringify(err) + (err.message || "");
      
      // Fallback check for duplicate constraint
      if (
        errStr.includes("23505") ||
        errStr.includes("candidates_mobile_number_key") ||
        errStr.includes("unique constraint") ||
        errStr.includes("already exists")
      ) {
        alert("यह मोबाइल नंबर पहले से ही रजिस्टर्ड है। कृपया दूसरा मोबाइल नंबर दर्ज करें!");
      } else {
        alert("Error: " + (err.message || "कुछ गड़बड़ हुई, कृपया पुन: प्रयास करें।"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-gray-800">
      {/* Header / Navigation */}
      <nav className="border-b border-blue-700/50 bg-blue-950/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-white tracking-wide">
          Hire<span className="text-orange-500">Here</span>
        </Link>
        <Link 
          href="/" 
          className="text-sm font-semibold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
        >
          ← Home Par Jayein
        </Link>
      </nav>

      {/* Main Container */}
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          <div className="text-center mb-8">
            <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              Free Registration
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              काम पाने के लिए <span className="text-blue-600">प्रोफाइल बनाएं</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              ना रिज्यूमे की बाध्यता, ना फीस — 1 मिनट में डायरेक्ट काम पाओ!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                पूरा नाम (Full Name) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. Anil Kumar"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-800"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                मोबाइल नंबर (Mobile Number) *
              </label>
              <input
                type="tel"
                required
                placeholder="10 अंकों का नंबर"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-800"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                आपका शहर (City) *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                किस तरह का काम चाहिए? (Category) *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {Object.keys(CATEGORY_DESIGNATION_MAP).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                पद / Designation *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              >
                {CATEGORY_DESIGNATION_MAP[selectedCategory]?.map((desig) => (
                  <option key={desig} value={desig}>{desig}</option>
                ))}
              </select>
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                शैक्षणिक योग्यता (Qualification) *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              >
                <option value="10th से कम">10th से कम</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="ITI / Diploma">ITI / Diploma</option>
                <option value="Graduate">Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                अनुभव (Experience) *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              >
                <option value="Fresher">Fresher (कोई अनुभव नहीं)</option>
                <option value="0 - 1 साल">0 - 1 साल</option>
                <option value="1 - 3 साल">1 - 3 साल</option>
                <option value="3 - 5 साल">3 - 5 साल</option>
                <option value="5+ साल">5+ साल</option>
              </select>
            </div>

            {/* Notice Period */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                नोटिस पीरियड (Notice Period) *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                value={formData.notice_period}
                onChange={(e) => setFormData({ ...formData, notice_period: e.target.value })}
              >
                <option value="Immediate">तुरंत ज्वाइन कर सकते हैं (Immediate)</option>
                <option value="15 Days">15 दिन</option>
                <option value="1 Month">1 महीना</option>
              </select>
            </div>

            {/* Expected Salary */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                अपेक्षित वेतन (Expected Salary per Month) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. ₹15,000 - ₹20,000"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-800"
                value={formData.expected_salary}
                onChange={(e) => setFormData({ ...formData, expected_salary: e.target.value })}
              />
            </div>

            {/* Resume Upload */}
            <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                रिज्यूमे अपलोड (Attach Resume - Optional)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                onChange={(e) => e.target.files && setResumeFile(e.target.files[0])}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/30 transition transform active:scale-98 disabled:opacity-50"
            >
              {loading ? "सबमिट हो रहा है..." : "रजिस्टर करें"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}