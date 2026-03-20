import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import DefaultRoute from "./Guards/DefaultRoute";
import UserLayout from "./Layout/UserLayout";
import AdminLayout from "./Layout/AdminLayout";
import UserDashboard from "./Pages/UserPages/Dashboard";
import AdminDashboard from "./Pages/AdminPages/Dashboard";
import MyBookings from "./Pages/UserPages/MyBookings";
import UserEvent from "./Pages/UserPages/Event";
import AdminEvent from "./Pages/AdminPages/Event";
import Profile from "./Pages/UserPages/Profile";
import Booking from "./Pages/AdminPages/Booking";
import AuthGuard from "./Guards/AuthGuard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthGuard requiredAuth={false}>
              <Login />
            </AuthGuard>
          }
        />
        <Route
          path="/register"
          element={
            <AuthGuard requiredAuth={false}>
              <Register />
            </AuthGuard>
          }
        />

        <Route path="/" element={<DefaultRoute />} />

        <Route path="user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="event" element={<UserEvent />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bookings" element={<Booking />} />
          <Route path="event" element={<AdminEvent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
