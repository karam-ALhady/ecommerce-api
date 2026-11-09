
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Notifications from "./pages/Notifications";
function App() {
    return (
        <BrowserRouter>
            <nav style={{
                padding: "15px",
                background: "#1e293b",
                display: "flex",
                gap: "20px"
            }}>
                <Link to="/" style={{ color: "white" }}>Products</Link>
                <Link to="/login" style={{ color: "white" }}>Login</Link>
                <Link to="/register" style={{ color: "white" }}>Register</Link>
                <Link to="/profile" style={{ color: "white" }}>Profile</Link>
                <Link to="/orders" style={{ color: "white" }}>Orders</Link>
                <Link to="/notifications" style={{ color: "white" }}>Notifications</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Products />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/notifications" element={<Notifications />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
