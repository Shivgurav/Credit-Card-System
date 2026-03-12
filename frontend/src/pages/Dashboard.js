import { useState, useEffect } from "react";
import { getPendingApplications, reviewApplication, getAllMerchants,
         requestOtp, verifyOtp, resetPassword, updateAddress } from "../services/api";

function StatusBadge({ status }) {
  const cls = status === "APPROVED" ? "badge-success"
            : status === "REJECTED" ? "badge-danger" : "badge-warning";
  return <span className={`badge ${cls}`}>{status}</span>;
}

function Dashboard() {
  const role  = localStorage.getItem("role")     || "USER";
  const name  = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email")    || "";

  // ── Admin state ───────────────────────────────────────────────
  const [pendingCards, setPendingCards] = useState([]);
  const [cardLoading, setCardLoading]   = useState(false);
  const [activeCards, setActiveCards]   = useState(0);

  // ── User: view/edit mode ──────────────────────────────────────
  const [editMode, setEditMode] = useState(false);

  // ── User: address ─────────────────────────────────────────────
  const [address, setAddress]   = useState("");
  const [addrMsg, setAddrMsg]   = useState(null);
  const [addrLoading, setAddrLoad] = useState(false);

  // ── User: password reset (3 steps) ───────────────────────────
  const [pwStep, setPwStep]       = useState("idle"); // idle | sent | verified
  const [otp, setOtp]             = useState("");
  const [newPassword, setNewPw]   = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg]         = useState(null);
  const [pwLoading, setPwLoad]    = useState(false);

  // ── User: merchant ────────────────────────────────────────────
  const [userMerchant, setUserMerchant]         = useState(null);
  const [merchantLoading, setMerchantLoading]   = useState(false);

  useEffect(() => {
    if (role === "ADMIN") fetchPendingCards();
    else fetchUserMerchant();
  }, [role]);

  // ── Admin: fetch pending cards ────────────────────────────────
  async function fetchPendingCards() {
    setCardLoading(true);
    try {
      const res = await getPendingApplications();
      setPendingCards(res.data || []);
    } catch (err) { console.error(err); }
    finally { setCardLoading(false); }
  }

  async function handleApproveCard(applicationId) {
    try {
      const res = await reviewApplication(applicationId, { decision: "APPROVED", rejectionReason: null });
      const approved = res.data;
      setPendingCards(prev => prev.filter(a => a.applicationId !== applicationId));
      setActiveCards(prev => prev + 1);
      alert(`✅ Card approved!\nCard Number: ${approved.cardNumber}\nIssued to: ${approved.name}`);
    } catch (err) { alert(err.response?.data?.message || "Approval failed"); }
  }

  async function handleRejectCard(applicationId) {
    const reason = prompt("Enter rejection reason:");
    if (!reason || reason.trim() === "") { alert("Rejection reason is required."); return; }
    try {
      await reviewApplication(applicationId, { decision: "REJECTED", rejectionReason: reason.trim() });
      setPendingCards(prev => prev.filter(a => a.applicationId !== applicationId));
      alert("❌ Card application rejected.");
    } catch (err) { alert(err.response?.data?.message || "Rejection failed"); }
  }

  // ── User: fetch merchant by email ─────────────────────────────
  async function fetchUserMerchant() {
    setMerchantLoading(true);
    try {
      const res = await getAllMerchants();
      const all = res.data || [];
      setUserMerchant(all.find(m => m.email === email) || null);
    } catch (err) { console.error(err); }
    finally { setMerchantLoading(false); }
  }

  // ── User: update address ──────────────────────────────────────
  async function handleUpdateAddress(e) {
    e.preventDefault(); setAddrMsg(null); setAddrLoad(true);
    try {
      await updateAddress(email, address);
      setAddrMsg({ type:"success", text:"✅ Address updated successfully!" });
      setAddress("");
    } catch (err) {
      setAddrMsg({ type:"error", text: err.response?.data?.message || "Update failed." });
    } finally { setAddrLoad(false); }
  }

  // ── User: OTP step 1 — validate passwords then send OTP ───────
  async function handleRequestOtp() {
    setPwMsg(null);
    if (newPassword !== confirmPw) {
      setPwMsg({ type:"error", text:"Passwords do not match." }); return;
    }
    if (newPassword.length < 6) {
      setPwMsg({ type:"error", text:"Password must be at least 6 characters." }); return;
    }
    setPwLoad(true);
    try {
      await requestOtp(email);
      setPwStep("sent");
      setPwMsg({ type:"success", text:`✅ OTP sent to ${email}. Valid for 5 minutes.` });
    } catch (err) {
      setPwMsg({ type:"error", text: err.response?.data?.message || "Failed to send OTP." });
    } finally { setPwLoad(false); }
  }

  // ── User: OTP step 2 — verify OTP then auto-reset password ────
  async function handleVerifyOtp() {
    setPwMsg(null); setPwLoad(true);
    try {
      const res = await verifyOtp(email, otp);
      const result = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
      if (result.includes("verified")) {
        setPwStep("verified");
        await resetPassword(email, newPassword);
        setPwMsg({ type:"success", text:"✅ Password updated successfully!" });
        setTimeout(() => {
          setPwStep("idle"); setOtp(""); setNewPw(""); setConfirmPw("");
          setPwMsg(null); setEditMode(false);
        }, 2000);
      } else {
        setPwMsg({ type:"error", text: result });
      }
    } catch (err) {
      setPwMsg({ type:"error", text: err.response?.data?.message || "Verification failed." });
    } finally { setPwLoad(false); }
  }

  function cancelEdit() {
    setEditMode(false); setAddrMsg(null); setPwMsg(null);
    setPwStep("idle"); setAddress(""); setOtp(""); setNewPw(""); setConfirmPw("");
  }

  const statusColor = {
    APPROVED: "var(--success)",
    REJECTED: "var(--danger)",
    PENDING:  "var(--warning)"
  };

  return (
    <>
      <div className="page-header">
        <h1>Hello, {name}!</h1>
        <p>{role === "ADMIN"
          ? "Here's your admin overview for today."
          : "Welcome back to your PayPanda account."}</p>
      </div>

      {/* ════════════════ ADMIN ════════════════ */}
      {role === "ADMIN" && (
        <>
          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"16px",marginBottom:"32px"}}>
            {[
              { icon:"💳", label:"Pending Card Apps", value: String(pendingCards.length), color:"rgba(245,166,35,0.2)" },
              { icon:"✅", label:"Cards Approved",    value: String(activeCards),          color:"rgba(0,196,140,0.2)"  },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{background:s.color}}>{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Pending Card Applications */}
          <div className="page-header" style={{marginBottom:"16px"}}>
            <h1 style={{fontSize:"18px"}}>💳 Pending Card Applications</h1>
          </div>

          {cardLoading ? (
            <div style={{color:"var(--muted)",marginBottom:"24px"}}>Loading...</div>
          ) : pendingCards.length === 0 ? (
            <div style={{color:"var(--muted)",marginBottom:"24px"}}>No pending card applications.</div>
          ) : (
            <div className="pp-table-wrap" style={{marginBottom:"32px"}}>
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>App ID</th><th>Name</th><th>PAN</th><th>Email</th>
                    <th>Card Type</th><th>Salary (₹)</th><th>ITR</th>
                    <th>Applied At</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCards.map(a => (
                    <tr key={a.applicationId}>
                      <td style={{fontFamily:"monospace",color:"var(--muted)"}}>{a.applicationId}</td>
                      <td style={{fontWeight:600}}>{a.name}</td>
                      <td style={{fontFamily:"monospace"}}>{a.panNumber}</td>
                      <td style={{color:"var(--muted)"}}>{a.email}</td>
                      <td>{a.cardType}</td>
                      <td style={{fontWeight:700}}>₹{Number(a.annualSalary).toLocaleString()}</td>
                      <td>{a.itReturnFiled ? "✅ Yes" : "❌ No"}</td>
                      <td style={{color:"var(--muted)"}}>
                        {a.appliedAt ? new Date(a.appliedAt).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td>
                        <div style={{display:"flex",gap:"6px"}}>
                          <button className="pp-btn pp-btn-success pp-btn-sm"
                            onClick={() => handleApproveCard(a.applicationId)}>✅ Approve</button>
                          <button className="pp-btn pp-btn-danger pp-btn-sm"
                            onClick={() => handleRejectCard(a.applicationId)}>✕ Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ════════════════ USER ════════════════ */}
      {role === "USER" && (
        <>
          {/* ── Profile Card ─────────────────────────────────── */}
          <div className="page-header" style={{marginBottom:"16px"}}>
            <h1 style={{fontSize:"18px"}}>👤 My Profile</h1>
          </div>

          <div className="glass" style={{maxWidth:"560px",padding:"28px",marginBottom:"32px"}}>

            {/* Avatar + name + edit button */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
                <div style={{
                  width:"52px",height:"52px",borderRadius:"50%",
                  background:"rgba(29,106,255,0.2)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:"20px",fontWeight:700,color:"var(--blue-light)",flexShrink:0
                }}>
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:"17px"}}>{name}</div>
                  <div style={{color:"var(--muted)",fontSize:"13px"}}>{email}</div>
                </div>
              </div>
              <button className="pp-btn pp-btn-ghost"
                style={{fontSize:"13px",padding:"6px 14px"}}
                onClick={() => editMode ? cancelEdit() : setEditMode(true)}>
                {editMode ? "✕ Cancel" : "✏️ Edit Profile"}
              </button>
            </div>

            {/* ── VIEW MODE ─────────────────────────────────── */}
            {!editMode && (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                {[
                  { label:"Full Name", value: name  },
                  { label:"Email",     value: email },
                  { label:"Role",      value: role  },
                ].map(item => (
                  <div key={item.label} className="glass" style={{padding:"12px"}}>
                    <div className="pp-label" style={{marginBottom:"4px"}}>{item.label}</div>
                    <div style={{fontWeight:600,fontSize:"14px"}}>{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── EDIT MODE ─────────────────────────────────── */}
            {editMode && (
              <>
                {/* Update Address */}
                <div style={{marginBottom:"24px"}}>
                  <div className="pp-label" style={{marginBottom:"8px"}}>📍 Update Address</div>
                  {addrMsg && (
                    <div className={`pp-alert pp-alert-${addrMsg.type}`} style={{marginBottom:"10px"}}>
                      {addrMsg.text}
                    </div>
                  )}
                  <form onSubmit={handleUpdateAddress} style={{display:"flex",gap:"10px"}}>
                    <input className="pp-input" placeholder="Enter new address..."
                      value={address} onChange={e => setAddress(e.target.value)} required />
                    <button className="pp-btn pp-btn-primary" style={{whiteSpace:"nowrap"}} disabled={addrLoading}>
                      {addrLoading ? "Saving..." : "Save"}
                    </button>
                  </form>
                </div>

                {/* Divider */}
                <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",marginBottom:"20px"}} />

                {/* Update Password */}
                <div>
                  <div className="pp-label" style={{marginBottom:"8px"}}>🔒 Update Password</div>
                  {pwMsg && (
                    <div className={`pp-alert pp-alert-${pwMsg.type}`} style={{marginBottom:"10px"}}>
                      {pwMsg.text}
                    </div>
                  )}

                  {/* Step 1 — enter new password → send OTP */}
                  {pwStep === "idle" && (
                    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                      <input type="password" className="pp-input"
                        placeholder="Enter new password (min 6 chars)"
                        value={newPassword} onChange={e => setNewPw(e.target.value)} />
                      <input type="password" className="pp-input"
                        placeholder="Confirm new password"
                        value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
                      <button className="pp-btn pp-btn-primary"
                        onClick={handleRequestOtp}
                        disabled={pwLoading || !newPassword || !confirmPw || newPassword.length < 6}>
                        {pwLoading ? "Sending OTP..." : "📧 Send OTP to verify"}
                      </button>
                    </div>
                  )}

                  {/* Step 2 — enter OTP */}
                  {pwStep === "sent" && (
                    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                      <div style={{
                        padding:"10px 14px",borderRadius:"8px",
                        background:"rgba(0,212,255,0.08)",
                        color:"var(--muted)",fontSize:"13px"
                      }}>
                        📧 OTP sent to <strong>{email}</strong>. Valid for 5 minutes.
                      </div>
                      <div style={{display:"flex",gap:"10px"}}>
                        <input className="pp-input" placeholder="Enter 6-digit OTP"
                          value={otp} onChange={e => setOtp(e.target.value)}
                          maxLength={6}
                          style={{letterSpacing:"6px",textAlign:"center",fontSize:"18px"}} />
                        <button className="pp-btn pp-btn-primary" style={{whiteSpace:"nowrap"}}
                          onClick={handleVerifyOtp}
                          disabled={pwLoading || otp.length < 6}>
                          {pwLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                      </div>
                      <button className="pp-btn pp-btn-ghost"
                        style={{fontSize:"12px",padding:"4px 10px",alignSelf:"flex-start"}}
                        onClick={handleRequestOtp} disabled={pwLoading}>
                        🔄 Resend OTP
                      </button>
                    </div>
                  )}

                  {/* Step 3 — verified, auto updating */}
                  {pwStep === "verified" && (
                    <div style={{
                      padding:"12px 14px",borderRadius:"8px",
                      background:"rgba(0,196,140,0.1)",
                      color:"var(--success)",fontSize:"13px"
                    }}>
                      ✅ OTP verified. Updating your password...
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Merchant Section ─────────────────────────────── */}
          <div className="page-header" style={{marginBottom:"16px"}}>
            <h1 style={{fontSize:"18px"}}>🏪 My Merchant</h1>
          </div>

          {merchantLoading ? (
            <div style={{color:"var(--muted)",marginBottom:"32px"}}>Loading merchant info...</div>
          ) : !userMerchant ? (
            <div style={{color:"var(--muted)",marginBottom:"32px"}}>
              No merchant registration found for your account.
            </div>
          ) : (
            <div className="glass" style={{maxWidth:"560px",padding:"24px",marginBottom:"32px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:"17px"}}>{userMerchant.merchantName}</div>
                  <div style={{color:"var(--muted)",fontSize:"13px",marginTop:"2px"}}>{userMerchant.merchantId}</div>
                </div>
                <StatusBadge status={userMerchant.status} />
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
                {[
                  { label:"Email",      value: userMerchant.email          },
                  { label:"Mobile",     value: userMerchant.mobileNumber   },
                  { label:"Bank Name",  value: userMerchant.bankName       || "—" },
                  { label:"Account No", value: userMerchant.accountNumber  || "—" },
                  { label:"IFSC Code",  value: userMerchant.ifscCode       || "—" },
                ].map(item => (
                  <div key={item.label} className="glass" style={{padding:"12px"}}>
                    <div className="pp-label" style={{marginBottom:"4px"}}>{item.label}</div>
                    <div style={{fontWeight:600,fontSize:"14px"}}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div style={{
                padding:"12px",borderRadius:"8px",fontSize:"13px",fontWeight:500,
                background: userMerchant.status==="APPROVED" ? "rgba(0,196,140,0.1)"
                          : userMerchant.status==="REJECTED" ? "rgba(255,59,59,0.1)"
                          : "rgba(245,166,35,0.1)",
                color: statusColor[userMerchant.status]
              }}>
                {userMerchant.status === "APPROVED" && "✅ Your merchant account is active and approved."}
                {userMerchant.status === "PENDING"  && "⏳ Your registration is under review by admin."}
                {userMerchant.status === "REJECTED" && "❌ Your registration was rejected. Please contact support."}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Dashboard;