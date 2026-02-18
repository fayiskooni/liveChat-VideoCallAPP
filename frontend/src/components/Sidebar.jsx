import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import { Bell, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-72 bg-base-100/50 backdrop-blur-xl border-r border-base-content/5 hidden lg:flex flex-col h-full sticky top-0 z-40 shadow-2xl">
      <div className="p-8 pb-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-primary/10 p-2.5 rounded-2xl group-hover:bg-primary/20 transition-all duration-300 transform group-hover:scale-110">
            <ShipWheelIcon className="size-7 text-primary" />
          </div>
          <span className="text-3xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary to-secondary">
            Loomsy
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <SidebarLink
          to="/"
          icon={<HomeIcon className="size-5" />}
          label="Home"
          active={currentPath === "/"}
        />
        <SidebarLink
          to="/friends"
          icon={<UsersIcon className="size-5" />}
          label="Friends"
          active={currentPath === "/friends"}
        />
        <SidebarLink
          to="/notifications"
          icon={<Bell className="size-5" />}
          label="Notifications"
          active={currentPath === "/notifications"}
        />
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-6 mt-auto">
        <div className="bg-base-200/50 backdrop-blur-sm p-4 rounded-3xl border border-base-content/5 flex items-center gap-4 hover:bg-base-200/80 transition-all duration-300 shadow-lg shadow-black/5 cursor-pointer group">
          <div className="relative">
            <div className="avatar size-11 rounded-2xl overflow-hidden ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100 group-hover:ring-primary/40 transition-all">
              <img src={authUser?.profilePic} alt="User Avatar" className="object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-3.5 bg-success border-2 border-base-100 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate uppercase tracking-tight">{authUser?.fullName}</p>
            <p className="text-[10px] text-success font-bold flex items-center gap-1.5 opacity-80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              ONLINE
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group hover:scale-[1.02] ${active ? "text-primary-content" : "text-base-content opacity-70 hover:opacity-100"
      }`}
  >
    {active && (
      <motion.div
        layoutId="active-nav-bg"
        className="absolute inset-0 bg-primary rounded-2xl shadow-lg shadow-primary/30"
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}

    <div className={`relative z-10 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
      {icon}
    </div>
    <span className={`relative z-10 font-bold tracking-wide ${active ? "text-sm" : "text-sm"}`}>{label}</span>
    {active && (
      <div className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-primary-content animate-pulse" />
    )}
  </Link>
);

export default Sidebar;
