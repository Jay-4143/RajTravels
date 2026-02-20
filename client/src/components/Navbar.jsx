import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";
import { FaPlane, FaHotel, FaBriefcase, FaUmbrellaBeach, FaBus, FaShip, FaCar, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", path: "/", label: "Flights", Icon: FaPlane },
  { to: "/hotels", path: "/hotels", label: "Hotel", Icon: FaHotel },
  { to: "/visa", path: "/visa", label: "Visa", Icon: FaBriefcase },
  { to: "/holidays", path: "/holidays", label: "Holidays", Icon: FaUmbrellaBeach },
  { to: "/buses", path: "/buses", label: "Bus", Icon: FaBus },
  { to: "/cruise", path: "/cruise", label: "Cruise", Icon: FaShip },
  { to: "/cabs", path: "/cabs", label: "Cabs", Icon: FaCar },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();
  const { user, logout } = useAuth();
  const isFlights = location.pathname === "/" || location.pathname === "/flights";

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            TravelGO
          </Link>

          {/* Center nav - desktop */}
          <div className="hidden lg:flex items-end gap-1 xl:gap-2">
            {navItems.map(({ to, path, label, Icon }) => {
              const active = path === "/" ? isFlights : location.pathname === path;
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={`flex flex-col items-center pt-2 pb-1.5 px-3 xl:px-4 rounded-t-lg transition-colors border-b-2 ${active ? "text-blue-600 border-blue-600" : "text-gray-700 border-transparent hover:text-blue-600"
                    }`}
                >
                  <Icon className="w-5 h-5 mb-0.5" />
                  <span className="text-xs font-medium whitespace-nowrap">{label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Right: Currency + Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span className="text-base">🇮🇳</span>
                <span>IND | INR</span>
                <HiChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {currencyOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCurrencyOpen(false)} aria-hidden="true" />
                  <div className="absolute right-0 mt-1 w-40 py-1 bg-white border rounded-lg shadow-lg z-20">
                    <button type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">IND | INR</button>
                    <button type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">USD | USD</button>
                  </div>
                </>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                  <HiChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} aria-hidden="true" />
                    <div className="absolute right-0 mt-1 w-48 py-1 bg-white border rounded-lg shadow-lg z-20">
                      <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                        My Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                <FaUser className="w-4 h-4" />
                LOGIN / REGISTER
              </Link>
            )}

          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-white shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navItems.map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 py-2.5 text-gray-700 font-medium hover:text-blue-600"
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t flex flex-col gap-2">
              <div className="px-2 py-2 text-sm text-gray-500">IND | INR</div>

              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-sm font-medium">
                    My Profile
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="px-2 py-2 text-sm font-medium text-red-600 text-left">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-semibold rounded-lg">
                  <FaUser /> LOGIN / REGISTER
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
