import { BrowserRouter as Router, Routes, Route, useParams, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Flights from './pages/Flights';
import FlightBooking from './pages/FlightBooking';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import HotelBooking from './pages/HotelBooking';
import Login from './pages/Login';
import Register from './pages/Register';

import VisaPage from './pages/VisaPage';
import VisaDetails from './pages/VisaDetails';
import VisaApplication from './pages/VisaApplication';
import Holidays from './pages/Holidays';
import Buses from './pages/Buses';
import BusBooking from './pages/BusBooking';
import PackageDetails from './pages/PackageDetails';
import Cruises from './pages/Cruises';
import CruiseDetail from './pages/CruiseDetail';
import CruiseBooking from './pages/CruiseBooking';
import Cabs from './pages/Cabs';
import CabBooking from './pages/CabBooking';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import Services from './pages/Services';
import AdminDashboard from './pages/AdminDashboard';
import MyBookings from './pages/MyBookings';
import UserDashboard from './pages/UserDashboard';
import Payment from './pages/Payment';
import UpcomingTrips from './pages/UpcomingTrips';
import Cancellations from './pages/Cancellations';
import Wallet from './pages/Wallet';
import Travellers from './pages/Travellers';
import Support from './pages/Support';
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

/* Coming Soon placeholder for Cruise & Cabs */
const ComingSoon = () => {
  const { page } = useParams();
  const title = page ? page.charAt(0).toUpperCase() + page.slice(1) : 'This Page';
  return (
    <>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
          <span className="text-4xl">🚀</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{title} — Coming Soon!</h1>
        <p className="text-gray-600 max-w-md mb-8">We're working on bringing you the best {title.toLowerCase()} booking experience. Stay tuned!</p>
        <Link to="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          Back to Home
        </Link>
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '10px', fontFamily: 'sans-serif' } }} />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Flights />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/flights/booking" element={<FlightBooking />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/hotels/booking" element={<HotelBooking />} />
            <Route path="/visa" element={<VisaPage />} />
            <Route path="/visa/:id" element={<VisaDetails />} />
            <Route path="/visa/:id/apply" element={<VisaApplication />} />
            <Route path="/holidays" element={<Holidays />} />
            <Route path="/buses" element={<Buses />} />
            <Route path="/buses/:id/book" element={<BusBooking />} />
            <Route path="/packages/:id" element={<PackageDetails />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/cruise" element={<Cruises />} />
            <Route path="/cruise/:id" element={<CruiseDetail />} />
            <Route path="/cruise/booking" element={<CruiseBooking />} />
            <Route path="/cabs" element={<Cabs />} />
            <Route path="/cabs/booking" element={<CabBooking />} />

            {/* Dashboard and Profile Routes */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Sub-dashboard routes */}
            <Route path="/dashboard/upcoming" element={<ProtectedRoute><UpcomingTrips /></ProtectedRoute>} />
            <Route path="/dashboard/cancellations" element={<ProtectedRoute><Cancellations /></ProtectedRoute>} />
            <Route path="/dashboard/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="/dashboard/travellers" element={<ProtectedRoute><Travellers /></ProtectedRoute>} />
            <Route path="/support" element={<Support />} />

            {/* Catch-all route */}
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
