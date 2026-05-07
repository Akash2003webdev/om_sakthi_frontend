import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LangProvider } from "./context/LangContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AdminProvider } from "./context/AdminContext";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import CustomCursor from "./components/CustomCursor";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DesignDetail from "./pages/DesignDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  useSmoothScroll();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      <CustomCursor />
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/design/:id" element={<DesignDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloat />}
    </>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LangProvider>
          <AdminProvider>
            {!loaded && <Loader onComplete={() => setLoaded(true)} />}
            <div style={{ visibility: loaded ? "visible" : "hidden" }}>
              <AppContent />
            </div>
          </AdminProvider>
        </LangProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
