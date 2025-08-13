import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/transactions", label: "Transactions" },
    // { to: "/add-transaction", label: "Add Transaction" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-white/10
                 bg-gradient-to-r from-[#141e30]/80 via-[#243b55]/80 to-[#141e30]/80
                 shadow-lg shadow-black/30"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wider text-white hover:scale-105 transition-transform"
        >
          💰 FinTrack
        </Link>

        {/* Nav Links */}
        <div className="flex space-x-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-white/90 font-medium tracking-wide hover:text-white transition-colors
                after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5
                after:rounded-full after:scale-x-0 after:transition-transform after:origin-center
                ${
                  isActive
                    ? "text-white after:bg-gradient-to-r after:from-pink-500 after:to-purple-500 after:scale-x-100"
                    : "after:bg-gradient-to-r after:from-pink-500 after:to-purple-500 hover:after:scale-x-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
