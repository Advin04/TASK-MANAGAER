import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, X, LogOut, ChevronRight } from "lucide-react";
import { setIsSidebarCollapsed } from "../../redux/Slices/globalSlice";
import { logout } from "../../redux/Slices/authSlice";
import { motion } from "framer-motion";

const Sidebar = ({ menuItems }) => {
  const dispatch = useDispatch();
  const isSidebarCollapsed = useSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const user = useSelector((state) => state.auth.user);

  const handleSignOut = () => {
    dispatch(logout());
  };

  const sidebarClassNames = `fixed flex flex-col h-full justify-between shadow-2xl
    transition-all duration-300 z-40 dark:bg-dark-bg bg-white border-r border-gray-200 dark:border-gray-900
    ${isSidebarCollapsed ? "w-0 -translate-x-full opacity-0" : "w-72 translate-x-0 opacity-100"}
  `;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-full w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex items-center justify-between px-6 py-6 border-b border-gray-100 dark:border-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/30">
              TB
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
              TaskBoard
            </div>
          </div>
          {!isSidebarCollapsed && (
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* PROFILE SECTION (Mobile only, or kept at top?) - Putting user info at bottom usually better */}

        {/* NAVBAR LINKS */}
        <nav className="z-10 w-full flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => (
            <SidebarLink
              key={index}
              icon={item.icon}
              text={item.label}
              to={item.path}
            />
          ))}
        </nav>

        {/* USER PROFILE BOTTOM */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-dark-bg">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer group shadow-sm hover:shadow-md border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-400 to-violet-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-white dark:bg-dark-bg p-[2px]">
                <User className="w-full h-full text-gray-500 p-1" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, text, to }) => {
  const pathname = useLocation().pathname;
  // Exact match for dashboard, startswith for others (to handle sub-routes if any)
  const isActive = pathname === to || (to !== "/admin/dashboard" && pathname.startsWith(to));

  return (
    <NavLink to={to} className="block relative group">
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
          ? "text-primary-600 dark:text-primary-400 font-medium"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-dark-secondary"
          }`}
      >
        <span className={`transition-colors duration-200 ${isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-400 group-hover:text-gray-600"}`}>
          {React.cloneElement(icon, { size: 20 })}
        </span>
        <span className="flex-1">{text}</span>
        {isActive && <ChevronRight size={16} className="text-primary-400" />}
      </div>
    </NavLink>
  );
};

export default Sidebar;