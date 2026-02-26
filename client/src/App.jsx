import { BrowserRouter as Router, Routes, Route, useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Loading from './components/Loading';
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

// Lazy load pages
const Flights = lazy(() => import('./pages/Flights'));
const FlightBooking = lazy(() => import('./pages/FlightBooking'));
const Hotels = lazy(() => import('./pages/Hotels'));
const HotelDetail = lazy(() => import('./pages/HotelDetail'));
const HotelBooking = lazy(() => import('./pages/HotelBooking'));
const VisaPage = lazy(() => import('./pages/VisaPage'));
const VisaDetails = lazy(() => import('./pages/VisaDetails'));
const VisaApplication = lazy(() => import('./pages/VisaApplication'));
const Holidays = lazy(() => import('./pages/Holidays'));
const Buses = lazy(() => import('./pages/Buses'));
const BusBooking = lazy(() => import('./pages/BusBooking'));
const PackageDetails = lazy(() => import('./pages/PackageDetails'));
const Cruises = lazy(() => import('./pages/Cruises'));
const CruiseDetail = lazy(() => import('./pages/CruiseDetail'));
const CruiseBooking = lazy(() => import('./pages/CruiseBooking'));
const Cabs = lazy(() => import('./pages/Cabs'));
const CabBooking = lazy(() => import('./pages/CabBooking'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Services = lazy(() => import('./pages/Services'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Payment = lazy(() => import('./pages/Payment'));
const UpcomingTrips = lazy(() => import('./pages/UpcomingTrips'));
const Cancellations = lazy(() => import('./pages/Cancellations'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Travellers = lazy(() => import('./pages/Travellers'));
const Support = lazy(() => import('./pages/Support'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const LocationLogger = () => {
  const location = useLocation();
  useEffect(() => {
    console.log("[App] Current Location:", location.pathname, location.state);
  }, [location]);
  return null;
};

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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '10px', fontFamily: 'sans-serif' }
          }}
          containerStyle={{ zIndex: 99999 }}
        />
        <Router>
          <ScrollToTop />
          <Navbar />
          <LocationLogger />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Flights />} />
              <Route path="/flights" element={<Flights />} />
              <Route path="/flights/booking" element={<FlightBooking />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/booking" element={<HotelBooking />} />
              <Route path="/hotels/:id" element={<HotelDetail />} />
              <Route path="/visa" element={<VisaPage />} />
              <Route path="/visa/:id" element={<VisaDetails />} />
              <Route path="/visa/:id/apply" element={<VisaApplication />} />
              <Route path="/holidays" element={<Holidays />} />
              <Route path="/buses" element={<Buses />} />
              <Route path="/buses/:id/book" element={<BusBooking />} />
              <Route path="/packages/:id" element={<PackageDetails />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<Services />} />
              <Route path="/login" element={<Flights />} />
              <Route path="/register" element={<Flights />} />
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
          </Suspense>
        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
