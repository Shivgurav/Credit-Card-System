import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import PublicNavbar from "./PublicNavbar";

const PUBLIC_PATHS = ["/", "/login", "/register", "/success", "/failure"];

function Layout({ children }) {
  const location  = useLocation();
  const isPublic  = PUBLIC_PATHS.includes(location.pathname);
  const loggedIn  = localStorage.getItem("login") === "true";
  const showDash  = loggedIn && !isPublic;

  if (showDash) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <div className="topbar">
            <span className="topbar-title">
              {location.pathname === "/dashboard"   && "Dashboard"}
              {location.pathname === "/apply-card"  && "Apply for a Card"}
              {location.pathname === "/transaction" && "Transactions"}
              {location.pathname === "/card-status" && "Card Status"}
              {location.pathname === "/merchant"    && "Merchant"}
            </span>
            <div className="topbar-right">
              <span style={{fontSize:"13px",color:"var(--muted)"}}>
                {new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}
              </span>
            </div>
          </div>
          <div className="page-content">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-layout">
      <PublicNavbar />
      <div className="public-content">{children}</div>
    </div>
  );
}

export default Layout;
