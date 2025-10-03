import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Documents from "./pages/Documents";
import UploadDocument from "./pages/UploadDocument";
import Navbar from "./components/Navbar";
import NavbarAuth from "./components/NavbarAuth";
import ChatDoc from "./pages/ChatDoc";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuthRequest } from "./store/auth/slices";
import DocumentSearch from "./pages/DocumentSearch";
import ToastContainer from "./components/ToastContainer";

const queryClient = new QueryClient();

// Helper to render authenticated routes with NavbarAuth
const AuthenticatedRoute = ({ element }: { element: React.ReactNode }) => (
  <>
    <NavbarAuth />
    {element}
  </>
);

// Helper to render public routes with normal Navbar
const PublicRoute = ({ element }: { element: React.ReactNode }) => (
  <>
    <Navbar />
    {element}
  </>
);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Only check auth once on app load
    dispatch(checkAuthRequest());
  }, []); // Remove dispatch from dependencies to prevent re-runs

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <ToastContainer />
          <Sonner />
          <Routes>
            {/* Public routes with standard navbar */}
            <Route path="/" element={<PublicRoute element={<Index />} />} />
            <Route
              path="/login"
              element={<PublicRoute element={<Login />} />}
            />
            <Route
              path="/signup"
              element={<PublicRoute element={<Signup />} />}
            />

            {/* Authenticated routes with auth navbar */}
            <Route
              path="/documents"
              element={<AuthenticatedRoute element={<Documents />} />}
            />
            <Route
              path="/upload-document"
              element={<AuthenticatedRoute element={<UploadDocument />} />}
            />
            <Route
              path="/upload-document"
              element={<AuthenticatedRoute element={<UploadDocument />} />}
            />
            <Route
              path="/chatdoc/:id"
              element={<AuthenticatedRoute element={<ChatDoc />} />}
            />
            <Route
              path="/search"
              element={<AuthenticatedRoute element={<DocumentSearch />} />}
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
