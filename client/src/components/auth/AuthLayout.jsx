import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Info, Github, Mail, HelpCircle, Star } from "lucide-react";

function AuthLayout() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={16} /> },
    { name: "Features", path: "#features", icon: <Star size={16} /> },
    { name: "About us", path: "#about", icon: <Info size={16} /> },
    { name: "Github", path: "https://github.com", icon: <Github size={16} /> },
    { name: "Contact Us", path: "#contact", icon: <Mail size={16} /> },
    { name: "FAQ", path: "#faq", icon: <HelpCircle size={16} /> },
  ];

  return (
    <div className="min-h-screen w-full bg-dark-bg text-white flex flex-col items-center relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Pill-shaped Navbar */}
      <header className="z-50 mt-8 px-4">
        <nav className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5 flex items-center gap-1 shadow-2xl">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/5 ${location.pathname === item.path ? "bg-white text-black" : "text-gray-400"
                  }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-white/10 mx-2" />

          <Link
            to="/auth/register"
            className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary-500/20"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl px-6 py-12 z-10">
        <div className="w-full flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              Productivity Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-blue-600">
                TaskBoard
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Your all-in-one productivity dashboard for developers 🚀
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 border border-white/5 text-gray-400 text-sm hover:border-white/20 transition-all cursor-pointer group"
            >
              <Star size={16} className="text-yellow-500" />
              <span>Star on GitHub</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Form Container with subtle border similar to Image 1 */}
        <div className="w-full max-w-lg relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 to-blue-600/20 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer / Extra Decoration */}
      <footer className="w-full py-8 text-center text-gray-600 text-xs z-10">
        © 2026 TaskBoard Productivity Platform. All rights reserved.
      </footer>
    </div>
  );
}

export default AuthLayout;