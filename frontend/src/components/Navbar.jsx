import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import useLogout from "../hooks/useLogout";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import Avatar from "./Avatar";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/5 sticky top-0 z-30 h-16 flex items-center shadow-sm shadow-base-content/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage ? (
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <ShipWheelIcon className="size-6 text-primary" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">
                  Loomsy
                </span>
              </Link>
            </div>
          ) : (
            <div /> // Spacer
          )}

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle hover:bg-base-content/5 transition-colors">
                <BellIcon className="h-5 w-5 text-base-content opacity-70" />
              </button>
            </Link>

            <ThemeSelector />

            <div className="h-8 w-[1px] bg-base-content/10 mx-1" />



            <div className="avatar">
              <div className="w-9 rounded-xl ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100 overflow-hidden">
                <Avatar src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>

            <button
              className="btn btn-ghost btn-circle hover:bg-error/10 hover:text-error transition-all"
              onClick={logoutMutation}
            >
              <LogOutIcon className="h-5 w-5 opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
