import { Link, useLocation, useNavigate } from "react-router-dom";

const USER_LINKS = [
  { to:"/dashboard",     icon:"🏠", label:"Dashboard"      },
  { to:"/apply-card",    icon:"💳", label:"Apply Card"      },
  { to:"/transaction",   icon:"💸", label:"Transactions"    },
  { to:"/card-status",   icon:"🪪", label:"My Cards"        },
  { to:"/card-services", icon:"🏦", label:"Card Services"   }, // ✅ new
  { to:"/card-pin",      icon:"🔐", label:"PIN Generation"  }, // ✅ new
  { to:"/merchant",      icon:"🏪", label:"Merchant"        },
];

const ADMIN_LINKS = [
  { to: "/dashboard",   icon: "📊", label: "Overview" },
  { to: "/merchant",    icon: "🏪", label: "Merchants" },
  { to: "/transaction", icon: "💸", label: "Transactions" },
  { to: "/card-status", icon: "💳", label: "Manage Cards" },
];

function Sidebar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const role      = localStorage.getItem("role") || "USER";
  const username  = localStorage.getItem("username") || "User";
  const links     = role === "ADMIN" ? ADMIN_LINKS : USER_LINKS;

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-text">💳 PayPanda</div>
        <div className="logo-sub">Payment Platform</div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">
          {role === "ADMIN" ? "Admin Panel" : "My Account"}
        </div>
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`sidebar-link ${location.pathname === l.to ? "active" : ""}`}
          >
            <span className="link-icon">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="user-name">{username}</div>
            {/* <div className="user-role">{role}</div> */}
          </div>
        </div>
        <button className="pp-btn pp-btn-ghost pp-btn-full" onClick={handleLogout}>
           Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
