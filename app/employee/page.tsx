"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// City Options
const CITIES = [
  "Pune",
  "Mumbai",
  "Delhi / NCR",
  "Bengaluru",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Nagpur",
  "Nashik",
  "Aurangabad",
  "Other / अन्य",
];

// Category & Dynamic Designation Mapping
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

  // Category change hone par designations update karne ke liye handler
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
      let resumeUrl = "";

      // 1. Upload Resume to Supabase Storage if file selected
      if (resumeFile) {
        const fileExt = resumeFile.name.split(".").pop();
        const fileName = `${Date.now()}_${formData.phone}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("resumes")
          .getPublicUrl(fileName);

        resumeUrl = publicUrlData.publicUrl;
      }

      // 2. Insert Candidate Data into DB
      const { error } = await supabase.from("candidates").insert([
        {
          full_name: formData.name,
          phone: formData.phone,
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
      // Form Reset
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
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">काम पाने के लिए प्रोफाइल बनाएं</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium">पूरा नाम (Full Name) *</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded mt-1"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium">मोबाइल नंबर (Mobile Number) *</label>
          <input
            type="tel"
            required
            className="w-full border p-2 rounded mt-1"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        {/* City Dropdown */}
        <div>
          <label className="block text-sm font-medium">आपका शहर (City) *</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown (Pehle Category Choose Hogi) */}
        <div>
          <label className="block text-sm font-medium">किस तरह का काम चाहिए? (Category) *</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {Object.keys(CATEGORY_DESIGNATION_MAP).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Linked Designation Dropdown */}
        <div>
          <label className="block text-sm font-medium">पद / Designation *</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
          >
            {CATEGORY_DESIGNATION_MAP[selectedCategory]?.map((desig) => (
              <option key={desig} value={desig}>
                {desig}
              </option>
            ))}
          </select>
        </div>

        {/* Qualification Dropdown */}
        <div>
          <label className="block text-sm font-medium">शैक्षणिक योग्यता (Qualification) *</label>
          <select
            className="w-full border p-2 rounded mt-1"
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

        {/* Experience Dropdown */}
        <div>
          <label className="block text-sm font-medium">अनुभव (Experience) *</label>
          <select
            className="w-full border p-2 rounded mt-1"
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

        {/* Notice Period Dropdown */}
        <div>
          <label className="block text-sm font-medium">नोटिस पीरियड (Notice Period) *</label>
          <select
            className="w-full border p-2 rounded mt-1"
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
          <label className="block text-sm font-medium">अपेक्षित वेतन (Expected Salary per Month) *</label>
          <input
            type="text"
            placeholder="e.g. ₹15,000 - ₹20,000"
            required
            className="w-full border p-2 rounded mt-1"
            value={formData.expected_salary}
            onChange={(e) => setFormData({ ...formData, expected_salary: e.target.value })}
          />
        </div>

        {/* Resume File Upload */}
        <div>
          <label className="block text-sm font-medium">रिज्यूमे अपलोड (Attach Resume - PDF/Doc)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="w-full border p-2 rounded mt-1 text-sm"
            onChange={(e) => e.target.files && setResumeFile(e.target.files[0])}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition"
        >
          {loading ? "सबमिट हो रहा है..." : "रजिस्टर करें"}
        </button>
      </form>
    </div>
  );
}