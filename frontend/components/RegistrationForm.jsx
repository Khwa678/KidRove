import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Sparkles, Bot, Phone, Mail, User, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export default function RegistrationForm({ onSuccess }) {
  const [submissionStatus, setSubmissionStatus] = useState("idle");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmissionStatus("loading");
    setServerMessage("");

    try {
      const response = await axios.post("/api/enquiry", data);
      
      if (response.data.success) {
        setSubmissionStatus("success");
        setServerMessage(response.data.message || "Thank you! Registration submitted successfully.");
        reset(); // Clear form fields
        onSuccess(); // Trigger parent callbacks to refresh registrations list
      } else {
        setSubmissionStatus("error");
        setServerMessage(response.data.message || "Form submission failed. Please try again.");
      }
    } catch (error) {
      setSubmissionStatus("error");
      const errMsg = error.response?.data?.message || error.message || "Check your network and try again.";
      setServerMessage(errMsg);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-slate-50" id="enrollment-form-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left info column: Selling points */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Begin Your Child's Tech Journey Today 🤖
            </h2>
            <p className="text-base text-slate-600 font-semibold leading-relaxed">
              Enroll now to secure a slot in our next batch. Our previous batches filled up within 48 hours! Perfect summer activity to nurture computational intelligence and curiosity.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-left">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 mt-0.5 font-black text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-950 text-sm">Secure Enrollment Slot</h4>
                  <p className="text-xs text-slate-500 font-semibold">Verify your email and contact phone to reserve a priority seat.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-left">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 text-rose-600 mt-0.5 font-black text-xs font-sans">
                  2
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-950 text-sm">Coordinator Orientation Call</h4>
                  <p className="text-xs text-slate-500 font-semibold">Our academic coach will call you to explain batch slots and curriculum setup.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-left">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 mt-0.5 font-black text-xs">
                  3
                </div>
                <div>
                   <h4 className="font-extrabold text-slate-950 text-sm">Secure Your Starter Access</h4>
                  <p className="text-xs text-slate-500 font-semibold">Get instant codes to join the student companion dashboard.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-100 rounded-3xl inline-flex items-center space-x-3 max-w-sm mx-auto lg:mx-0 shadow-sm">
              <Bot className="w-8 h-8 text-indigo-600" />
              <div>
                <span className="text-xs font-extrabold text-slate-950 block leading-tight">Need direct assistance?</span>
                <span className="text-[11px] text-slate-500 font-semibold leading-none">Reach helpline: +91 98765 43210</span>
              </div>
            </div>

          </div>

          {/* Right column: The interactive registration Form form card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-slate-100 relative">
              
              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-900 flex items-center justify-center lg:justify-start space-x-2">
                  <span>Priority Registration Form</span>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </h3>
                <p className="text-xs font-bold text-slate-400 tracking-tight mt-1">
                  Correct parameters guarantee instant slot verification.
                </p>
              </div>

              {/* Status messages container */}
              {submissionStatus === "success" && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl p-5 mb-6 flex items-start space-x-3 animate-fade-in">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-black text-sm">Success! Enquiry Registered</h5>
                    <p className="text-xs font-semibold text-emerald-800 mt-0.5">{serverMessage}</p>
                    <button
                      onClick={() => setSubmissionStatus("idle")}
                      className="mt-3 text-[11px] font-bold underline text-emerald-700 hover:text-emerald-950 block cursor-pointer"
                    >
                      Submit another enquiry
                    </button>
                  </div>
                </div>
              )}

              {submissionStatus === "error" && (
                <div className="bg-rose-50 border border-rose-300 text-rose-900 rounded-2xl p-5 mb-6 flex items-start space-x-3 animate-fade-in">
                  <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-black text-sm">Registration Blocked</h5>
                    <p className="text-xs font-semibold text-rose-800 mt-0.5">{serverMessage}</p>
                    <button
                      onClick={() => setSubmissionStatus("idle")}
                      className="mt-3 text-[11px] font-bold underline text-rose-700 hover:text-rose-950 block cursor-pointer"
                    >
                      Try filling again
                    </button>
                  </div>
                </div>
              )}

              {/* HTML Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="co_enroll_form">
                
                {/* 1. Name Field */}
                <div>
                  <label htmlFor="name-input" className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Child's Or Parent's Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="name-input"
                      type="text"
                      className={`w-full bg-slate-50 border rounded-2xl py-3 pl-10 pr-4 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all ${
                        errors.name ? "border-red-400 focus:ring-red-400" : "border-slate-200"
                      }`}
                      placeholder="e.g. Rahul Sharma"
                      {...register("name", {
                        required: "Full name is required",
                        minLength: { value: 3, message: "Name must be at least 3 characters long" },
                      })}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 font-semibold mt-1 pl-1" id="name-error">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* 2. Email Field */}
                <div>
                  <label htmlFor="email-input" className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Guardian's Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email-input"
                      type="email"
                      className={`w-full bg-slate-50 border rounded-2xl py-3 pl-10 pr-4 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all ${
                        errors.email ? "border-red-400 focus:ring-red-400" : "border-slate-200"
                      }`}
                      placeholder="e.g. parent@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 font-semibold mt-1 pl-1" id="email-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* 3. Phone Field */}
                <div>
                  <label htmlFor="phone-input" className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="phone-input"
                      type="tel"
                      className={`w-full bg-slate-50 border rounded-2xl py-3 pl-10 pr-4 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all ${
                        errors.phone ? "border-red-400 focus:ring-red-400" : "border-slate-200"
                      }`}
                      placeholder="e.g. 9876543210 (10 digits)"
                      {...register("phone", {
                        required: "Contact phone is required",
                        pattern: {
                          value: /^\+?[0-9\s\-()]{7,15}$/,
                          message: "Please enter a valid phone number (minimum 7 numbers)",
                        },
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 font-semibold mt-1 pl-1" id="phone-error">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Submit button Trigger */}
                <button
                  id="form_submit_btn"
                  type="submit"
                  disabled={submissionStatus === "loading"}
                  className={`w-full py-4 text-sm font-black rounded-full transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    submissionStatus === "loading"
                      ? "bg-slate-400 text-white cursor-not-allowed"
                      : "bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-[0_4px_0_0_#d97706] active:translate-y-1 active:shadow-none"
                  }`}
                >
                  {submissionStatus === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <span>Register For Summer Camp Now!</span>
                  )}
                </button>

                {/* Secure Trust Info */}
                <div className="text-center">
                  <p className="text-[11px] text-slate-400 font-semibold">
                    🔒 We respect parent privacy & never distribute security contacts.
                  </p>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
