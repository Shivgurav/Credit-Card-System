import { useState } from "react";
import { applyCard } from "../services/api";

const INITIAL = { name:"", dateOfBirth:"", panNumber:"", email:"", mobileNumber:"", address:"", cardType:"VISA", occupation:"", annualSalary:"", itReturnFiled:"" };

function ApplyCard() {
  const [form, setForm]     = useState(INITIAL);
  const [msg,  setMsg]      = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) { setForm({...form,[e.target.name]:e.target.value}); }

  async function handleSubmit(e) {
    e.preventDefault(); setMsg(null); setLoading(true);
    try {
      const payload = {
        name:          form.name,
        dateOfBirth:   form.dateOfBirth,        // "YYYY-MM-DD" — matches LocalDate
        panNumber:     form.panNumber.toUpperCase(),
        email:         form.email,
        mobileNumber:  form.mobileNumber,
        address:       form.address,
        occupation:    form.occupation,
        annualSalary:  parseFloat(form.annualSalary),  // matches BigDecimal
        itReturnFiled: form.itReturnFiled === "Yes",   // matches Boolean
        cardType:      form.cardType,
      };

      const res = await applyCard(payload);  // ✅ Live API call
      setMsg({ type:"success", text:`✅ Application submitted! A ${form.cardType} card will be issued to ${form.name}. Application ID: ${res.data.applicationId || ""}` });
      setForm(INITIAL);
    } catch(err) {
      setMsg({ type:"error", text: err.response?.data?.message || "Submission failed." });
    } finally { setLoading(false); }
  }

  return (
    <>
      <div className="page-header">
        <h1>Apply for a Credit Card</h1>
        <p>Fill in your details to apply for a new VISA or MasterCard.</p>
      </div>

      {msg && <div className={`pp-alert pp-alert-${msg.type}`}>{msg.text}</div>}

      <div className="glass" style={{maxWidth:"600px",padding:"32px"}}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="pp-label">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="pp-input" placeholder="Priya Nivalkar" required />
            </div>
            <div className="form-group">
              <label className="pp-label">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
                className="pp-input" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="pp-label">PAN Number</label>
              <input name="panNumber" value={form.panNumber} onChange={handleChange}
                className="pp-input" placeholder="ABCDE1234F"
                maxLength={10} style={{textTransform:"uppercase"}} required />
            </div>
            <div className="form-group">
              <label className="pp-label">Mobile Number</label>
              <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange}
                className="pp-input" placeholder="9876543210" maxLength={10} required />
            </div>
          </div>

          <div className="form-group">
            <label className="pp-label">Email ID</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="pp-input" placeholder="you@email.com" required />
          </div>

          <div className="form-group">
            <label className="pp-label">Address</label>
            <input name="address" value={form.address} onChange={handleChange}
              className="pp-input" placeholder="Mumbai, Maharashtra" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="pp-label">Occupation</label>
              <select name="occupation" value={form.occupation} onChange={handleChange}
                className="pp-input" required>
                <option value="">Select Occupation</option>
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Business">Business</option>
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="pp-label">Annual Salary (₹)</label>
              <input type="number" name="annualSalary" value={form.annualSalary} onChange={handleChange}
                className="pp-input" placeholder="e.g. 500000" min="0" step="0.01" required />
            </div>
          </div>

          <div className="form-group">
            <label className="pp-label">ITR Filed</label>
            <div style={{display:"flex", gap:"12px", marginTop:"6px"}}>
              {["Yes","No"].map(opt => (
                <label key={opt} style={{display:"flex", alignItems:"center", gap:"6px",
                  cursor:"pointer", fontSize:"14px", color:"var(--muted)"}}>
                  <input
                    type="radio"
                    name="itReturnFiled"
                    value={opt}
                    checked={form.itReturnFiled === opt}
                    onChange={handleChange}
                    required
                    style={{accentColor:"var(--blue-light)", width:"16px", height:"16px"}}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="pp-label">Card Type</label>
            <div style={{display:"flex",gap:"12px"}}>
              {["VISA","MASTERCARD"].map(ct => (
                <div key={ct} className={`card-type-btn ${form.cardType===ct?"active":""}`}
                  onClick={()=>setForm({...form,cardType:ct})}>
                  <span className="ct-icon">{ct==="VISA"?"💳":"🔵"}</span>
                  {ct}
                </div>
              ))}
            </div>
          </div>

          <button className="pp-btn pp-btn-primary pp-btn-full" disabled={loading} style={{marginTop:"8px"}}>
            {loading ? "Submitting..." : "Submit Application →"}
          </button>
        </form>
      </div>
    </>
  );
}

export default ApplyCard;