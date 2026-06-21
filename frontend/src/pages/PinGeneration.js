import { useState, useEffect } from "react";
import { getAllApplications, getCard, requestPinOtp, setPin as setPinApi } from "../services/api";

function PinGeneration() {
  const email = localStorage.getItem("email") || "";

  const [cards, setCards]             = useState([]);
  const [selectedCard, setSelected]   = useState(null);
  const [cardsLoading, setCardsLoading] = useState(false);

  // ── PIN steps: idle | sent | done ────────────────────────────
  const [step, setStep]           = useState("idle");
  const [otp, setOtp]             = useState("");
  const [pin, setPin]             = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [msg, setMsg]             = useState(null);
  const [loading, setLoading]     = useState(false);

  useEffect(() => { fetchUserCards(); }, []);

  async function fetchUserCards() {
    setCardsLoading(true);
    try {
      const res = await getAllApplications();
      const approved = (res.data || []).filter(
        a => a.email === email && a.applicationStatus === "APPROVED" && a.cardNumber
      );
      const details = await Promise.all(
        approved.map(a => getCard(Number(a.cardNumber)).then(r => r.data))
      );
      setCards(details);
      if (details.length > 0) setSelected(details[0]);
    } catch(err) { console.error(err); }
    finally { setCardsLoading(false); }
  }

  function handleCardChange(e) {
    const card = cards.find(c => String(c.cardNumber) === e.target.value);
    setSelected(card || null);
    resetState();
  }

  function resetState() {
    setStep("idle"); setOtp(""); setPin(""); setConfirmPin(""); setMsg(null);
  }

  // ── Step 1: Request OTP ───────────────────────────────────────
  async function handleRequestOtp() {
    setMsg(null); setLoading(true);
    try {
      await requestPinOtp(selectedCard.cardNumber);
      setStep("sent");
      setMsg({ type:"success", text:"✅ OTP sent to your registered email. Valid for 5 minutes." });
    } catch(err) {
      setMsg({ type:"error", text: err.response?.data?.message || "Failed to send OTP." });
    } finally { setLoading(false); }
  }

  // ── Step 2: Verify OTP + Set PIN ─────────────────────────────
  async function handleSetPin(e) {
    e.preventDefault();
    if (pin !== confirmPin) { setMsg({ type:"error", text:"PINs do not match." }); return; }
    if (!/^\d{4}$/.test(pin)) { setMsg({ type:"error", text:"PIN must be exactly 4 digits." }); return; }

    setMsg(null); setLoading(true);
    try {
      // ✅ Use setPinApi alias to avoid conflict with setPin state setter
      const res = await setPinApi(selectedCard.cardNumber, otp, pin);
      console.log("setPin response:", res);
      console.log("setPin data:", res.data);

      const result = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
      console.log("result string:", result);

      if (result.includes("successfully")) {
        setStep("done");
        const updated = await getCard(selectedCard.cardNumber).then(r => r.data);
        setSelected(updated);
        setCards(prev => prev.map(c => c.cardNumber === updated.cardNumber ? updated : c));
        setMsg({ type:"success", text:"✅ PIN set successfully! You can now use your card." });
      } else {
        setMsg({ type:"error", text: result });
      }
    } catch(err) {
      console.error("setPin error:", err.response?.data);
      setMsg({ type:"error", text: err.response?.data?.message || err.response?.data || "Failed to set PIN." });
    } finally { setLoading(false); }
  }

  if (cardsLoading) return <div style={{color:"var(--muted)"}}>Loading your cards...</div>;

  if (cards.length === 0) return (
    <>
      <div className="page-header"><h1>PIN Generation</h1></div>
      <div style={{color:"var(--muted)"}}>No active cards found. Apply for a card first.</div>
    </>
  );

  return (
    <>
      <div className="page-header">
        <h1>PIN Generation</h1>
        <p>Generate or reset your credit card PIN securely via OTP.</p>
      </div>

      {/* Card Selector */}
      <div style={{maxWidth:"480px",marginBottom:"28px"}}>
        <label className="pp-label" style={{marginBottom:"8px",display:"block"}}>Select Card</label>
        <select className="pp-input"
          value={selectedCard ? String(selectedCard.cardNumber) : ""}
          onChange={handleCardChange}>
          {cards.map(c => (
            <option key={c.cardNumber} value={String(c.cardNumber)}>
              {c.cardType} •••• {String(c.cardNumber).slice(-4)} — {c.pinSet ? "PIN Set ✅" : "PIN Not Set ❌"}
            </option>
          ))}
        </select>
      </div>

      {selectedCard && (
        <div className="glass" style={{maxWidth:"440px",padding:"28px"}}>

          {/* Card info */}
          <div style={{
            display:"flex",justifyContent:"space-between",alignItems:"center",
            marginBottom:"20px",paddingBottom:"16px",
            borderBottom:"1px solid rgba(255,255,255,0.08)"
          }}>
            <div>
              <div style={{fontWeight:700}}>
                {selectedCard.cardType} •••• {String(selectedCard.cardNumber).slice(-4)}
              </div>
              <div style={{color:"var(--muted)",fontSize:"13px"}}>{selectedCard.customerName}</div>
            </div>
            <div style={{
              padding:"6px 12px",borderRadius:"20px",fontSize:"12px",fontWeight:600,
              background: selectedCard.pinSet ? "rgba(0,196,140,0.15)" : "rgba(245,166,35,0.15)",
              color: selectedCard.pinSet ? "var(--success)" : "var(--warning)"
            }}>
              {selectedCard.pinSet ? "✅ PIN Active" : "⚠️ PIN Not Set"}
            </div>
          </div>

          {msg && (
            <div className={`pp-alert pp-alert-${msg.type}`} style={{marginBottom:"16px"}}>
              {msg.text}
            </div>
          )}

          {/* Step 1 — idle */}
          {step === "idle" && (
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              <p style={{color:"var(--muted)",fontSize:"13px",margin:0}}>
                {selectedCard.pinSet
                  ? "Want to reset your PIN? We'll send an OTP to your registered email."
                  : "Generate a new 4-digit PIN for your card. We'll send an OTP to verify."}
              </p>
              <button className="pp-btn pp-btn-primary"
                onClick={handleRequestOtp} disabled={loading}>
                {loading ? "Sending OTP..." : "📧 Send OTP to my email"}
              </button>
            </div>
          )}

          {/* Step 2 — OTP sent */}
          {step === "sent" && (
            <form onSubmit={handleSetPin}
              style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              <div>
                <div className="pp-label" style={{marginBottom:"6px"}}>Enter OTP</div>
                <input className="pp-input" placeholder="6-digit OTP"
                  value={otp} onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  style={{letterSpacing:"6px",textAlign:"center",fontSize:"18px"}} />
              </div>
              <div>
                <div className="pp-label" style={{marginBottom:"6px"}}>New 4-digit PIN</div>
                <input type="password" className="pp-input" placeholder="••••"
                  value={pin} onChange={e => setPin(e.target.value)}
                  maxLength={4}
                  style={{letterSpacing:"8px",textAlign:"center",fontSize:"22px"}} />
              </div>
              <div>
                <div className="pp-label" style={{marginBottom:"6px"}}>Confirm PIN</div>
                <input type="password" className="pp-input" placeholder="••••"
                  value={confirmPin} onChange={e => setConfirmPin(e.target.value)}
                  maxLength={4}
                  style={{letterSpacing:"8px",textAlign:"center",fontSize:"22px"}} />
              </div>
              <button className="pp-btn pp-btn-success"
                disabled={loading || otp.length < 6 || pin.length < 4 || confirmPin.length < 4}>
                {loading ? "Setting PIN..." : "✅ Set PIN"}
              </button>
              <button type="button" className="pp-btn pp-btn-ghost"
                style={{fontSize:"12px"}} onClick={handleRequestOtp} disabled={loading}>
                🔄 Resend OTP
              </button>
            </form>
          )}

          {/* Step 3 — done */}
          {step === "done" && (
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              <div style={{
                padding:"16px",borderRadius:"8px",textAlign:"center",
                background:"rgba(0,196,140,0.1)",color:"var(--success)"
              }}>
                🎉 Your PIN has been set successfully!<br/>
                <small style={{opacity:.7}}>
                  Keep your PIN confidential. Never share it with anyone.
                </small>
              </div>
              <button className="pp-btn pp-btn-ghost" onClick={resetState}>
                🔄 Generate PIN for another card
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default PinGeneration;