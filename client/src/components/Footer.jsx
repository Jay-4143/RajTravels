import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const footerLinks = {
  company: [
    { label: "About Us", to: "#" },
    { label: "Careers", to: "#" },
    { label: "Press", to: "#" },
    { label: "Blog", to: "#" },
  ],
  quick: [
    { label: "Flights", to: "/flights" },
    { label: "Hotels", to: "/hotels" },
    { label: "Holidays", to: "/holidays" },
    { label: "Visa", to: "/visa" },
  ],
  support: [
    { label: "Help Center", to: "#" },
    { label: "Contact Us", to: "#contact" },
    { label: "Cancellation", to: "#" },
    { label: "FAQs", to: "#" },
  ],
};

const socialIcons = [
  { Icon: FaFacebookF, href: "#", label: "Facebook" },
  { Icon: FaTwitter, href: "#", label: "Twitter" },
  { Icon: FaInstagram, href: "#", label: "Instagram" },
  { Icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
  { Icon: FaYoutube, href: "#", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex flex-col items-start gap-1 group mb-6">
              <span className="text-2xl font-brand font-black text-white leading-none">Raj Travel</span>
              <span className="text-[10px] font-tagline font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Your Trusted Journey Partner</span>
            </Link>
            <p className="mt-4 text-slate-400 text-sm max-w-xs leading-relaxed">
              Book flights, hotels, and holiday packages at the best prices. Experience seamless travel planning with us.
            </p>
            <div className="flex gap-3 mt-4">
              {socialIcons.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quick.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-700 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Raj Travel. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
