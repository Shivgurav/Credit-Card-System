import axios from "axios";

const AUTH_API = axios.create({
  baseURL: "http://192.168.0.139:8081",
  headers: { "Content-Type": "application/json" }
});

const MERCHANT_API = axios.create({
  baseURL: "http://192.168.0.139:8086",
  headers: { "Content-Type": "application/json" }
});

// ✅ New — Card Service
const CARD_API = axios.create({
  baseURL: "http://192.168.0.139:8082",
  headers: { "Content-Type": "application/json" }
});

// Attach token to all instances
[AUTH_API, MERCHANT_API, CARD_API].forEach(instance => {
  instance.interceptors.request.use(cfg => {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  });
});

// ── Auth (✅ Live - port 8081) ─────────────────────────────────────
export const loginUser    = (data) => AUTH_API.post("/auth/login", data);
export const registerUser = (data) => AUTH_API.post("/auth/signup", data);
export const requestOtp      = (email)               => AUTH_API.post(`/auth/request-otp?email=${email}`);
export const verifyOtp       = (email, otp)          => AUTH_API.post(`/auth/verify-otp?email=${email}&otp=${otp}`);
export const resetPassword   = (email, newPassword)  => AUTH_API.post(`/auth/reset-password?email=${email}&newPassword=${encodeURIComponent(newPassword)}`);
export const updateAddress   = (email, address)      => AUTH_API.put(`/auth/update-address?email=${email}&address=${encodeURIComponent(address)}`);
export const getUserByEmail  = (email)               => AUTH_API.get(`/auth/user?email=${email}`);

// ── Merchants (✅ Live - port 8083) ───────────────────────────
export const registerMerchant = (data) => MERCHANT_API.post("/merchants", data);
export const getAllMerchants   = ()     => MERCHANT_API.get("/merchants/allmerchants");
export const getMerchantById  = (id)   => MERCHANT_API.get(`/merchants/${id}`);
export const validateMerchant = (id)   => MERCHANT_API.get(`/merchants/validate/${id}`);
// ❌ Removed — no approve/reject endpoints in backend


// ── Cards (✅ Live - port 8082) ────────────────────────────────────
export const applyCard               = (data)      => CARD_API.post("/cards/apply", data);
export const getPendingApplications  = ()          => CARD_API.get("/cards/applications/pending");
export const getAllApplications       = ()          => CARD_API.get("/cards/applications");
export const reviewApplication       = (id, data)  => CARD_API.put(`/cards/applications/${id}/review`, data);
export const getCard                 = (num)       => CARD_API.get(`/cards/${num}`);
export const updateCardStatus        = (data)      => CARD_API.put("/cards/status", data);

// ── New card endpoints ────────────────────────────────────────
export const payBill          = (cardNumber, amount) => CARD_API.put(`/cards/${cardNumber}/pay-bill`, { amount });
export const requestPinOtp    = (cardNumber)         => CARD_API.post(`/cards/${cardNumber}/request-pin-otp`);
export const setPin           = (cardNumber, otp, pin) => CARD_API.post(`/cards/${cardNumber}/set-pin?otp=${otp}&pin=${pin}`);
export const verifyPin = (cardNumber, pin) => 
    CARD_API.post(`/cards/${cardNumber}/verify-pin?pin=${pin}`);
export const cashWithdrawal = (cardNumber, amount) => 
    CARD_API.put(`/cards/${cardNumber}/cash-withdrawal`, { amount });

// ── Customers (🔴 Not ready yet) ──────────────────────────────────
// export const registerCustomer = (data) => API.post("/customers", data);
// export const getAllCustomers   = ()     => API.get("/customers");
// export const getCustomerById  = (id)   => API.get(`/customers/${id}`);

const TRANSACTION_API = axios.create({ 
  baseURL: "http://192.168.0.139:8085", 
  headers: { "Content-Type": "application/json" } 
});

TRANSACTION_API.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Transactions (✅ Live - port 8085)
export const postTransaction     = (data)       => TRANSACTION_API.post("/transactions", data);
export const getTransactionsByCard = (cardNumber) => TRANSACTION_API.get(`/transactions/${cardNumber}`);

export default CARD_API;