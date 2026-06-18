import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Users, RefreshCw, Layers, Database, CalendarDays, Check, Cpu, Trash2, ShieldAlert } from "lucide-react";

export default function EnquiryList({ user, refreshKey, onRefreshNeeded }) {
  const [enquiries, setEnquiries] = useState([]);
  const [backendStatus, setBackendStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchEnquiriesAndStatus = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [enqsRes, statusRes] = await Promise.all([
        axios.get("/api/enquiries"),
        axios.get("/api/status").catch(() => null),
      ]);

      if (enqsRes.data.success) {
        setEnquiries(enqsRes.data.data);
      }
      if (statusRes && statusRes.data) {
        setBackendStatus(statusRes.data);
      }
    } catch (err) {
      console.error("Error fetching admin table enquiries:", err);
      setError("Unable to sync register tables. Check connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiriesAndStatus();
  }, [fetchEnquiriesAndStatus, refreshKey]);

  // Private/Privacy mask helper (only applied to non-administrators)
  const isAdmin = user && user.role === "admin";

  const maskEmail = (email) => {
    if (isAdmin) return email; // admins see actual data
    if (!email) return "";
    const parts = email.split("@");
    if (parts.length < 2) return email;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return `**@${domain}`;
    return `${name.substring(0, 2)}***@${domain}`;
  };

  const maskPhone = (phone) => {
    if (isAdmin) return phone; // admins see actual data
    if (!phone) return "";
    const clean = phone.replace(/\s/g, "");
    if (clean.length < 5) return "****";
    return `${clean.substring(0, 3)}****${clean.substring(clean.length - 3)}`;
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    if (!confirm("Are you sure you want to delete this enrollment record? This will modify the backend JSON cache/MongoDB permanently.")) return;
    
    setDeleteLoading(enquiryId);
    try {
      const res = await fetch("/api/auth/delete-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enquiryId })
      });
      const data = await res.json();
      if (data.success) {
        fetchEnquiriesAndStatus();
        if (onRefreshNeeded) onRefreshNeeded();
      } else {
        alert("Deletion failed: " + data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <section className="py-12 bg-white" id="live_registrations_dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-50 rounded-[2rem] p-6 sm:p-8 border border-slate-100">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/50">
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-indigo-100 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest mb-2 font-mono">
                <Cpu className="w-3 h-3 text-indigo-600" />
                <span>{isAdmin ? "Admin Root Module" : "Public Registrar Monitor"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-1.5">
                <span>LIVE Camp Registry</span>
                <span className="text-[10px] bg-emerald-500 text-white rounded px-2 py-0.5 animate-pulse font-extrabold uppercase font-mono">Live Sync</span>
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {isAdmin 
                  ? "Logged in as Academic Administrator. You are granted privileges to delete, manage, or edit customer leads."
                  : "This secure monitor outlines incoming student seats registered across our Express + Node.js backend."}
              </p>
            </div>

            <button
              id="admin_refresh_btn"
              onClick={fetchEnquiriesAndStatus}
              disabled={loading}
              className="flex items-center justify-center space-x-1 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-600" : ""}`} />
              <span>Refresh Registry</span>
            </button>
          </div>

          {/* Database System Meta statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-200/50">
            <div className="bg-white rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Registrants</span>
              <span className="text-2xl font-black text-indigo-600">{enquiries.length} Families</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Storage Mode</span>
              <span className="text-sm font-black text-slate-800 flex items-center space-x-1 mt-1.5">
                <Database className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>{backendStatus?.database || "Local JSON Backup"}</span>
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">System API</span>
              <span className="text-sm font-black text-emerald-600 flex items-center space-x-1 mt-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Active 200 OK</span>
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">Camp Batches</span>
              <span className="text-xs font-black text-indigo-700 flex items-center space-x-1 mt-1.5 uppercase">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Filling Fast</span>
              </span>
            </div>
          </div>

          {/* Table display list */}
          <div className="mt-6">
            {error && (
              <p className="text-xs text-red-500 text-center font-bold bg-red-50 p-4 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            {enquiries.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-pulse" />
                <p className="text-sm font-bold text-slate-700">No active registrations yet.</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Fill in the registration form above to see your enquiry instantly render here!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                      <th className="p-4">Student/Parent</th>
                      <th className="p-4">E-mail {isAdmin ? "[UNMASKED]" : "(Secured)"}</th>
                      <th className="p-4">Phone {isAdmin ? "[UNMASKED]" : "(Secured)"}</th>
                      <th className="p-4 text-right">Registered</th>
                      {isAdmin && <th className="p-4 text-center">Admin Controls</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
                    {enquiries.slice(0, 10).map((enq, index) => (
                      <tr key={enq.id || index} className="hover:bg-slate-50">
                        <td className="p-4 font-black text-slate-900 flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          <span>{enq.name}</span>
                        </td>
                        <td className="p-4 font-mono text-slate-500">{maskEmail(enq.email)}</td>
                        <td className="p-4 font-mono text-slate-500">{maskPhone(enq.phone)}</td>
                        <td className="p-4 text-slate-400 text-right font-mono">
                          {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }) : "Just now"}
                        </td>
                        {isAdmin && (
                          <td className="p-4 text-center">
                            <button
                              onClick={() => enq.id && handleDeleteEnquiry(enq.id)}
                              disabled={deleteLoading === enq.id}
                              className="p-1 px-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100 rounded-lg text-xs font-bold font-mono transition flex items-center space-x-1 mx-auto cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{deleteLoading === enq.id ? "..." : "Delete"}</span>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {enquiries.length > 10 && (
              <p className="text-center text-[10px] text-slate-400 font-extrabold mt-4 tracking-wider uppercase">
                + Showing 10 most recent entries. Fully managed in durable storage.
              </p>
            )}
            
          </div>

        </div>

      </div>
    </section>
  );
}
