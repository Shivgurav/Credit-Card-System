import { useState } from "react";
import { postTransaction, getTransactionsByCard } from "../services/api";

function StatusBadge({ s }) {
  return <span className={`badge ${s === "APPROVED" ? "badge-success" : "badge-danger"}`}>{s}</span>;
}

function Transaction() {
  const role = localStorage.getItem("role") || "USER";
  const [tab, setTab]     = useState("post");
  const [form, setForm]   = useState({ cardNumber:"", merchantId:"", amount:"" });
  const [msg,  setMsg]    = useState(null);
  const [loading, setLoad]= useState(false);

  // ── History state ─────────────────────────────────────────────
  const [txns, setTxns]           = useState([]);
  const [cardSearch, setCardSearch] = useState("");
  const [searching, setSearching]   = useState(false);
  const [searched, setSearched]     = useState(false); //  track if search was done

  function handleChange(e) { setForm({...form,[e.target.name]:e.target.value}); }

  // ── Post Transaction ──────────────────────────────────────────
  async function handlePost(e) {
    e.preventDefault(); setMsg(null); setLoad(true);
    try {
      const payload = {
        cardNumber: Number(form.cardNumber),   // Long in backend
        merchantId: form.merchantId,
        amount:     parseFloat(form.amount),   // BigDecimal in backend
      };
      const res = await postTransaction(payload);  //  Live API
      const txn = res.data;                        // TransactionResponseDTO

      if (txn.status === "APPROVED") {
        setMsg({ type:"success", text:`✅ Transaction APPROVED! Auth Code: ${txn.authCode} — ${txn.message}` });
      } else {
        setMsg({ type:"error", text:`❌ Transaction DECLINED: ${txn.message}` });
      }
      setForm({ cardNumber:"", merchantId:"", amount:"" });
    } catch(err) {
      setMsg({ type:"error", text: err.response?.data?.message || "Transaction failed." });
    } finally { setLoad(false); }
  }

  // ── Search Transactions by Card ───────────────────────────────
  async function handleSearch(e) {
    e.preventDefault(); setSearching(true); setSearched(false);
    try {
      const res = await getTransactionsByCard(Number(cardSearch));  //  Live API
      setTxns(res.data || []);
      setSearched(true);
    } catch(err) {
      setTxns([]);
      setSearched(true);
      console.error("Failed to fetch transactions", err);
    } finally { setSearching(false); }
  }

  return (
    <>
      <div className="page-header">
        <h1>Transactions</h1>
        <p>{role === "ADMIN"
          ? "Search and monitor transactions by card number."
          : "Post a new transaction or view your transaction history."
        }</p>
      </div>

      {/* ── USER tabs ────────────────────────────────────────── */}
      {role === "USER" && (
        <div className="pp-tabs">
          {["post","history"].map(t => (
            <div key={t} className={`pp-tab ${tab===t?"active":""}`}
              onClick={() => { setTab(t); setMsg(null); }}>
              {t === "post" ? "💸 Post Transaction" : "🧾 Transaction History"}
            </div>
          ))}
        </div>
      )}

      {/* ── ADMIN tab header ─────────────────────────────────── */}
      {role === "ADMIN" && (
        <div className="pp-tabs">
          <div className="pp-tab active">🧾 Transaction History</div>
        </div>
      )}

      {/* ── POST TRANSACTION (USER only) ─────────────────────── */}
      {role === "USER" && tab === "post" && (
        <>
          {msg && <div className={`pp-alert pp-alert-${msg.type}`} style={{maxWidth:"520px"}}>{msg.text}</div>}
          <div className="glass" style={{maxWidth:"520px",padding:"32px"}}>
            <form onSubmit={handlePost}>
              <div className="form-group">
                <label className="pp-label">Card Number</label>
                <input name="cardNumber" value={form.cardNumber} onChange={handleChange}
                  className="pp-input" placeholder="16-digit card number"
                  maxLength={16} required />
              </div>
              <div className="form-group">
                <label className="pp-label">Merchant ID</label>
                <input name="merchantId" value={form.merchantId} onChange={handleChange}
                  className="pp-input" placeholder="M1000001" required />
              </div>
              <div className="form-group">
                <label className="pp-label">Amount (₹)</label>
                <input type="number" name="amount" value={form.amount} onChange={handleChange}
                  className="pp-input" placeholder="0.00" min="1" step="0.01" required />
              </div>
              <button className="pp-btn pp-btn-primary pp-btn-full" disabled={loading}>
                {loading ? "Processing..." : "Process Transaction →"}
              </button>
            </form>
          </div>
        </>
      )}

      {/* ── HISTORY (USER tab + ADMIN always) ────────────────── */}
      {(role === "ADMIN" || (role === "USER" && tab === "history")) && (
        <>
          {/* Search bar */}
          <form onSubmit={handleSearch}
            style={{display:"flex",gap:"10px",marginBottom:"20px",maxWidth:"480px"}}>
            <input className="pp-input" placeholder="Enter card number to search..."
              value={cardSearch} onChange={e => setCardSearch(e.target.value)} required />
            <button type="submit" className="pp-btn pp-btn-primary"
              style={{whiteSpace:"nowrap"}} disabled={searching}>
              {searching ? "Searching..." : "🔍 Search"}
            </button>
          </form>

          {/* Results */}
          {!searched && (
            <div className="glass" style={{padding:"40px",textAlign:"center",
              color:"var(--muted)",maxWidth:"480px"}}>
              Enter a card number and click Search to view transactions.
            </div>
          )}

          {searched && txns.length === 0 && (
            <div className="glass" style={{padding:"40px",textAlign:"center",
              color:"var(--muted)",maxWidth:"480px"}}>
              No transactions found for this card.
            </div>
          )}

          {searched && txns.length > 0 && (
            <div className="pp-table-wrap">
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>Txn ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Auth Code</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map(t => (
                    <tr key={t.transactionId}>
                      <td style={{color:"var(--muted)",fontFamily:"monospace"}}>
                        {t.transactionId}
                      </td>
                      <td style={{fontWeight:700}}>
                        ₹{Number(t.amount).toLocaleString()}
                      </td>
                      <td><StatusBadge s={t.status}/></td>
                      <td style={{fontFamily:"monospace",color:"var(--gold)"}}>
                        {t.authCode || "—"}
                      </td>
                      <td style={{color:"var(--muted)",fontSize:"13px"}}>
                        {t.message || "—"}
                      </td>
                      <td style={{color:"var(--muted)",fontSize:"13px"}}>
                        {t.transactionDate
                          ? new Date(t.transactionDate).toLocaleString("en-IN")
                          : "—"}
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

export default Transaction;