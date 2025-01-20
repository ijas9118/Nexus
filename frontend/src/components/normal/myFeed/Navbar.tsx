import React from "react";
import { Bell, Search, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import NexusLogo from "@/components/ui/NexusLogo";
import Fire from "@/components/ui/icons/Fire";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-10">
        {/* Logo Section */}
        <Link to="/" className="mr-8 flex items-center space-x-2">
          <NexusLogo />
          <span className="text-2xl font-bold">nexus.</span>
        </Link>

        {/* Search Section */}
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-1/2 max-w-2xl">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="w-full bg-gray-50 pl-8"
            />
          </div>
        </div>

        {/* Right Side Items */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Notifications Button */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              8
            </span>
          </Button>

          {/* Messages Button */}
          <Button variant="ghost" size="icon" className="relative">
            <Send className="h-5 w-5" />
            <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              6
            </span>
          </Button>

          {/* User Section */}
          <div className="flex items-center space-x-4 border-l pl-1">
            <Button variant="ghost">
              <Fire />
              <span className="text-sm">2</span>
            </Button>

            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
