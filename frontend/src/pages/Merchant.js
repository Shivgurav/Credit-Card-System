import { useState, useEffect } from "react";
import { registerMerchant, getAllMerchants } from "../services/api";

const INIT = { merchantName:"", email:"", mobileNumber:"", bankName:"", accountNumber:"", ifscCode:"", address:"" };

function StatusBadge({ status }) {
  const cls = status==="APPROVED"?"badge-success":status==="REJECTED"?"badge-danger":"badge-warning";
  return <span className={`badge ${cls}`}>{status}</span>;
}

function Merchant() {
  const role = localStorage.getItem("role") || "USER";
  const [form, setForm]   = useState(INIT);
  const [msg,  setMsg]    = useState(null);
  const [loading, setLoad]= useState(false);

  // ── Admin state ───────────────────────────────────────────────
  const [merchants, setMerchants] = useState([]);
  const [fetching, setFetching]   = useState(false);
  const [search, setSearch]       = useState("");

  function handleChange(e) { setForm({...form,[e.target.name]:e.target.value}); }

  // ── Fetch all merchants when admin loads ──────────────────────
  useEffect(() => {
    if (role === "ADMIN") fetchMerchants();
  }, []);

  async function fetchMerchants() {
    setFetching(true);
    try {
      const res = await getAllMerchants();
      setMerchants(res.data || []);  // ✅ direct array from backend
    } catch (err) {
      console.error("Failed to fetch merchants", err);
    } finally { setFetching(false); }
  }

  // ── User: register merchant ───────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault(); setMsg(null); setLoad(true);
    try {
      const res = await registerMerchant(form);  // ✅ POST /merchants
      const saved = res.data;                    // ✅ direct MerchantResponseDTO
      setMsg({ type:"success", text:`✅ Merchant "${saved.merchantName}" registered! ID: ${saved.merchantId}. ` });
      setForm(INIT);
    } catch(err) {
      setMsg({ type:"error", text: err.response?.data?.message || "Registration failed." });
    } finally { setLoad(false); }
  }

  const filtered = merchants.filter(m =>
    m.merchantName?.toLowerCase().includes(search.toLowerCase()) ||
    m.merchantId?.includes(search)
  );

  return (
    <>
      <div className="page-header">
        <h1>{role==="ADMIN" ? "Merchant Management" : "Register Merchant"}</h1>
        <p>{role==="ADMIN" ? "View all merchant registrations." : "Register your business to accept card payments."}</p>
      </div>

      {/* ── ADMIN tab header ─────────────────────── */}
      {role === "ADMIN" && (
        <div className="pp-tabs">
          <div className="pp-tab active">📋 All Merchants</div>
        </div>
      )}

      {/* ── USER: Register form ──────────────────── */}
      {role === "USER" && (
        <>
          {msg && <div className={`pp-alert pp-alert-${msg.type}`}>{msg.text}</div>}
          <div className="glass" style={{maxWidth:"600px",padding:"32px"}}>
            <form onSubmit={handleRegister}>

              <div className="form-group">
                <label className="pp-label">Merchant Name *</label>
                <input name="merchantName" value={form.merchantName} onChange={handleChange}
                  className="pp-input" placeholder="Raj Electronics" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="pp-label">Merchant Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className="pp-input" placeholder="merchant@email.com" required />
                </div>
                <div className="form-group">
                  <label className="pp-label">Mobile No. *</label>
                  <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange}
                    className="pp-input" placeholder="9876543210" maxLength={10} required />
                </div>
              </div>

              <div className="form-group">
                <label className="pp-label">Bank Name</label>
                <input name="bankName" value={form.bankName} onChange={handleChange}
                  className="pp-input" placeholder="SBI / HDFC / ICICI..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="pp-label">Account No.</label>
                  <input name="accountNumber" value={form.accountNumber} onChange={handleChange}
                    className="pp-input" placeholder="123456789012" />
                </div>
                <div className="form-group">
                  <label className="pp-label">IFSC Code</label>
                  <input name="ifscCode" value={form.ifscCode} onChange={handleChange}
                    className="pp-input" placeholder="SBIN0001234"
                    style={{textTransform:"uppercase"}} />
                </div>
              </div>

              <div className="form-group">
                <label className="pp-label">Address</label>
                <input name="address" value={form.address} onChange={handleChange}
                  className="pp-input" placeholder="Shop No. 12, MG Road, Mumbai" />
              </div>

              <button className="pp-btn pp-btn-success pp-btn-full" disabled={loading} style={{marginTop:"8px"}}>
                {loading ? "Registering..." : "Register Merchant →"}
              </button>
            </form>
          </div>
        </>
      )}

      {/* ── ADMIN: Manage Table ──────────────────── */}
      {role === "ADMIN" && (
        <>
          <div style={{marginBottom:"16px",display:"flex",gap:"12px",alignItems:"center"}}>
            <input className="pp-input" placeholder="🔍 Search by name or merchant ID..."
              value={search} onChange={e=>setSearch(e.target.value)}
              style={{maxWidth:"360px"}} />
            <button className="pp-btn pp-btn-ghost" onClick={fetchMerchants} disabled={fetching}>
              {fetching ? "Loading..." : "🔄 Refresh"}
            </button>
          </div>

          {fetching ? (
            <div style={{color:"var(--muted)",padding:"32px",textAlign:"center"}}>Loading merchants...</div>
          ) : (
            <div className="pp-table-wrap">
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>Merchant ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Bank Name</th>
                    <th>Account No.</th>
                    <th>IFSC</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{textAlign:"center",color:"var(--muted)"}}>
                        No merchants found
                      </td>
                    </tr>
                  ) : filtered.map(m => (
                    <tr key={m.merchantId}>
                      <td style={{fontFamily:"monospace",color:"var(--muted)"}}>{m.merchantId}</td>
                      <td style={{fontWeight:600}}>{m.merchantName}</td>
                      <td style={{color:"var(--muted)"}}>{m.email}</td>
                      <td>{m.mobileNumber}</td>
                      <td>{m.bankName || "—"}</td>
                      <td style={{fontFamily:"monospace"}}>{m.accountNumber || "—"}</td>
                      <td style={{fontFamily:"monospace"}}>{m.ifscCode || "—"}</td>
                      <td><StatusBadge status={m.status}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Merchant;