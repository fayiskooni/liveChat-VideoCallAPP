import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router";

const Layout = ({ children, showSidebar = false }) => {
  const location = useLocation();
  const mainRef = React.useRef(null);

  React.useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <div className="h-full">
      <div className="flex h-full">
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col h-full">
          <Navbar />
          <main ref={mainRef} className="flex-1 overflow-y-auto bg-base-100/30 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
