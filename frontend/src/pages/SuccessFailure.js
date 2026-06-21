import { useNavigate } from "react-router-dom";

export function Success() {
  const navigate = useNavigate();
  return (
    <div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div className="glass" style={{padding:"48px",textAlign:"center",maxWidth:"400px"}}>
        <div style={{fontSize:"64px",marginBottom:"16px"}}>✅</div>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"26px",fontWeight:"800",marginBottom:"8px"}}>
          Payment Successful
        </h2>
        <p style={{color:"var(--muted)",marginBottom:"28px"}}>
          Your transaction has been approved and processed.
        </p>
        <button className="pp-btn pp-btn-primary" onClick={()=>navigate("/dashboard")}>
          Back to Dashboard →
        </button>
      </div>
    </div>
  );
}

export function Failure() {
  const navigate = useNavigate();
  return (
    <div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div className="glass" style={{padding:"48px",textAlign:"center",maxWidth:"400px"}}>
        <div style={{fontSize:"64px",marginBottom:"16px"}}>❌</div>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"26px",fontWeight:"800",marginBottom:"8px",color:"var(--danger)"}}>
          Payment Failed
        </h2>
        <p style={{color:"var(--muted)",marginBottom:"28px"}}>
          Your transaction was declined. Please check your card details or credit limit.
        </p>
        <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
          <button className="pp-btn pp-btn-primary" onClick={()=>navigate("/transaction")}>
            Try Again
          </button>
          <button className="pp-btn pp-btn-ghost" onClick={()=>navigate("/dashboard")}>
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Success;
