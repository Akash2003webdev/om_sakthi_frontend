import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAdmin } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { X, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminLoginModal({ onClose }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // login() is now async — calls backend /api/auth/login
    const ok = await login(password);
    if (ok) {
      onClose();
      navigate("/admin");
    } else {
      setError("தவறான கடவுச்சொல். சரியான admin password உள்ளிடவும்.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative w-full max-w-sm rounded-2xl overflow-hidden ${shake ? "animate-shake" : ""}`}
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Gold top bar */}
        <div style={{ height: 4, background: "linear-gradient(90deg, #c98810, #f3d98a, #c98810)" }} />

        {/* Header */}
        <div className="p-6 pb-0 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 44, height: 44,
                background: "linear-gradient(135deg, rgba(201,136,16,0.2), rgba(243,217,138,0.1))",
                border: "1px solid rgba(201,136,16,0.3)",
              }}
            >
              <ShieldCheck size={22} style={{ color: "var(--gold-main)" }} />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg" style={{ color: "var(--text-main)" }}>
                Admin Access
              </h2>
              <p className="text-xs" style={{ color: "var(--text4)" }}>Om Sakthi Printers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--text4)" }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-5">
          <div className="mb-5">
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text3)" }}>
              <Lock size={12} className="inline mr-1.5" />
              Admin Password
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="form-input w-full pr-10"
                style={{
                  padding: "0.75rem 2.5rem 0.75rem 1rem",
                  fontSize: "0.9rem",
                  borderColor: error ? "rgba(239,68,68,0.5)" : "var(--border)",
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text4)" }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="mt-2 text-xs" style={{ color: "#ef4444" }}>{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="btn btn-primary w-full justify-center"
            style={{ opacity: loading || !password ? 0.6 : 1 }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} />
                Login to Admin
              </span>
            )}
          </button>
        </form>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
          }
          .animate-shake { animation: shake 0.5s ease-in-out; }
        `}</style>
      </div>
    </div>
  );
}
