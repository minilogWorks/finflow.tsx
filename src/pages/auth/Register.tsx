import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import "./Auth.css";

type CurrencyOption = {
  code: string;
  label: string;
  symbol: string;
};

const currencyOptions: CurrencyOption[] = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "CAD", label: "Canadian Dollar", symbol: "$" },
  { code: "AUD", label: "Australian Dollar", symbol: "$" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
];

type CurrencySelectProps = {
  value: string;
  disabled?: boolean;
  onChange: (code: string) => void;
};

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  value,
  disabled,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const selected = currencyOptions.find((opt) => opt.code === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="custom-select" ref={wrapperRef}>
      <button
        type="button"
        className="custom-select__button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
      >
        <span className="custom-select__value">
          <i data-lucide="wallet"></i>
          <span className="custom-select__label">
            {selected
              ? `${selected.symbol} ${selected.code}`
              : "Select currency"}
          </span>
          {selected && (
            <small className="custom-select__hint">{selected.label}</small>
          )}
        </span>
        <i
          className={`custom-select__chevron ${open ? "open" : ""}`}
          data-lucide="chevron-down"
        ></i>
      </button>

      {open && (
        <div className="custom-select__menu">
          {currencyOptions.map((option) => (
            <button
              type="button"
              key={option.code}
              className={`custom-select__option ${
                option.code === value ? "selected" : ""
              }`}
              onClick={() => {
                onChange(option.code);
                setOpen(false);
              }}
              disabled={disabled}
            >
              <span className="custom-select__option-main">
                <span className="custom-select__symbol">{option.symbol}</span>
                <span className="custom-select__code">{option.code}</span>
              </span>
              <span className="custom-select__description">{option.label}</span>
              {option.code === value && (
                <i className="custom-select__check" data-lucide="check"></i>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    currency: "USD",
  });
  const [error] = useState("");
  const [success] = useState("");
  const [loading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   setSuccess("");

  //   // Validation
  //   if (formData.password !== formData.confirmPassword) {
  //     setError("Passwords do not match");
  //     return;
  //   }

  //   if (formData.password.length < 6) {
  //     setError("Password must be at least 6 characters");
  //     return;
  //   }

  //   setLoading(true);

  //   const result = AuthService.register(
  //     formData.username,
  //     formData.password,
  //     formData.name || formData.username
  //   );

  //   setLoading(false);

  //   if (result.success) {
  //     setSuccess("Account created successfully!");
  //     setTimeout(() => {
  //       onRegisterSuccess();
  //       navigate("/dashboard");
  //     }, 1500);
  //   } else {
  //     setError(result.message);
  //   }
  // };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <i data-lucide="pie-chart"></i>
            <h1>FinFlow</h1>
          </div>
          <h2>Create Account</h2>
          <p>Start managing your finances today</p>
        </div>

        {error && (
          <div className="auth-error">
            <i data-lucide="alert-circle"></i>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-success">
            <i data-lucide="check-circle"></i>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={() => {}} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                <i data-lucide="user-plus"></i>
                Display Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="What should we call you?"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">
                <i data-lucide="wallet"></i>
                Preferred Currency
              </label>
              <CurrencySelect
                value={formData.currency}
                onChange={(code) =>
                  setFormData({ ...formData, currency: code })
                }
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <i data-lucide="at-sign"></i>
              Username *
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              disabled={loading}
            />
            <small className="hint">
              At least 3 characters, letters and numbers only
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">
                <i data-lucide="lock"></i>
                Password *
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                disabled={loading}
              />
              <small className="hint">At least 6 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <i data-lucide="lock"></i>
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <i data-lucide="loader-2" className="spin"></i>
                Creating Account...
              </>
            ) : (
              <>
                <i data-lucide="user-plus"></i>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => {
                navigate("/login");
              }}
              disabled={loading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
