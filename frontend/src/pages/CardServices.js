import { useState, useEffect } from "react";
import { getAllApplications, getCard, payBill, cashWithdrawal, verifyPin } from "../services/api";

function CardServices() {
  const email = localStorage.getItem("email") || "";

  const [cards, setCards]               = useState([]);
  const [selectedCard, setSelected]     = useState(null);
  const [cardsLoading, setCardsLoading] = useState(false);

  // ── PIN verification state ────────────────────────────────────
  const [pinInput, setPinInput]         = useState("");
  const [pinVerified, setPinVerified]   = useState(false);
  const [pinMsg, setPinMsg]             = useState(null);
  const [pinLoading, setPinLoading]     = useState(false);

  // ── Pay Bill state ────────────────────────────────────────────
  const [billAmount, setBillAmount]     = useState("");
  const [billMsg, setBillMsg]           = useState(null);
  const [billLoading, setBillLoad]      = useState(false);

  // ── Cash Withdrawal state ─────────────────────────────────────
  const [withdrawAmount, setWithdraw]   = useState("");
  const [withdrawMsg, setWithdrawMsg]   = useState(null);
  const [withdrawLoading, setWdLoad]    = useState(false);

  const statusColor = {
    Open:"var(--success)", Blocked:"var(--warning)", Closed:"var(--danger)"
  };

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
    resetPin();
    setBillMsg(null); setWithdrawMsg(null);
    setBillAmount(""); setWithdraw("");
  }

  function resetPin() {
    setPinInput(""); setPinVerified(false); setPinMsg(null);
  }

  // ── Verify PIN ────────────────────────────────────────────────
  async function handleVerifyPin(e) {
    e.preventDefault();
    setPinMsg(null); setPinLoading(true);
    try {
      const res = await verifyPin(selectedCard.cardNumber, pinInput);
      const result = res.data;
      if (result === "PIN verified") {
        setPinVerified(true);
        setPinMsg({ type:"success", text:"✅ PIN verified. You can now proceed." });
      } else {
        setPinMsg({ type:"error", text:`❌ ${result}` });
        setPinInput("");
      }
    } catch(err) {
      setPinMsg({ type:"error", text: err.response?.data?.message || "PIN verification failed." });
    } finally { setPinLoading(false); }
  }

  // ── Pay Bill ──────────────────────────────────────────────────
  async function handlePayBill(e) {
    e.preventDefault(); setBillMsg(null); setBillLoad(true);
    try {
      const res = await payBill(selectedCard.cardNumber, parseFloat(billAmount));
      const updated = res.data;
      setSelected(updated);
      setCards(prev => prev.map(c => c.cardNumber === updated.cardNumber ? updated : c));
      setBillMsg({ type:"success",
        text:`✅ Bill payment of ₹${Number(billAmount).toLocaleString()} successful! Available limit: ₹${Number(updated.availableLimit).toLocaleString()}` });
      setBillAmount("");
      resetPin();
    } catch(err) {
      setBillMsg({ type:"error",
        text: err.response?.data?.message || err.response?.data || "Payment failed." });
    } finally { setBillLoad(false); }
  }

  // ── Cash Withdrawal ───────────────────────────────────────────
  async function handleWithdraw(e) {
    e.preventDefault(); setWithdrawMsg(null); setWdLoad(true);
    try {
      const res = await cashWithdrawal(selectedCard.cardNumber, parseFloat(withdrawAmount));
      const updated = res.data;
      setSelected(updated);
      setCards(prev => prev.map(c => c.cardNumber === updated.cardNumber ? updated : c));
      setWithdrawMsg({ type:"success",
        text:`✅ Cash withdrawal of ₹${Number(withdrawAmount).toLocaleString()} successful! Available limit: ₹${Number(updated.availableLimit).toLocaleString()}` });
      setWithdraw("");
      resetPin();
    } catch(err) {
      setWithdrawMsg({ type:"error",
        text: err.response?.data?.message || err.response?.data || "Withdrawal failed." });
    } finally { setWdLoad(false); }
  }

  if (cardsLoading) return <div style={{color:"var(--muted)"}}>Loading your cards...</div>;
  if (cards.length === 0) return (
    <>
      <div className="page-header"><h1>Card Services</h1></div>
      <div style={{color:"var(--muted)"}}>No active cards found. Apply for a card first.</div>
    </>
  );

  const outstanding = selectedCard ? Number(selectedCard.outstandingBill || 0) : 0;

  return (
    <>
      <div className="page-header">
        <h1>Card Services</h1>
        <p>Pay your credit card bill or withdraw cash.</p>
      </div>

      {/* Card Selector */}
      <div style={{maxWidth:"560px",marginBottom:"28px"}}>
        <label className="pp-label" style={{marginBottom:"8px",display:"block"}}>Select Card</label>
        <select className="pp-input"
          value={selectedCard ? String(selectedCard.cardNumber) : ""}
          onChange={handleCardChange}>
          {cards.map(c => (
            <option key={c.cardNumber} value={String(c.cardNumber)}>
              {c.cardType} •••• {String(c.cardNumber).slice(-4)} — {c.cardStatus}
            </option>
          ))}
        </select>
      </div>

      {selectedCard && (
        <>
          {/* Card Summary */}
          <div style={{
            display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
            gap:"12px",maxWidth:"700px",marginBottom:"32px"
          }}>
            {[
              { label:"Credit Limit",
                value:`₹${Number(selectedCard.creditLimit).toLocaleString()}` },
              { label:"Available Limit",
                value:`₹${Number(selectedCard.availableLimit).toLocaleString()}` },
              { label:"Outstanding Bill",
                value:`₹${outstanding.toLocaleString()}`,
                color: outstanding > 0 ? "var(--danger)" : "var(--success)" },
              { label:"Cash Withdraw Limit",
                value:`₹${Number(selectedCard.cashWithdrawalLimit||0).toLocaleString()}` },
              { label:"Per Day Limit",
                value:`₹${Number(selectedCard.perDayLimit).toLocaleString()}` },
              { label:"Card Status",
                value: selectedCard.cardStatus,
                color: statusColor[selectedCard.cardStatus] },
            ].map(item => (
              <div key={item.label} className="glass" style={{padding:"14px"}}>
                <div className="pp-label" style={{marginBottom:"4px"}}>{item.label}</div>
                <div style={{fontSize:"15px",fontWeight:700,color:item.color||"var(--white)"}}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* ── PIN Verification Gate ─────────────────────────── */}
          {!pinVerified ? (
            <div className="glass"
              style={{maxWidth:"380px",padding:"24px",marginBottom:"28px"}}>
              <h3 style={{marginBottom:"6px",fontSize:"16px"}}>🔐 Enter Card PIN</h3>
              <p style={{color:"var(--muted)",fontSize:"13px",marginBottom:"16px"}}>
                Verify your PIN to access card services.
              </p>

              {!selectedCard.pinSet ? (
                <div style={{
                  padding:"14px",borderRadius:"8px",
                  background:"rgba(245,166,35,0.1)",
                  color:"var(--warning)",fontSize:"13px"
                }}>
                  ⚠️ PIN not set. Please go to <strong>PIN Generation</strong> page first.
                </div>
              ) : (
                <>
                  {pinMsg && (
                    <div className={`pp-alert pp-alert-${pinMsg.type}`}
                      style={{marginBottom:"12px"}}>
                      {pinMsg.text}
                    </div>
                  )}
                  <form onSubmit={handleVerifyPin}
                    style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                    <input type="password" className="pp-input"
                      placeholder="Enter 4-digit PIN"
                      value={pinInput}
                      onChange={e => setPinInput(e.target.value)}
                      maxLength={4}
                      style={{letterSpacing:"8px",textAlign:"center",fontSize:"22px"}} />
                    <button className="pp-btn pp-btn-primary"
                      disabled={pinLoading || pinInput.length < 4}>
                      {pinLoading ? "Verifying..." : "Verify PIN →"}
                    </button>
                  </form>
                </>
              )}
            </div>

          ) : (
            /* ── Services unlocked after PIN ───────────────────── */
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",
              gap:"24px",maxWidth:"700px"}}>

              {/* ── Pay Bill ─────────────────────────────────── */}
              <div className="glass" style={{padding:"24px"}}>
                <h3 style={{marginBottom:"16px",fontSize:"16px"}}>💳 Pay Credit Card Bill</h3>

                {outstanding === 0 ? (
                  <div style={{
                    padding:"14px",borderRadius:"8px",
                    background:"rgba(0,196,140,0.1)",
                    color:"var(--success)",fontSize:"13px"
                  }}>
                    ✅ No outstanding bill. You're all clear!
                  </div>
                ) : (
                  <>
                    <div style={{
                      padding:"10px 14px",borderRadius:"8px",marginBottom:"14px",
                      background:"rgba(255,59,59,0.08)",
                      color:"var(--danger)",fontSize:"13px"
                    }}>
                      Outstanding: <strong>₹{outstanding.toLocaleString()}</strong>
                    </div>
                    {billMsg && (
                      <div className={`pp-alert pp-alert-${billMsg.type}`}
                        style={{marginBottom:"10px"}}>
                        {billMsg.text}
                      </div>
                    )}
                    <form onSubmit={handlePayBill}
                      style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                      <input type="number" className="pp-input"
                        placeholder={`Amount (max ₹${outstanding.toLocaleString()})`}
                        value={billAmount}
                        onChange={e => setBillAmount(e.target.value)}
                        min="1" max={outstanding} step="0.01" required />
                      <button className="pp-btn pp-btn-success" disabled={billLoading}>
                        {billLoading ? "Processing..." : "Pay Bill →"}
                      </button>
                      <button type="button" className="pp-btn pp-btn-ghost"
                        style={{fontSize:"12px"}}
                        onClick={() => setBillAmount(String(outstanding))}>
                        Pay Full Amount (₹{outstanding.toLocaleString()})
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* ── Cash Withdrawal ──────────────────────────── */}
              <div className="glass" style={{padding:"24px"}}>
                <h3 style={{marginBottom:"16px",fontSize:"16px"}}>🏧 Cash Withdrawal</h3>

                {selectedCard.cardStatus !== "Open" ? (
                  <div style={{
                    padding:"14px",borderRadius:"8px",
                    background:"rgba(255,59,59,0.08)",
                    color:"var(--danger)",fontSize:"13px"
                  }}>
                    ❌ Card is {selectedCard.cardStatus}. Cannot withdraw cash.
                  </div>
                ) : (
                  <>
                    <div style={{
                      padding:"10px 14px",borderRadius:"8px",marginBottom:"14px",
                      background:"rgba(0,212,255,0.08)",
                      color:"var(--muted)",fontSize:"13px"
                    }}>
                      Cash limit: <strong>
                        ₹{Number(selectedCard.cashWithdrawalLimit||0).toLocaleString()}
                      </strong>
                    </div>
                    {withdrawMsg && (
                      <div className={`pp-alert pp-alert-${withdrawMsg.type}`}
                        style={{marginBottom:"10px"}}>
                        {withdrawMsg.text}
                      </div>
                    )}
                    <form onSubmit={handleWithdraw}
                      style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                      <input type="number" className="pp-input"
                        placeholder="Enter amount to withdraw"
                        value={withdrawAmount}
                        onChange={e => setWithdraw(e.target.value)}
                        min="1" step="0.01" required />
                      <button className="pp-btn pp-btn-primary" disabled={withdrawLoading}>
                        {withdrawLoading ? "Processing..." : "Withdraw Cash →"}
                      </button>
                    </form>
                  </>
                )}
              </div>

            </div>
          )}
        </>
      )}
    </>
  );
}

export default CardServices;