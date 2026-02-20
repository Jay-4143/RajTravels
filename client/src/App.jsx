import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Flights />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/flights/booking" element={<FlightBooking />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/hotels/booking" element={<HotelBooking />} />
          <Route path="/hotels/booking" element={<HotelBooking />} />
          <Route path="/visa" element={<VisaPage />} />
          <Route path="/visa/:id" element={<VisaDetails />} />
          <Route path="/visa/:id/apply" element={<VisaApplication />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/buses" element={<Buses />} />
          <Route path="/buses/:id/book" element={<BusBooking />} />
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

