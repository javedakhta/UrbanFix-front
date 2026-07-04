"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Attempting Login with:", { email, password });

    // TODO: Plug in your fetch("https://your-api.com/login") here
    const fakeSuccess = true;

    if (fakeSuccess) {
      router.push("/");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          padding: "2rem",
          borderRadius: "8px",
          width: "300px",
        }}
      >
        <h2>Login</h2>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "0.5rem" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "0.5rem" }}
          />

          <button
            type="submit"
            style={{
              padding: "0.5rem",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </form>

        <p
          style={{ marginTop: "1rem", fontSize: "0.9rem", textAlign: "center" }}
        >
          Don't have an account?{" "}
          <Link
            href="/signup"
            style={{ color: "#0070f3", textDecoration: "underline" }}
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
