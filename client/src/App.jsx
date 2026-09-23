import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminVisits from './pages/admin/AdminVisits';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUnits from './pages/admin/AdminUnits';
import AdminAmenities from './pages/admin/AdminAmenities';
import AgentDashboard from './pages/agent/AgentDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AgentRoute from './components/AgentRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              <Route path="/compare" element={<Compare />} />
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/properties" element={
                <AdminRoute>
                  <AdminProperties />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } />
              <Route path="/admin/enquiries" element={
                <AdminRoute>
                  <AdminEnquiries />
                </AdminRoute>
              } />
              <Route path="/admin/visits" element={
                <AdminRoute>
                  <AdminVisits />
                </AdminRoute>
              } />
              <Route path="/admin/bookings" element={
                <AdminRoute>
                  <AdminBookings />
                </AdminRoute>
              } />
              <Route path="/admin/units" element={
                <AdminRoute>
                  <AdminUnits />
                </AdminRoute>
              } />
              <Route path="/admin/amenities" element={<AdminRoute><AdminAmenities /></AdminRoute>} />
              <Route path="/agent/dashboard" element={<AgentRoute><AgentDashboard /></AgentRoute>} />
              <Route path="/agent/properties" element={<AgentRoute><AdminProperties /></AgentRoute>} />
              <Route path="/agent/units" element={<AgentRoute><AdminUnits /></AgentRoute>} />
              <Route path="/agent/enquiries" element={<AgentRoute><AdminEnquiries /></AgentRoute>} />
              <Route path="/agent/visits" element={<AgentRoute><AdminVisits /></AgentRoute>} />
              <Route path="/agent/bookings" element={<AgentRoute><AdminBookings /></AgentRoute>} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
