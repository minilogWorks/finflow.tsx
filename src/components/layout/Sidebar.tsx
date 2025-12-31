import React from "react";
import {
  Home,
  History,
  Tags,
  BarChart,
  PieChart,
  User,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  user: any;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ user, isMobile }) => {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/" },
    {
      id: "transactions",
      icon: History,
      label: "Transactions",
      path: "/transactions",
    },
    {
      id: "categories",
      icon: Tags,
      label: "Categories",
      path: "/categories",
    },
    { id: "reports", icon: BarChart, label: "Reports", path: "/reports" },
  ];

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className={`sidebar ${isMobile ? "mobile" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <PieChart size={24} />
          <h1>FinFlow</h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <button className="sidebar-button">
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <h4>{user?.name || "User"}</h4>
            <p>{user?.tier || "Free"} User</p>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
