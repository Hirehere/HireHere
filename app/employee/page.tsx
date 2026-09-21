"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Translation Dictionary
const TRANSLATIONS = {
  hi: {
    title: "काम पाने के लिए",
    titleHighlight: "प्रोफाइल बनाएं",
    subtitle: "ना रिज्यूमे की बाध्यता, ना फीस — 1 मिनट में डायरेक्ट काम पाओ!",
    freeReg: "फ्री रजिस्ट्रेशन",
    goHome: "← होम पर जाएं",
    fullName: "पूरा नाम",
    namePlaceholder: "उदा. Anil Kumar",
    mobileNumber: "मोबाइल नंबर",
    mobilePlaceholder: "10 अंकों का नंबर",
    city: "आपका शहर",
    jobCategory: "किस तरह का काम चाहिए?",
    designation: "पद",
    qualification: "शैक्षणिक योग्यता",
    experience: "अनुभव",
    noticePeriod: "नोटिस पीरियड",
    expectedSalary: "अपेक्षित वेतन (प्रति माह)",
    salaryPlaceholder: "उदा. ₹15,000 - ₹20,000",
    attachResume: "रिज्यूमे अपलोड (ऐच्छिक)",
    submitBtn: "रजिस्टर करें",
    submittingBtn: "सबमिट हो रहा है...",
    alreadyRegisteredErr: "यह मोबाइल नंबर पहले से ही रजिस्टर्ड है। कृपया दूसरा मोबाइल नंबर दर्ज करें!",
    successMsg: "प्रोफाइल सफलतापूर्वक बन गई है!",
    qualifications: [
      { value: "Below 10th", label: "10th से कम" },
      { value: "10th Pass", label: "10th पास" },
      { value: "12th Pass", label: "12th पास" },
      { value: "ITI / Diploma", label: "ITI / डिप्लोमा" },
      { value: "Graduate", label: "ग्रेजुएट" },
      { value: "Post Graduate", label: "पोस्ट ग्रेजुएट" },
    ],
    experiences: [
      { value: "Fresher", label: "फ्रेशर (कोई अनुभव नहीं)" },
      { value: "0 - 1 Year", label: "0 - 1 साल" },
      { value: "1 - 3 Years", label: "1 - 3 साल" },
      { value: "3 - 5 Years", label: "3 - 5 साल" },
      { value: "5+ Years", label: "5+ साल" },
    ],
    noticePeriods: [
      { value: "Immediate", label: "तुरंत ज्वाइन कर सकते हैं (Immediate)" },
      { value: "15 Days", label: "15 दिन" },
      { value: "1 Month", label: "1 महीना" },
    ],
    cities: [
      "Pune", "Sanand", "Gurgaon / NCR", "Bengaluru", "Chennai", 
      "Aurangabad", "Hyderabad", "Kolkata", "Nagpur", "Mehsana", "अन्य"
    ],
    categories: {
      "ड्राइवर": [
        "कार ड्राइवर",
        "ट्रक ड्राइवर",
        "डिलीवरी ड्राइवर",
        "बस / वैन ड्राइवर",
        "पर्सनल ड्राइवर",
      ],
      "डिलीवरी": [
        "डिलीवरी बॉय",
        "फील्ड एग्जीक्यूटिव",
        "राइडर",
      ],
      "फैक्ट्री": [
        "फैक्ट्री / क्वालिटी इंस्पेक्टर",
        "मशीन ऑपरेटर",
        "प्रोडक्शन हेल्पर",
        "पैकर / सॉर्टर",
        "असेंबली वर्कर",
      ],
      "ऑफिस": [
        "ऑफिस बॉय / चपरासी",
        "डाटा एंट्री ऑपरेटर",
        "रिसेप्शनिस्ट",
        "अकाउंटेंट",
        "टेलीकॉलर / बीपीओ",
      ],
      "सिक्योरिटी": [
        "सिक्योरिटी गार्ड",
        "सिक्योरिटी सुपरवाइजर",
        "सीसीटीवी ऑपरेटर",
      ],
      "होटल एवं रेस्टोरेंट": [
        "कुक / शेफ",
        "वेटर / स्टीवर्ड",
        "किचन हेल्पर",
        "हाउसकीपिंग",
      ],
      "अन्य": [
        "जनरल हेल्पर",
        "तकनीशियन / मेकैनिक",
        "अन्य",
      ],
    }
  },
  en: {
    title: "Create Profile to",
    titleHighlight: "Get Hired",
    subtitle: "No mandatory resume, zero fee — get direct job opportunities in 1 minute!",
    freeReg: "Free Registration",
    goHome: "← Go to Home",
    fullName: "Full Name",
    namePlaceholder: "e.g. Anil Kumar",
    mobileNumber: "Mobile Number",
    mobilePlaceholder: "10 digit number",
    city: "Your City",
    jobCategory: "Job Category",
    designation: "Designation",
    qualification: "Qualification",
    experience: "Experience",
    noticePeriod: "Notice Period",
    expectedSalary: "Expected Salary (Per Month)",
    salaryPlaceholder: "e.g. ₹15,000 - ₹20,000",
    attachResume: "Attach Resume (Optional)",
    submitBtn: "Register Now",
    submittingBtn: "Submitting...",
    alreadyRegisteredErr: "This mobile number is already registered. Please register with another number!",
    successMsg: "Profile created successfully!",
    qualifications: [
      { value: "Below 10th", label: "Below 10th" },
      { value: "10th Pass", label: "10th Pass" },
      { value: "12th Pass", label: "12th Pass" },
      { value: "ITI / Diploma", label: "ITI / Diploma" },
      { value: "Graduate", label: "Graduate" },
      { value: "Post Graduate", label: "Post Graduate" },
    ],
    experiences: [
      { value: "Fresher", label: "Fresher (No Experience)" },
      { value: "0 - 1 Year", label: "0 - 1 Year" },
      { value: "1 - 3 Years", label: "1 - 3 Years" },
      { value: "3 - 5 Years", label: "3 - 5 Years" },
      { value: "5+ Years", label: "5+ Years" },
    ],
    noticePeriods: [
      { value: "Immediate", label: "Immediate Joining" },
      { value: "15 Days", label: "15 Days" },
      { value: "1 Month", label: "1 Month" },
    ],
    cities: [
      "Pune", "Sanand", "Gurgaon / NCR", "Bengaluru", "Chennai", 
      "Aurangabad", "Hyderabad", "Kolkata", "Nagpur", "Mehsana", "Other"
    ],
    categories: {
      "Driver": [
        "Car Driver",
        "Truck Driver",
        "Delivery Driver",
        "Bus / Van Driver",
        "Personal Driver",
      ],
      "Delivery": [
        "Delivery Boy",
        "Field Executive",
        "Rider",
      ],
      "Factory": [
        "Factory / Quality Inspector",
        "Machine Operator",
        "Production Helper",
        "Packer / Sorter",
        "Assembly Worker",
      ],
      "Office & Admin": [
        "Office Boy / Peon",
        "Data Entry Operator",
        "Receptionist",
        "Accountant",
        "Telecaller / BPO",
      ],
      "Security": [
        "Security Guard",
        "Security Supervisor",
        "CCTV Operator",
      ],
      "Hotel & Restaurant": [
        "Cook / Chef",
        "Waiter / Steward",
        "Kitchen Helper",
        "Housekeeping",
      ],
      "Other": [
        "General Helper",
        "Technician / Mechanic",
        "Other",
      ],
    }
  }
};

export default function EmployeeRegister() {
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [loading, setLoading] = useState(false);

  // Read saved language preference from front page
  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as "hi" | "en";
    if (savedLang === "en" || savedLang === "hi") {
      setLang(savedLang);
    }
  }, []);

  const t = TRANSLATIONS[lang];
  const defaultCategory = Object.keys(t.categories)[0];

  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: t.cities[0],
    job_category: defaultCategory,
    designation: t.categories[defaultCategory][0],
    qualification: t.qualifications[1].value,
    experience: t.experiences[1].value,
    notice_period: t.noticePeriods[0].value,
    expected_salary: "",
  });

  // Switch language dynamically if changed
  const toggleLanguage = (selectedLang: "hi" | "en") => {
    setLang(selectedLang);
    localStorage.setItem("app_lang", selectedLang);
    const newTranslations = TRANSLATIONS[selectedLang];
    const newCat = Object.keys(newTranslations.categories)[0];
    setSelectedCategory(newCat);
    setFormData((prev) => ({
      ...prev,
      city: newTranslations.cities[0],
      job_category: newCat,
      designation: newTranslations.categories[newCat][0],
    }));
  };

  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const availableDesignations = t.categories[category] || [];
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

      // Check Mobile Duplication
      const { data: existingCandidate } = await supabase
        .from("candidates")
        .select("id")
        .eq("phone", formattedPhone)
        .maybeSingle();

      if (existingCandidate) {
        alert(t.alreadyRegisteredErr);
        setLoading(false);
        return;
      }

      // Resume upload
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

      // Insert record
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

      alert(t.successMsg);
      
      // Reset form
      const resetCat = Object.keys(t.categories)[0];
      setSelectedCategory(resetCat);
      setFormData({
        name: "",
        phone: "",
        city: t.cities[0],
        job_category: resetCat,
        designation: t.categories[resetCat][0],
        qualification: t.qualifications[1].value,
        experience: t.experiences[1].value,
        notice_period: t.noticePeriods[0].value,
        expected_salary: "",
      });
      setResumeFile(null);
    } catch (err: any) {
      const errStr = JSON.stringify(err) + (err.message || "");
      if (
        errStr.includes("23505") ||
        errStr.includes("candidates_mobile_number_key") ||
        errStr.includes("unique constraint") ||
        errStr.includes("already exists")
      ) {
        alert(t.alreadyRegisteredErr);
      } else {
        alert("Error: " + (err.message || "An error occurred."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-gray-800">
      {/* Navigation */}
      <nav className="border-b border-blue-700/50 bg-blue-950/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-white tracking-wide">
          Hire<span className="text-orange-500">Here</span>
        </Link>
        <div className="flex items-center gap-3">
          {/* Language Selector Switcher */}
          <button
            onClick={() => toggleLanguage(lang === "hi" ? "en" : "hi")}
            className="text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition"
          >
            🌐 {lang === "hi" ? "English" : "हिंदी"}
          </button>

          <Link 
            href="/" 
            className="text-sm font-semibold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
          >
            {t.goHome}
          </Link>
        </div>
      </nav>

      {/* Main Form Container */}
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          <div className="text-center mb-8">
            <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              {t.freeReg}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.title} <span className="text-blue-600">{t.titleHighlight}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t.fullName} *
              </label>
              <input
                type="text"
                required
                placeholder={t.namePlaceholder}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-800"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t.mobileNumber} *
              </label>
              <input
                type="tel"
                required
                placeholder={t.mobilePlaceholder}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-800"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t.city} *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                {t.cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t.jobCategory} *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {Object.keys(t.categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t.designation} *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              >
                {t.categories[selectedCategory]?.map((desig) => (
                  <option key={desig} value={desig}>{desig}</option>
                ))}
              </select>
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t.qualification} *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              >
                {t.qualifications.map((q) => (
                  <option key={q.value} value={q.value}>{q.label}</option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t.experience} *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              >
                {t.experiences.map((exp) => (
                  <option key={exp.value} value={exp.value}>{exp.label}</option>
                ))}
              </select>
            </div>

            {/* Notice Period */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t.noticePeriod} *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-800"
                value={formData.notice_period}
                onChange={(e) => setFormData({ ...formData, notice_period: e.target.value })}
              >
                {t.noticePeriods.map((np) => (
                  <option key={np.value} value={np.value}>{np.label}</option>
                ))}
              </select>
            </div>

            {/* Expected Salary */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t.expectedSalary} *
              </label>
              <input
                type="text"
                required
                placeholder={t.salaryPlaceholder}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-800"
                value={formData.expected_salary}
                onChange={(e) => setFormData({ ...formData, expected_salary: e.target.value })}
              />
            </div>

            {/* Resume Upload */}
            <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t.attachResume}
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
              {loading ? t.submittingBtn : t.submitBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}