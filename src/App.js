import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import ReportingPage from "./components/ReportingPage";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component
import UnauthorizedPage from "./components/UnauthorizedPage"; // Optional: For unauthorized users
import ClientHomePage from "./components/ClientHomePage";
import EditProfilePage from "./components/EditProfilePage";
import EditProfileAdmin from "./components/EditProfilePageAdmin"
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import OrderEdit from "./components/OrderEdit";
import CreateMeasurment from "./components/CreateMeasurement";
import MeasurementViewPage from "./components/MeasurementViewPage";
import MeasurementUpdatePage from "./components/MeasurementUpdatePage";
import AdminDashboard from "./components/AdminDashboardAndOrders";
import ClientList from "./components/AdminUserProfileList";
import ViewProfileAdmin from "./components/AdminProfileView";

import "./styles/global.css";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/login" element={<div>Biodata submitted successfully!</div>}/> */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />{" "}
      {/* Optional Unauthorized Route */}
      <Route path="/reporting" element={<ReportingPage />} />
      {/* Success page after submission */}
      <Route
        path="/success"
        element={<div>Biodata submitted successfully!</div>}
      />
      <Route
        path="/client-home"
        element={
          <PrivateRoute role="client">
            <ClientHomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-profile"
        element={
          <PrivateRoute role="client">
            <EditProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users/edit/:ProfileId"
        element={
          <PrivateRoute role="admin">
            <EditProfileAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users/view/:ProfileId"
        element={
          <PrivateRoute role="admin">
            <ViewProfileAdmin />
          </PrivateRoute>
        }
      />
      <Route path="/orders" element={<OrderList />} />
      <Route path="/neworders" element={<OrderForm />} />
      <Route path="/orders/edit/:orderId" element={<OrderEdit />} />
      <Route path="/createmeasurement/:username" element={<CreateMeasurment />} />
      <Route path="/measurements/update/:username" element={<MeasurementUpdatePage />} />
      <Route path="/measurements/view/:username" element={<MeasurementViewPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/clients"
        element={
          <PrivateRoute role="admin">
            <ClientList />
          </PrivateRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
