import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";
import { FaPlane, FaHotel, FaBriefcase, FaUmbrellaBeach, FaBus, FaShip, FaCar, FaUser, FaUserShield, FaSuitcase, FaTicketAlt, FaWallet, FaTimesCircle, FaUsers, FaRupeeSign, FaEdit, FaSignOutAlt, FaThLarge, FaHeadset } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useGlobal, currencies } from "../context/GlobalContext";
import LoginModal from "./LoginModal";

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
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const location = useLocation();
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useGlobal();
  const isFlights = location.pathname === "/" || location.pathname === "/flights";

  return (
    <>
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
                  <span className="text-base">{currency.flag}</span>
                  <span>{currency.label}</span>
                  <HiChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {currencyOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setCurrencyOpen(false)} aria-hidden="true" />
                    <div className="absolute right-0 mt-2 w-56 py-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-20 max-h-[400px] overflow-y-auto">
                      <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Select Currency</div>
                      {currencies.map((curr) => (
                        <button
                          key={curr.code}
                          type="button"
                          onClick={() => {
                            setCurrency(curr);
                            setCurrencyOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${currency.code === curr.code ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <span className="text-lg">{curr.flag}</span>
                          <span className="flex-1 text-left">{curr.label}</span>
                          {currency.code === curr.code && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                        </button>
                      ))}
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
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-2xl z-20 overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-800 truncate uppercase tracking-tighter">{user.email}</p>
                          </div>
                        </div>
                        <div className="py-1">
                          {[
                            { to: "/dashboard", label: "Dashboard", Icon: FaThLarge },
                            { to: "/my-bookings", label: "My Bookings", Icon: FaTicketAlt },
                            { to: "/dashboard/upcoming", label: "Upcoming Trips", Icon: FaSuitcase },
                            { to: "/profile", label: "My Profile", Icon: FaUser },
                            { to: "/dashboard/wallet", label: "My Wallet Balance", Icon: FaWallet },
                            { to: "/dashboard/cancellations", label: "View Cancellations", Icon: FaTimesCircle },
                            { to: "/dashboard/travellers", label: "Travellers", Icon: FaUsers },
                            { to: "/payment", label: "Make Payment", Icon: FaRupeeSign },
                            { to: "/support", label: "Help & Support", Icon: FaHeadset },
                          ].map((item) => (
                            <Link
                              key={item.label}
                              to={item.to}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              <item.Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
                              {item.label}
                            </Link>
                          ))}

                          {user?.role === 'admin' && (
                            <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 border-y border-indigo-100">
                              <FaUserShield className="w-3.5 h-3.5" /> Admin Panel
                            </Link>
                          )}

                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-white bg-red-500 hover:bg-red-600 uppercase tracking-[0.2em] transition-colors"
                          >
                            <FaSignOutAlt className="w-3.5 h-3.5" /> Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  <FaUser className="w-4 h-4" />
                  LOGIN / REGISTER
                </button>
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
                <div className="px-2 py-2 text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>{currency.flag}</span>
                  <span>{currency.label}</span>
                </div>
                {/* Mobile Currency List */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => setCurrency(curr)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${currency.code === curr.code ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                    >
                      {curr.flag} {curr.code}
                    </button>
                  ))}
                </div>

                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-sm font-medium">
                      My Profile
                    </Link>
                    <Link to="/bookings" onClick={() => setMobileOpen(false)} className="px-2 py-2 text-sm font-medium">
                      My Bookings
                    </Link>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="px-2 py-2 text-sm font-medium text-red-600 text-left">
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setLoginModalOpen(true); setMobileOpen(false); }}
                    className="flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-semibold rounded-lg w-full"
                  >
                    <FaUser /> LOGIN / REGISTER
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login/Register Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
};

export default Navbar;
