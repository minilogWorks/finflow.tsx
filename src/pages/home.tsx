import { useState, useEffect } from "react";
import { StorageService } from "../services/StorageService";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const checkMobile = () => setIsMobile(window.innerWidth <= 768);

  const stats = StorageService.calculateStats();

  return (
    <div className="app-container">
      <Sidebar user={StorageService.getUser()} isMobile={isMobile} />

      <div className="main-wrapper">
        <main className="main-content">
          <Header stats={stats} isMobile={isMobile} />
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )} */}
    </div>
  );
}
