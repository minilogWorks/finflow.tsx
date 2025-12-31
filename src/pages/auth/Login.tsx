import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios, { AxiosError } from "axios";

import "./Auth.css";
import { useAuth } from "../../context/AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    const url = "http://127.0.0.1:8000/api/login/";
    try {
      const res = await axios.post(url, {
        username,
        password,
      });

      if (res.status === 200) {
        const { access: accessToken, refresh: refreshToken } = res.data;
        login({ accessToken, refreshToken });
        navigate("/", { replace: true });
      }
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage = error.response?.data
        ? (error.response.data as { detail: string }).detail
        : "";
      setError(errorMessage);
      console.error("Login API Error\n", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <i data-lucide="pie-chart"></i>
            <h1>FinFlow</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to manage your finances</p>
        </div>

        {error && (
          <div className="auth-error">
            <i data-lucide="alert-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={() => {}} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              <i data-lucide="user"></i>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i data-lucide="lock"></i>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
            onClick={() => {
              handleLogin(username, password);
            }}
          >
            {loading ? (
              <>
                <i data-lucide="loader-2" className="spin"></i>
                Signing in...
              </>
            ) : (
              <>
                <i data-lucide="log-in"></i>
                Sign In
              </>
            )}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="auth-button guest"
            onClick={() => {}}
            disabled={loading}
          >
            <i data-lucide="user-check"></i>
            Continue as Guest
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => {
                navigate("/register");
              }}
              disabled={loading}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
