import { useNavigate } from "react-router-dom";
function Success() {
  const navigate = useNavigate();
  return (
    <div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div className="glass" style={{padding:"48px",textAlign:"center",maxWidth:"400px"}}>
        <div style={{fontSize:"64px",marginBottom:"16px"}}>✅</div>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"26px",fontWeight:"800",marginBottom:"8px"}}>Payment Successful</h2>
        <p style={{color:"var(--muted)",marginBottom:"28px"}}>Your transaction has been approved and processed.</p>
        <button className="pp-btn pp-btn-primary" onClick={()=>navigate("/dashboard")}>Back to Dashboard →</button>
      </div>
    </div>
  );
}
export default Success;
