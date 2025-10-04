import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Get the current pathname
  const currentPath = location.pathname;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 w-full border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold gradient-text">
                Chat Docs!
              </span>
            </Link>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Home
            </Link>
            {currentPath === "/" ? (
              <>
                <ScrollLink
                  to="features" // The id of the target element
                  smooth={true} // Enables smooth scrolling
                  duration={500} // Duration of the scroll in milliseconds
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 cursor-pointer focus:outline-none"
                >
                  Features
                </ScrollLink>
                <ScrollLink
                  to="how-it-works" // The id of the target element
                  smooth={true} // Enables smooth scrolling
                  duration={500} // Duration of the scroll in milliseconds
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 cursor-pointer focus:outline-none"
                >
                  How It Works
                </ScrollLink>
              </>
            ) : (
              <>
                {" "}
                <Link
                  to="/#features"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 cursor-pointer focus:outline-none"
                >
                  Features
                </Link>
                <Link
                  to="/#how-it-works"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 cursor-pointer focus:outline-none"
                >
                  How It Works
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center">
            <Button asChild variant="ghost" className="mr-2">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="button-gradient">
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-md"
            >
              Home
            </Link>
            <ScrollLink
              to="features" // The id of the target element
              smooth={true} // Enables smooth scrolling
              duration={500} // Duration of the scroll in milliseconds
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-md"
            >
              Features
            </ScrollLink>
            <ScrollLink
              to="how-it-works" // The id of the target element
              smooth={true} // Enables smooth scrolling
              duration={500} // Duration of the scroll in milliseconds
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-md"
            >
              How It Works
            </ScrollLink>
            <Link
              to="/login"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-md"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-3 py-2 text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-gray-100 rounded-md"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
