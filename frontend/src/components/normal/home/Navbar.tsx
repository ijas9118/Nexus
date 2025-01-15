import { Button } from "@/components/ui/button";
import NexusLogo from "@/components/ui/NexusLogo";
import { navbarLinks } from "@/utils/navigationLinks";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <NexusLogo width={40} height={40} className="mr-4" />
              <span className="ml-2 text-xl font-semibold">nexus.</span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navbarLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-gray-900"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
