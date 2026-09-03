import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock } from "lucide-react";
import TranslatedText from "./TranslatedText";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const DEFAULT_ADMIN_EMAIL = "psrnewschannel@gmail.com";
  const DEFAULT_ADMIN_PASS = "Admin@244001";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const inputEmail = email.trim().toLowerCase();
    const inputPass = password.trim();

    try {
      // 1. Check direct admin credentials
      if (
        inputEmail === DEFAULT_ADMIN_EMAIL &&
        inputPass === DEFAULT_ADMIN_PASS
      ) {
        localStorage.setItem("pmp_admin_logged_in", "true");
        localStorage.setItem("pmp_admin_email", DEFAULT_ADMIN_EMAIL);
        navigate("/admin/dashboard");
        return;
      }

      // 2. Try Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: inputEmail,
          password: inputPass,
        },
      );

      if (!authError && data?.session) {
        localStorage.setItem("pmp_admin_logged_in", "true");
        localStorage.setItem("pmp_admin_email", inputEmail);
        navigate("/admin/dashboard");
      } else {
        setError(
          "Invalid Admin Email or Password. Please check your credentials.",
        );
      }
    } catch (err) {
      setError(
        err.message || "Login failed. Please check your internet connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="shield-icon">
            <ShieldCheck size={32} />
          </div>
          <h2>People Media Point</h2>
          <p className="subtitle">Admin Management Portal</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Admin ID (Email)</label>
            <input
              type="email"
              placeholder="admin@peoplemediapoint.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            <Lock size={16} />
            <span>
              {loading ? "Authenticating..." : "Login to Admin Dashboard"}
            </span>
          </button>
        </form>

        <div className="login-footer">
          <p className="security-notice">
            🔒 Restricted access for authorized People Media Point
            administrators only.
          </p>
        </div>
      </div>

      <style jsx>{`
        .admin-login-wrapper {
          min-height: 75vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          padding: 2.5rem 1rem;
        }

        .login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          border-top: 5px solid #d32f2f;
        }

        .login-header {
          text-align: center;
          margin-bottom: 1.8rem;
        }

        .shield-icon {
          width: 58px;
          height: 58px;
          background: #fef2f2;
          color: #d32f2f;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.8rem;
        }

        .login-header h2 {
          color: #0a192f;
          font-size: 1.45rem;
          font-weight: 800;
        }

        .subtitle {
          color: #64748b;
          font-size: 0.88rem;
          font-weight: 600;
          margin-top: 2px;
        }

        .form-group {
          margin-bottom: 1.3rem;
        }

        label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.4rem;
        }

        input {
          width: 100%;
          padding: 0.8rem 0.95rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }

        input:focus {
          border-color: #d32f2f;
        }

        .submit-btn {
          width: 100%;
          padding: 0.85rem;
          background: #0a192f;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
        }

        .submit-btn:hover {
          background: #d32f2f;
        }

        .error-alert {
          background: #fef2f2;
          color: #991b1b;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.85rem;
          margin-bottom: 1.2rem;
          border: 1px solid #fecaca;
          text-align: center;
          font-weight: 600;
        }

        .login-footer {
          margin-top: 1.8rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }

        .security-notice {
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
