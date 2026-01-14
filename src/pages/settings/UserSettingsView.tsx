import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Shield,
  User as UserIcon,
  AtSign,
  Mail,
} from "lucide-react";
import "./UserSettingsView.css";
import { useAuth } from "../../context/AuthContext";

interface PasswordState {
  current: string;
  next: string;
  confirm: string;
}

interface StatusMessage {
  type: "success" | "error";
  text: string;
}

const currencyOptions = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "CAD", label: "Canadian Dollar", symbol: "$" },
  { code: "AUD", label: "Australian Dollar", symbol: "$" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  { code: "GHS", label: "Ghanaian Cedi", symbol: "₵" },
  { code: "NGN", label: "Nigerian Naira", symbol: "₦" },
  { code: "ZAR", label: "South African Rand", symbol: "R" },
  { code: "KES", label: "Kenyan Shilling", symbol: "KSh" },
  { code: "EGP", label: "Egyptian Pound", symbol: "£" },
  { code: "INR", label: "Indian Rupee", symbol: "₹" },
  { code: "CNY", label: "Chinese Yuan", symbol: "¥" },
  { code: "CHF", label: "Swiss Franc", symbol: "Fr" },
  { code: "NZD", label: "New Zealand Dollar", symbol: "$" },
  { code: "SEK", label: "Swedish Krona", symbol: "kr" },
  { code: "NOK", label: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", label: "Danish Krone", symbol: "kr" },
  { code: "SGD", label: "Singapore Dollar", symbol: "$" },
  { code: "HKD", label: "Hong Kong Dollar", symbol: "$" },
  { code: "MXN", label: "Mexican Peso", symbol: "$" },
  { code: "BRL", label: "Brazilian Real", symbol: "R$" },
];

const UserSettingsView: React.FC = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [profileStatus, setProfileStatus] = useState<StatusMessage | null>(
    null
  );
  const [passwords, setPasswords] = useState<PasswordState>({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordStatus, setPasswordStatus] = useState<StatusMessage | null>(
    null
  );

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      setCurrency(user.currency || "USD");
    }
  }, [user]);

  const canSaveProfile = useMemo(() => {
    return username.trim().length >= 3 && email.trim().length > 3;
  }, [username, email]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSaveProfile) {
      setProfileStatus({
        type: "error",
        text: "Please provide a username (3+ chars) and a valid email.",
      });
      return;
    }

    updateUserProfile({ name, username, email, currency });
    setProfileStatus({ type: "success", text: "Profile updated." });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.next || passwords.next.length < 6) {
      setPasswordStatus({
        type: "error",
        text: "New password must be at least 6 characters.",
      });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordStatus({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    // Placeholder: wire this to your backend password endpoint.
    setPasswordStatus({ type: "success", text: "Password updated locally." });
    setPasswords({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">
            Manage your account preferences and security
          </p>
        </div>
      </div>

      <div className="settings-container">
        <section className="settings-section">
          <div className="section-header">
            <div className="section-icon">
              <UserIcon size={20} />
            </div>
            <div>
              <h2 className="section-title">Personal Information</h2>
              <p className="section-description">
                Update your personal details and preferences
              </p>
            </div>
          </div>

          {profileStatus && (
            <div className={`alert alert-${profileStatus.type}`}>
              {profileStatus.type === "success" ? (
                <CheckCircle size={18} />
              ) : (
                <Shield size={18} />
              )}
              <span>{profileStatus.text}</span>
            </div>
          )}

          <form className="settings-form" onSubmit={handleProfileSave}>
            <div className="form-field">
              <label className="field-label" htmlFor="name">
                Display Name
              </label>
              <div className="field-input">
                <div className="input-wrapper">
                  <UserIcon size={18} className="input-icon" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your display name"
                    className="text-input"
                  />
                </div>
                <p className="field-description">
                  This is how you'll appear across FinFlow
                </p>
              </div>
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="username">
                Username
              </label>
              <div className="field-input">
                <div className="input-wrapper">
                  <AtSign size={18} className="input-icon" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your unique username"
                    className="text-input"
                    required
                  />
                </div>
                <p className="field-description">
                  Minimum 3 characters, letters and numbers only
                </p>
              </div>
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="email">
                Email Address
              </label>
              <div className="field-input">
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="text-input"
                    required
                  />
                </div>
                <p className="field-description">
                  Used for account notifications and recovery
                </p>
              </div>
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="currency">
                Preferred Currency
              </label>
              <div className="field-input">
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="select-input"
                >
                  {currencyOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.code} — {option.label}
                    </option>
                  ))}
                </select>
                <p className="field-description">
                  Default currency for transactions and reports
                </p>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!canSaveProfile}
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>

        <div className="divider"></div>

        <section className="settings-section">
          <div className="section-header">
            <div className="section-icon">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="section-title">Security</h2>
              <p className="section-description">
                Manage your password and account security
              </p>
            </div>
          </div>

          {passwordStatus && (
            <div className={`alert alert-${passwordStatus.type}`}>
              {passwordStatus.type === "success" ? (
                <CheckCircle size={18} />
              ) : (
                <Shield size={18} />
              )}
              <span>{passwordStatus.text}</span>
            </div>
          )}

          <form className="settings-form" onSubmit={handlePasswordChange}>
            <div className="form-field">
              <label className="field-label" htmlFor="current-password">
                Current Password
              </label>
              <div className="field-input">
                <input
                  id="current-password"
                  type="password"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  placeholder="Enter current password"
                  className="text-input"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="new-password">
                New Password
              </label>
              <div className="field-input">
                <input
                  id="new-password"
                  type="password"
                  value={passwords.next}
                  onChange={(e) =>
                    setPasswords({ ...passwords, next: e.target.value })
                  }
                  placeholder="Enter new password"
                  className="text-input"
                  required
                />
                <p className="field-description">
                  Must be at least 6 characters long
                </p>
              </div>
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <div className="field-input">
                <input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  placeholder="Confirm new password"
                  className="text-input"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-secondary">
                Update Password
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default UserSettingsView;
