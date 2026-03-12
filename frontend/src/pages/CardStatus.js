import { useState, useEffect } from "react";
import { getCard, updateCardStatus, getAllApplications } from "../services/api";

const STATUSES = ["Open", "Blocked", "Closed"];

function CardStatus() {
  const role  = localStorage.getItem("role") || "USER";
  const email = localStorage.getItem("email") || "";

  // ── Admin state ───────────────────────────────────────────────
  const [cardNumber, setCardNumber] = useState("");
  const [card, setCard]       = useState(null);
  const [status, setStatus]   = useState("");
  const [searching, setSearching] = useState(false);
  const [loading, setLoad]    = useState(false);
  const [msg, setMsg]         = useState(null);

  // ── User state ────────────────────────────────────────────────
  const [userCards, setUserCards]     = useState([]);
  const [cardsLoading, setCardsLoading] = useState(false);

  const statusColor = { Open:"var(--success)", Blocked:"var(--warning)", Closed:"var(--danger)" };

  // ── Fetch user's cards on mount ───────────────────────────────
  useEffect(() => {
    if (role === "USER") fetchUserCards();
  }, []);

  async function fetchUserCards() {
    setCardsLoading(true);
    try {
      // Get all approved applications for this user's email
      const res = await getAllApplications();
      const allApps = res.data || [];

      // Filter by logged-in user's email + only APPROVED (card issued)
      const myApprovedApps = allApps.filter(
        a => a.email === email && a.applicationStatus === "APPROVED" && a.cardNumber
      );

      // Fetch full card details for each approved application
      const cardDetails = await Promise.all(
        myApprovedApps.map(a => getCard(Number(a.cardNumber)).then(r => r.data))
      );

      setUserCards(cardDetails);
    } catch (err) {
      console.error("Failed to fetch user cards", err);
    } finally { setCardsLoading(false); }
  }

  // ── Admin: search card ────────────────────────────────────────
  async function handleSearch(e) {
    e.preventDefault();
    setMsg(null); setCard(null); setSearching(true);
    try {
      const res = await getCard(Number(cardNumber));
      setCard(res.data);
      setStatus(res.data.cardStatus);
    } catch (err) {
      setMsg({ type:"error", text: err.response?.data?.message || "Card not found." });
    } finally { setSearching(false); }
  }

  async function handleUpdate(e) {
    e.preventDefault(); setLoad(true); setMsg(null);
    try {
      const res = await updateCardStatus({ cardNumber: Number(card.cardNumber), status });
      setCard(res.data);
      setStatus(res.data.cardStatus);
      setMsg({ type:"success", text:`✅ Card status updated to ${status}` });
    } catch(err) {
      setMsg({ type:"error", text: err.response?.data?.message || "Update failed." });
    } finally { setLoad(false); }
  }

  // ── USER VIEW ─────────────────────────────────────────────────
  if (role === "USER") {
    return (
      <>
       <div className="page-header" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1>My Cards</h1>
          <p>View all credit cards issued to your account.</p>
        </div>
        <button className="pp-btn pp-btn-ghost" onClick={fetchUserCards} disabled={cardsLoading}>
          {cardsLoading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

        {cardsLoading ? (
          <div style={{color:"var(--muted)"}}>Loading your cards...</div>
        ) : userCards.length === 0 ? (
          <div style={{color:"var(--muted)"}}>
            No cards issued yet. Your approved applications will appear here.
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:"32px"}}>
            {userCards.map(c => (
              <div key={c.cardNumber}>
                {/* Visual Card */}
                <div style={{marginBottom:"20px"}}>
                  <div className="card-container">
                    <div className="card-inner">
                      <div className="card-front">
                        <div className="card-top">
                          <div className="card-chip"></div>
                          <span className="card-brand">{c.cardType}</span>
                        </div>
                        <div className="card-number">
                          {String(c.cardNumber).replace(/(.{4})/g,"$1 ").trim()}
                        </div>
                        <div className="card-bottom">
                          <div>
                            <small style={{opacity:.7}}>CARD HOLDER</small><br/>
                            {c.customerName}
                          </div>
                          <div>
                            <small style={{opacity:.7}}>EXPIRES</small><br/>
                            {c.expiryDate ? `${c.expiryDate.slice(2)}/${c.expiryDate.slice(0,2)}` : "—"}
                          </div>
                        </div>
                      </div>
                      <div className="card-back">
                        <div className="black-strip"></div>
                        <div className="cvv-box">
                          <small>CVV</small>
                          <div className="cvv-number">•••</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Info Grid */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"12px",maxWidth:"700px"}}>
                  {[
                    { label:"Card Type",       value: c.cardType },
                    { label:"Credit Limit",    value: `₹${Number(c.creditLimit).toLocaleString()}` },
                    { label:"Available Limit", value: `₹${Number(c.availableLimit).toLocaleString()}` },
                    { label:"Per Day Limit",   value: `₹${Number(c.perDayLimit).toLocaleString()}` },
                    { label:"Expiry",          value: c.expiryDate ? `${c.expiryDate.slice(2)}/${c.expiryDate.slice(0,2)}` : "—" },
                    { label:"Status",          value: c.cardStatus, color: statusColor[c.cardStatus] },
                  ].map(item => (
                    <div key={item.label} className="glass" style={{padding:"14px"}}>
                      <div className="pp-label" style={{marginBottom:"4px"}}>{item.label}</div>
                      <div style={{fontSize:"15px",fontWeight:700,color:item.color||"var(--white)"}}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  // ── ADMIN VIEW ────────────────────────────────────────────────
  return (
    <>
      <div className="page-header">
        <h1>Card Status Management</h1>
        <p>Search a card by number and update its lifecycle status.</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{display:"flex",gap:"10px",maxWidth:"480px",marginBottom:"28px"}}>
        <input className="pp-input" placeholder="Enter 16-digit card number..."
          value={cardNumber} onChange={e=>setCardNumber(e.target.value)}
          maxLength={16} required />
        <button type="submit" className="pp-btn pp-btn-primary" style={{whiteSpace:"nowrap"}} disabled={searching}>
          {searching ? "Searching..." : "🔍 Search"}
        </button>
      </form>

      {msg && !card && (
        <div className={`pp-alert pp-alert-${msg.type}`} style={{maxWidth:"480px"}}>{msg.text}</div>
      )}

      {card && (
        <>
          {/* Visual Card */}
          <div style={{marginBottom:"28px"}}>
            <div className="card-container" style={{animation:"floatCard 4s ease-in-out infinite"}}>
              <div className="card-inner">
                <div className="card-front">
                  <div className="card-top">
                    <div className="card-chip"></div>
                    <span className="card-brand">{card.cardType}</span>
                  </div>
                  <div className="card-number">
                    {String(card.cardNumber).replace(/(.{4})/g,"$1 ").trim()}
                  </div>
                  <div className="card-bottom">
                    <div>
                      <small style={{opacity:.7}}>CARD HOLDER</small><br/>
                      {card.customerName || "—"}
                    </div>
                    <div>
                      <small style={{opacity:.7}}>EXPIRES</small><br/>
                      {card.expiryDate ? `${card.expiryDate.slice(2)}/${card.expiryDate.slice(0,2)}` : "—"}
                    </div>
                  </div>
                </div>
                <div className="card-back">
                  <div className="black-strip"></div>
                  <div className="cvv-box">
                    <small>CVV</small>
                    <div className="cvv-number">•••</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Info Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"14px",marginBottom:"28px",maxWidth:"700px"}}>
            {[
              { label:"Card Type",       value: card.cardType },
              { label:"Credit Limit",    value: `₹${Number(card.creditLimit).toLocaleString()}` },
              { label:"Available Limit", value: `₹${Number(card.availableLimit).toLocaleString()}` },
              { label:"Per Day Limit",   value: `₹${Number(card.perDayLimit).toLocaleString()}` },
              { label:"Expiry Date",     value: card.expiryDate ? `${card.expiryDate.slice(2)}/${card.expiryDate.slice(0,2)}` : "—" },
              { label:"Current Status",  value: card.cardStatus, color: statusColor[card.cardStatus] },
            ].map(item => (
              <div key={item.label} className="glass" style={{padding:"16px"}}>
                <div className="pp-label" style={{marginBottom:"6px"}}>{item.label}</div>
                <div style={{fontSize:"16px",fontWeight:700,color:item.color||"var(--white)"}}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Update Status — ADMIN ONLY */}
          {msg && (
            <div className={`pp-alert pp-alert-${msg.type}`} style={{maxWidth:"400px"}}>{msg.text}</div>
          )}
          <div className="glass" style={{maxWidth:"400px",padding:"24px"}}>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="pp-label">Update Status</label>
                <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginTop:"8px"}}>
                  {STATUSES.map(s => (
                    <div key={s}
                      className={`card-type-btn ${status===s?"active":""}`}
                      style={{
                        flex:"1", minWidth:"90px", textAlign:"center",
                        borderColor: status===s ? statusColor[s] : undefined,
                        color:       status===s ? statusColor[s] : undefined,
                        background:  status===s ? `${statusColor[s]}18` : undefined
                      }}
                      onClick={() => setStatus(s)}>
                      {s==="Open" ? "🟢" : s==="Blocked" ? "🟡" : "🔴"}<br/>
                      <small>{s}</small>
                    </div>
                  ))}
                </div>
              </div>
              <button className="pp-btn pp-btn-primary pp-btn-full"
                disabled={loading || status === card.cardStatus}
                style={{marginTop:"12px"}}>
                {loading ? "Updating..." : "Update Status →"}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default CardStatus;