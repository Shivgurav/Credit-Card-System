import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ApplyCard from "./pages/ApplyCard";
import Merchant from "./pages/Merchant";
import Transaction from "./pages/Transaction";
import CardStatus from "./pages/CardStatus";
import Success from "./pages/Success";
import Failure from "./pages/Failure";
import CardServices  from "./pages/CardServices";
import PinGeneration from "./pages/PinGeneration";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/success"   element={<Success />} />
          <Route path="/failure"   element={<Failure />} />

          <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/merchant"    element={<ProtectedRoute><Merchant /></ProtectedRoute>} />
          <Route path="/transaction" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
          <Route path="/card-status" element={<ProtectedRoute><CardStatus /></ProtectedRoute>} />

          <Route path="/card-services" element={<ProtectedRoute userOnly><Layout><CardServices/></Layout></ProtectedRoute>} />
          <Route path="/card-pin"      element={<ProtectedRoute userOnly><Layout><PinGeneration/></Layout></ProtectedRoute>} />

          {/* ✅ ADMIN cannot access Apply Card */}
          <Route path="/apply-card"  element={<ProtectedRoute adminOnly={false} userOnly={true}><ApplyCard /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;