import { useState, useEffect } from "react";
import { registerMerchant, getAllMerchants } from "../services/api";

function StatusBadge({ status }) {
  const cls = status==="APPROVED"?"badge-success":status==="REJECTED"?"badge-danger":"badge-warning";
  return <span className={`badge ${cls}`}>{status}</span>;
}

function Merchant() {
  const role      = localStorage.getItem("role")  || "USER";
  const userEmail = localStorage.getItem("email") || "";

  // ✅ Email pre-filled from login — cannot be changed
  const INIT = {
    merchantName:"", email: userEmail,
    mobileNumber:"", bankName:"", accountNumber:"", ifscCode:"", address:""
  };

  const [form, setForm]     = useState(INIT);
  const [msg,  setMsg]      = useState(null);
  const [loading, setLoad]  = useState(false);

  // ── USER merchant profile ─────────────────────────────────────
  const [myMerchant, setMyMerchant]     = useState(null);
  const [profileLoad, setProfileLoad]   = useState(false);

  // ── Admin state ───────────────────────────────────────────────
  const [merchants, setMerchants]   = useState([]);
  const [fetching, setFetching]     = useState(false);
  const [search, setSearch]         = useState("");

  function handleChange(e) {
    if (e.target.name === "email") return; // ✅ lock email field
    setForm({...form, [e.target.name]: e.target.value});
  }

  useEffect(() => {
    if (role === "ADMIN") fetchMerchants();
    else fetchMyMerchant();
  }, []);

  // ── Fetch merchant profile for logged-in user ─────────────────
  async function fetchMyMerchant() {
    setProfileLoad(true);
    try {
      const res = await getAllMerchants();
      const all = res.data || [];
      const mine = all.find(m =>
        m.email?.toLowerCase().trim() === userEmail?.toLowerCase().trim()
      );
      setMyMerchant(mine || null);
    } catch(err) { console.error(err); }
    finally { setProfileLoad(false); }
  }

  async function fetchMerchants() {
    setFetching(true);
    try {
      const res = await getAllMerchants();
      setMerchants(res.data || []);
    } catch(err) { console.error(err); }
    finally { setFetching(false); }
  }

  // ── User: register merchant ───────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault(); setMsg(null); setLoad(true);
    try {
      const res   = await registerMerchant(form);
      const saved = res.data;
      setMsg({ type:"success",
        text:`✅ Merchant "${saved.merchantName}" registered! ID: ${saved.merchantId}.` });
      setForm(INIT);
      fetchMyMerchant();
    } catch(err) {
      setMsg({ type:"error",
        text: err.response?.data?.message || "Registration failed." });
    } finally { setLoad(false); }
  }

  const filtered = merchants.filter(m =>
    m.merchantName?.toLowerCase().includes(search.toLowerCase()) ||
    m.merchantId?.includes(search)
  );

  const statusColor = {
    APPROVED:"var(--success)", REJECTED:"var(--danger)", PENDING:"var(--warning)"
  };

  return (
    <>
      <div className="page-header">
        <h1>{role==="ADMIN" ? "Merchant Management" : "Merchant"}</h1>
        <p>{role==="ADMIN"
          ? "View all merchant registrations."
          : "Manage your merchant profile and track received payments."}</p>
      </div>

      {/* ── USER VIEW ────────────────────────────────────────────── */}
      {role === "USER" && (
        <>
          {profileLoad ? (
            <div style={{color:"var(--muted)"}}>Loading merchant profile...</div>
          ) : myMerchant ? (
            <>
              {/* Header */}
              <div style={{
                display:"flex",justifyContent:"space-between",
                alignItems:"center",marginBottom:"20px"
              }}>
                <h2 style={{fontSize:"16px",margin:0}}>Your Merchant Profile</h2>
                <StatusBadge status={myMerchant.status} />
              </div>

              {/* ✅ Total Amount Received */}
              <div className="glass" style={{
                padding:"20px 24px",marginBottom:"24px",maxWidth:"700px",
                borderLeft:"3px solid var(--success)"
              }}>
                <div className="pp-label" style={{marginBottom:"4px"}}>
                  💰 Total Amount Received
                </div>
                <div style={{fontSize:"28px",fontWeight:800,color:"var(--success)"}}>
                  ₹{Number(myMerchant.totalAmountReceived || 0).toLocaleString("en-IN",{
                    minimumFractionDigits:2, maximumFractionDigits:2
                  })}
                </div>
                <div style={{color:"var(--muted)",fontSize:"12px",marginTop:"4px"}}>
                  Cumulative amount received via PayPanda transactions
                </div>
              </div>

              {/* Merchant Details Grid */}
              <div style={{
                display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
                gap:"12px",maxWidth:"700px",marginBottom:"28px"
              }}>
                {[
                  { label:"Merchant ID",   value: myMerchant.merchantId,        mono:true },
                  { label:"Business Name", value: myMerchant.merchantName                 },
                  { label:"Email",         value: myMerchant.email,             mono:true },
                  { label:"Mobile",        value: myMerchant.mobileNumber                },
                  { label:"Bank Name",     value: myMerchant.bankName    || "—"           },
                  { label:"Account No.",   value: myMerchant.accountNumber || "—", mono:true },
                  { label:"IFSC Code",     value: myMerchant.ifscCode    || "—",  mono:true },
                ].map(item => (
                  <div key={item.label} className="glass" style={{padding:"14px"}}>
                    <div className="pp-label" style={{marginBottom:"4px"}}>{item.label}</div>
                    <div style={{
                      fontSize:"13px",fontWeight:600,color:"var(--white)",
                      fontFamily: item.mono ? "monospace" : "inherit"
                    }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status message */}
              <div style={{
                maxWidth:"700px",padding:"12px",borderRadius:"8px",
                fontSize:"13px",fontWeight:500,
                background: myMerchant.status==="APPROVED" ? "rgba(0,196,140,0.1)"
                          : myMerchant.status==="REJECTED" ? "rgba(255,59,59,0.1)"
                          : "rgba(245,166,35,0.1)",
                color: statusColor[myMerchant.status]
              }}>
                {myMerchant.status==="APPROVED" && "✅ Your merchant account is active and approved."}
                {myMerchant.status==="PENDING"  && "⏳ Your registration is under review by admin."}
                {myMerchant.status==="REJECTED" && "❌ Your registration was rejected. Please contact support."}
              </div>
            </>

          ) : (
            // Not registered yet — show form
            <>
              {msg && (
                <div className={`pp-alert pp-alert-${msg.type}`} style={{marginBottom:"16px"}}>
                  {msg.text}
                </div>
              )}
              <div className="glass" style={{maxWidth:"600px",padding:"32px"}}>
                <h3 style={{marginBottom:"20px",fontSize:"15px"}}>
                  Register your business to accept card payments
                </h3>
                <form onSubmit={handleRegister}>

                  <div className="form-group">
                    <label className="pp-label">Merchant Name *</label>
                    <input name="merchantName" value={form.merchantName}
                      onChange={handleChange} className="pp-input"
                      placeholder="Xyz Electronics" required />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="pp-label">Merchant Email *</label>
                      {/* ✅ Read-only — auto-filled from login */}
                      <input type="email" name="email" value={form.email}
                        className="pp-input" readOnly
                        style={{opacity:0.7, cursor:"not-allowed"}} />
                    </div>
                    <div className="form-group">
                      <label className="pp-label">Mobile No. *</label>
                      <input name="mobileNumber" value={form.mobileNumber}
                        onChange={handleChange} className="pp-input"
                        placeholder="9876543210" maxLength={10} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="pp-label">Bank Name</label>
                    <input name="bankName" value={form.bankName}
                      onChange={handleChange} className="pp-input"
                      placeholder="SBI / HDFC / ICICI..." />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="pp-label">Account No.</label>
                      <input name="accountNumber" value={form.accountNumber}
                        onChange={handleChange} className="pp-input"
                        placeholder="123456789012" />
                    </div>
                    <div className="form-group">
                      <label className="pp-label">IFSC Code</label>
                      <input name="ifscCode" value={form.ifscCode}
                        onChange={handleChange} className="pp-input"
                        placeholder="SBIN0001234"
                        style={{textTransform:"uppercase"}} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="pp-label">Address</label>
                    <input name="address" value={form.address}
                      onChange={handleChange} className="pp-input"
                      placeholder="Shop No. 12, MG Road, Mumbai" />
                  </div>

                  <button className="pp-btn pp-btn-success pp-btn-full"
                    disabled={loading} style={{marginTop:"8px"}}>
                    {loading ? "Registering..." : "Register Merchant →"}
                  </button>
                </form>
              </div>
            </>
          )}
        </>
      )}

      {/* ── ADMIN VIEW ───────────────────────────────────────────── */}
      {role === "ADMIN" && (
        <>
          <div className="pp-tabs">
            <div className="pp-tab active">📋 All Merchants</div>
          </div>

          <div style={{marginBottom:"16px",display:"flex",gap:"12px",alignItems:"center"}}>
            <input className="pp-input"
              placeholder="🔍 Search by name or merchant ID..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{maxWidth:"360px"}} />
            <button className="pp-btn pp-btn-ghost"
              onClick={fetchMerchants} disabled={fetching}>
              {fetching ? "Loading..." : "🔄 Refresh"}
            </button>
          </div>

          {fetching ? (
            <div style={{color:"var(--muted)",padding:"32px",textAlign:"center"}}>
              Loading merchants...
            </div>
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
                    <th>Total Received</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{textAlign:"center",color:"var(--muted)"}}>
                        No merchants found
                      </td>
                    </tr>
                  ) : filtered.map(m => (
                    <tr key={m.merchantId}>
                      <td style={{fontFamily:"monospace",color:"var(--muted)"}}>
                        {m.merchantId}
                      </td>
                      <td style={{fontWeight:600}}>{m.merchantName}</td>
                      <td style={{color:"var(--muted)"}}>{m.email}</td>
                      <td>{m.mobileNumber}</td>
                      <td>{m.bankName || "—"}</td>
                      <td style={{fontFamily:"monospace"}}>{m.accountNumber || "—"}</td>
                      <td style={{fontFamily:"monospace"}}>{m.ifscCode || "—"}</td>
                      <td><StatusBadge status={m.status}/></td>
                      <td style={{
                        fontWeight:700,
                        color: Number(m.totalAmountReceived||0) > 0
                          ? "var(--success)" : "var(--muted)"
                      }}>
                        ₹{Number(m.totalAmountReceived || 0).toLocaleString("en-IN",{
                          minimumFractionDigits:2, maximumFractionDigits:2
                        })}
                      </td>
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