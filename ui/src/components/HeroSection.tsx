import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BookOpen } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Educational Project Banner */}
      <div className="bg-orange-50 border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center gap-2 text-orange-800">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">
              Educational Project - Use only for learning purposes with
              non-sensitive documents
            </span>
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="block">Chat with your PDF documents</span>
            <span className="mt-2 gradient-text">using AI superpowers</span>
          </h1>

          <p className="mt-6 max-w-lg mx-auto text-xl sm:text-2xl text-gray-500">
            Upload any PDF and start a conversation. Ask questions, get
            summaries, and extract insights instantly.
          </p>

          <div className="mt-10 sm:flex sm:justify-center">
            <div className="rounded-md shadow">
              <Button
                asChild
                size="lg"
                className="button-gradient px-8 py-6 text-lg"
              >
                <Link to="/signup">Get Started for Free</Link>
              </Button>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
              >
                <Link to="#how-it-works">Learn how it works</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="hero-gradient w-64 h-64 blur-3xl opacity-20 rounded-full"></div>
            </div>
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="AI-driven PDF chat interface"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
