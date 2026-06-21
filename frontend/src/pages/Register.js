import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name:"", email:"", password:"", confirm:"", pancard:"", address:"" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) { setForm({...form,[e.target.name]:e.target.value}); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");

    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }

    setLoading(true);
    try {
      //  Plain password — backend BCrypt handles encoding
      const payload = {
        name:     form.name,
        email:    form.email,
        password: form.password,
        pancard:  form.pancard,
        address:  form.address
      };

      await registerUser(payload);  //  Live API call to /auth/signup

      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-sub">Join PayPanda to manage payments</p>

        {error   && <div className="pp-alert pp-alert-error">⚠ {error}</div>}
        {success && <div className="pp-alert pp-alert-success">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="pp-label">FULL NAME</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="pp-input" placeholder="Enter Name" required />
          </div>

          <div className="form-group">
            <label className="pp-label">EMAIL</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="pp-input" placeholder="abc@gmail.com" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="pp-label">PASSWORD</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                className="pp-input" placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label className="pp-label">CONFIRM</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
                className="pp-input" placeholder="••••••••" required />
            </div>
          </div>

          <div className="form-group">
            <label className="pp-label">PAN CARD NO.</label>
            <input name="pancard" value={form.pancard} onChange={handleChange}
              className="pp-input" placeholder="ABCDE1234F"
              maxLength={10} style={{textTransform:"uppercase"}} required />
          </div>

          <div className="form-group">
            <label className="pp-label">ADDRESS</label>
            <input name="address" value={form.address} onChange={handleChange}
              className="pp-input" placeholder="Enter Address" required />
          </div>

          <button className="pp-btn pp-btn-primary pp-btn-full" disabled={loading} style={{marginTop:"8px"}}>
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div className="divider">or</div>
        <p style={{textAlign:"center",fontSize:"14px",color:"var(--muted)"}}>
          Already have an account?{" "}
          <Link to="/login" style={{color:"var(--blue-light)",textDecoration:"none",fontWeight:600}}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;