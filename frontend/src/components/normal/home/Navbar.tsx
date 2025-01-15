import { Button } from "@/components/ui/button";
import NexusLogo from "@/components/ui/NexusLogo";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <NexusLogo width={40} height={40} className="mr-4" />
              <span className="ml-2 text-xl font-semibold">nexus.</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <a href="#blog" className="text-gray-600 hover:text-gray-900">
              Blog
            </a>
            <a href="#changelog" className="text-gray-600 hover:text-gray-900">
              Changelog
            </a>
            <a href="#careers" className="text-gray-600 hover:text-gray-900">
              Careers
            </a>
            <a href="#support" className="text-gray-600 hover:text-gray-900">
              Support
            </a>
          </div>

          {/* Login Button */}
          <div>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
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
