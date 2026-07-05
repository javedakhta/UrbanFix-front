"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Attempting Login with:", { email, password });

    // TODO: Plug in your fetch("https://your-api.com/login") here
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      const token = await user.getIdToken();
      console.log("Successfully grabbed token:", token);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend rejected login: ${errorText}`);
      }
      console.log("Backend login successful:");

      // 5. If everything passed, route to the dashboard!
      router.push("/");

    } catch (err) {
      console.log("Failed to Login", err);
      await signOut(auth);
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
