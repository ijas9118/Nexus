import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import NexusLogo from "@/components/ui/NexusLogo";
import { navbarLinks } from "@/utils/navigationLinks";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useLogout from "@/hooks/useLogout";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const logoutUser = useLogout();

  useEffect(() => {
    const session = localStorage.getItem("sessionActive");
    setIsActive(session === "true");
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-opacity-20 backdrop-blur-sm bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <NexusLogo width={40} height={40} className="mr-2" />
              <span className="text-xl font-semibold">nexus.</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navbarLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium hover:text-primary transition"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Login Button */}
          <div className="hidden md:block">
            <Button
              variant="ghost"
              onClick={() => {
                if (isActive) {
                  logoutUser();
                } else {
                  navigate("/login");
                }
              }}
            >
              {isActive ? "Logout" : "Login"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ${
          isOpen ? "max-h-screen opacity-100 py-2" : "max-h-0 opacity-0"
        } overflow-hidden bg-background`}
      >
        <div className="flex flex-col items-center space-y-4 py-4">
          {navbarLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-primary transition"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Button
            variant="ghost"
            onClick={() => {
              if (isActive) {
                logoutUser();
              } else {
                navigate("/login");
              }
            }}
          >
            {isActive ? "Logout" : "Login"}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
