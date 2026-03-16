import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <AuthGuard requiredAuth={false}>
          <Login />
        </AuthGuard>
      ),
    },
    {
      path: "/register",
      element: (
        <AuthGuard requiredAuth={false}>
          <Register />
        </AuthGuard>
      ),
    },
    {
      path: "/",
      element: <DefaultRoute />,
    },

    // User Routes
    {
      path: "user",
      element: <UserLayout />,
      children: [
        { path: "dashboard", element: <UserDashboard /> },
        { path: "my-bookings", element: <MyBookings /> },
        { path: "event", element: <UserEvent /> },
        { path: "profile", element: <Profile /> },
      ],
    },

    {
      path: "admin",
      element: <AdminLayout />,
      children: [
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "bookings", element: <Booking /> },
        { path: "event", element: <AdminEvent /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
