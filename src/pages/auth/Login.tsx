import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./Auth.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getCsrfToken = () =>
    document.cookie
      .split("; ") // 1. Split cookies into individual key=value pairs
      .find((row) => row.startsWith("csrftoken=")) // 2. Find the one that starts with 'csrftoken='
      ?.split("=")[1] ?? ""; // 3. Split that pair on '=' and take the value (index 1)

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

        <button
          onClick={() => {
            fetch("http://127.0.0.1:8000/api/transactions/", {
              method: "GET",
            }).then((res) => {
              res.json().then((data) => {
                console.log(data);
              });
            });
          }}
        >
          <p>Transaction Mock</p>
        </button>

        <button
          onClick={() => {
            fetch("http://127.0.0.1:8000/api-auth/login/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCsrfToken(),
              },
              credentials: "include",
              body: JSON.stringify({
                username: "minilog",
                password: "minilog123",
              }),
            })
              .then((res) => {
                console.log(res);
                res
                  .json()
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((err) => {
                    console.error("Json Conversion Error\n", err);
                  });
              })
              .catch((err) => {
                console.error("Login Mock Error\n", err);
              });
          }}
        >
          <p>Login Mock</p>
        </button>
      </div>
    </div>
  );
};

export default Login;
