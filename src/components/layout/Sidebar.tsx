import React from "react";
import { Home, History, Tags, BarChart, PieChart, User } from "lucide-react";
import { AppView } from "../../types";
import "./Sidebar.css";

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  transactionCount: number;
  categoryCount: number;
  user: any;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  transactionCount,
  categoryCount,
  user,
  isMobile,
}) => {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    {
      id: "transactions",
      icon: History,
      label: "Transactions",
      badge: transactionCount,
    },
    { id: "categories", icon: Tags, label: "Categories", badge: categoryCount },
    { id: "reports", icon: BarChart, label: "Reports" },
  ];

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
              <li
                key={item.id}
                className={currentView === item.id ? "active" : ""}
              >
                <button
                  className="sidebar-button"
                  onClick={() => onViewChange(item.id as AppView)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="badge">{item.badge}</span>
                  )}
                </button>
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
      </div>
    </aside>
  );
};

export default Sidebar;
