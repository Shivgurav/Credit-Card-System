import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🏪",
    color: "rgba(29,106,255,0.15)",
    label: "Merchant Onboarding",
    desc: "Easily add and manage merchants on the platform."
  },
  {
    icon: "💸",
    color: "rgba(0,196,140,0.15)",
    label: "Fast Transactions",
    desc: "Make secure and quick card payments anytime."
  },
  {
    icon: "🔒",
    color: "rgba(245,166,35,0.15)",
    label: "Card Management",
    desc: "Manage your credit cards and update their status whenever needed."
  },
  {
    icon: "📊",
    color: "rgba(0,212,255,0.15)",
    label: "Admin Dashboard",
    desc: "View important activities and manage the system from one place."
  }
];

const BADGES = [
  { emoji:"✅", text:"Approved",    top:"-14%", left:"8%",  color:"rgba(0,196,140,0.2)",  border:"rgba(0,196,140,0.5)"  },
  { emoji:"💳", text:"VISA Card",   top:"25%",  left:"82%", color:"rgba(29,106,255,0.2)", border:"rgba(29,106,255,0.5)" },
  { emoji:"⚡", text:"Instant Pay", top:"72%",  left:"2%",  color:"rgba(245,166,35,0.2)", border:"rgba(245,166,35,0.5)" },
  { emoji:"🔒", text:"Secure",      top:"105%", left:"70%", color:"rgba(0,212,255,0.2)",  border:"rgba(0,212,255,0.5)"  },
];

function Home() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{
        display        : "flex",
        alignItems     : "center",
        justifyContent : "space-between",
        minHeight      : "88vh",
        padding        : "0 6%",
        gap            : "40px",
        position       : "relative",
        overflow       : "hidden",
      }}>

        {/* ── LEFT: Text ───────────────────────────── */}
        <div style={{flex:"1", maxWidth:"520px", zIndex:1}}>
          <h1 style={{
            fontFamily : "Arial, Helvetica, sans-serif",
            fontSize   : "clamp(36px, 4.5vw, 58px)",
            fontWeight : 800,
            lineHeight : 1.1,
            margin     : 0,
          }}>
            Apply Register{" "}
            <span style={{color:"var(--blue-light)"}}>Transact</span>
          </h1>

          <h2 style={{
            fontFamily : "Arial, Helvetica, sans-serif",
            fontSize   : "clamp(28px, 3.2vw, 44px)",
            fontWeight : 700,
            color      : "var(--muted)",
            margin     : "10px 0 24px 0",
          }}>
            All with{" "}
            <span style={{color:"var(--blue-light)"}}>PayPanda</span>
          </h2>

          <p style={{
            fontSize  : "15px",
            lineHeight: 1.8,
            color     : "var(--muted)",
            maxWidth  : "440px",
            margin    : "0 0 36px 0",
          }}>
            Apply for a credit card, register your merchant, and process
            payments instantly. PayPanda brings card management and
            transactions together in one secure platform.
          </p>

          <div style={{display:"flex", gap:"16px", flexWrap:"wrap"}}>
            <Link to="/register" className="pp-btn pp-btn-primary"
              style={{fontSize:"16px", padding:"14px 32px"}}>
              Get Started →
            </Link>
            <Link to="/login" className="pp-btn pp-btn-ghost"
              style={{fontSize:"16px", padding:"14px 32px"}}>
              Login
            </Link>
          </div>
        </div>

        {/* ── RIGHT: Card + Badges ─────────────────── */}
        <div style={{
          flex           : "1",
          display        : "flex",
          alignItems     : "center",
          justifyContent : "center",
          position       : "relative",
          minHeight      : "320px",
          zIndex         : 1,
        }}>
          {BADGES.map((b, i) => (
            <div key={b.text} style={{
              position       : "absolute",
              top            : b.top,
              left           : b.left,
              background     : b.color,
              border         : `1px solid ${b.border}`,
              borderRadius   : "20px",
              padding        : "7px 16px",
              display        : "flex",
              alignItems     : "center",
              gap            : "6px",
              fontSize       : "13px",
              fontWeight     : 600,
              color          : "var(--text)",
              whiteSpace     : "nowrap",
              backdropFilter : "blur(10px)",
              boxShadow      : `0 4px 20px ${b.border}`,
              animation      : "floatBadge 3s ease-in-out infinite",
              animationDelay : `${i * 0.7}s`,
              zIndex         : 10,
            }}>
              <span>{b.emoji}</span> {b.text}
            </div>
          ))}

          <div className="card-container">
            <div className="card-inner">
              <div className="card-front">
                <div className="card-top">
                  <div className="card-chip"></div>
                  <span className="card-brand">CARD</span>
                </div>
                <div className="card-number">**** **** **** 1234</div>
                <div className="card-bottom">
                  <div>
                    <small style={{opacity:.7}}>CARD HOLDER</small><br/>
                    PAYPANDA USER
                  </div>
                  <div>
                    <small style={{opacity:.7}}>EXPIRES</small><br/>
                    12/28
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
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="features-section" id="features">
        <div style={{textAlign:"center", marginBottom:"16px"}}>
          <div className="hero-badge" style={{display:"inline-flex"}}>PayPanda Features</div>
        </div>
        <h2 style={{
          fontFamily : "Arial, Helvetica, sans-serif",
          fontSize   : "36px",
          fontWeight : "800",
          textAlign  : "center"
        }}>
          Everything you need to process payments
        </h2>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.label} className="feature-card">
              <div className="feature-icon" style={{background:f.color}}>{f.icon}</div>
              <h3>{f.label}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="pub-footer" id="about">
        <div className="footer-logo">💳 PayPanda</div>
        <div className="footer-copy">© 2026 PayPanda</div>
      </footer>

      {/* ── ANIMATION ────────────────────────────────── */}
      <style>{`
        @keyframes floatBadge {
          0%   { transform: translateY(0px);  }
          50%  { transform: translateY(-8px); }
          100% { transform: translateY(0px);  }
        }
      `}</style>
    </>
  );
}

export default Home;