import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { LocationProvider } from "./hooks/useLocation";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Compass, Heart, User } from "lucide-react";
// Assuming your hook is at this path
import { useScrollDirection } from "./hooks/useScrollDirection"; 

// --- Animation Variants (Your code, unchanged) ---
const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
};

// --- Transition Timing (Your code, unchanged) ---
const pageTransition = {
  type: "tween",
  ease: "linear",
  duration: 0.15
};

// Inner component to safely use hooks within providers
function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Using your scroll hook logic from previous files
  const scrollDirection = useScrollDirection(80);
  const hideNav = scrollDirection === 'down';
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const currentPath = location.pathname;
  const showNavPaths = ["/", "/explore", "/favorites", "/profile"];
  const shouldShowNav = showNavPaths.includes(currentPath);

  const handleNavClick = (path) => {
    if (path !== activePath) {
      setActivePath(path);
      navigate(path);
    }
  };

  return (
      <>
        {/* Page Transition Wrapper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            /* 💡 THE FIX: 
              REMOVED 'pb-28' from here. 
              This stops the layout jump during transitions.
            */
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>

        {/* Your Bottom Navigation Bar (Unchanged) */}
        {shouldShowNav && (
           <motion.nav
            key="bottom-nav"
            initial={{ y: 100, opacity: 0 }}
            animate={{
                y: hideNav ? 100 : 0,
                opacity: hideNav ? 0 : 1
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[370px]
            bg-white/5 backdrop-blur-2xl border border-white/10 text-white
            rounded-full flex justify-around items-center px-6 py-3
            shadow-[0_8px_40px_rgba(0,0,0,0.6)] z-50"
          >
             {[
              { icon: Home, path: "/" },
              { icon: Compass, path: "/explore" },
              { icon: Heart, path: "/favorites" },
              { icon: User, path: "/profile" },
            ].map(({ icon: Icon, path }) => {
              const isActive = currentPath === path;
              return (
                <motion.button
                  key={path}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleNavClick(path)}
                  className={`relative flex flex-col items-center justify-center p-1 rounded-full transition-colors duration-200 ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                  aria-label={path === '/' ? 'Home' : path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
                >
                  {path === "/profile" && user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className={`w-6 h-6 rounded-full object-cover transition-all ${
                        isActive ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0f1014]" : ""
                      }`}
                    />
                  ) : (
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                  )}
                   {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute -bottom-[6px] w-1 h-1 rounded-full bg-blue-400"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                </motion.button>
              );
            })}
          </motion.nav>
        )}
      </>
    );
}

// Main App component (Your code, unchanged)
export default function App() {
    return (
        <AuthProvider>
            <LocationProvider>
                <AppLayout />
            </LocationProvider>
        </AuthProvider>
    );
}

