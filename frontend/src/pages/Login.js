import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      // ✅ Plain password — backend BCrypt handles matching
      const res = await loginUser({ email: form.email, password: form.password });

    const { token, role, name } = res.data;

localStorage.setItem("login",    "true");
localStorage.setItem("token",    token);
localStorage.setItem("role",     role?.toUpperCase() || "USER");
localStorage.setItem("username", name || form.email);
localStorage.setItem("email",    form.email);  // ✅ store email for card lookup

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-sub">Sign in to your PayPanda account</p>

        {error && <div className="pp-alert pp-alert-error">⚠ {error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="pp-label">Email</label>
            <input
              name="email" value={form.email}
              onChange={handleChange}
              className="pp-input" placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label className="pp-label">Password</label>
            <input
              type="password" name="password" value={form.password}
              onChange={handleChange}
              className="pp-input" placeholder="••••••••"
              required
            />
          </div>
          <div style={{marginBottom:"20px",textAlign:"right"}}>
            <a href="#" style={{fontSize:"13px",color:"var(--blue-light)",textDecoration:"none"}}>
              Forgot password?
            </a>
          </div>
          <button className="pp-btn pp-btn-primary pp-btn-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="divider">or</div>

        <p style={{textAlign:"center",fontSize:"14px",color:"var(--muted)"}}>
          Don't have an account?{" "}
          <Link to="/register" style={{color:"var(--blue-light)",textDecoration:"none",fontWeight:600}}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;