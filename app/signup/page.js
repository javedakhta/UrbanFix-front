"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();

        console.log("Attempting Signup with:", { name, email, password });

        // TODO: Plug in your fetch("https://your-api.com/signup") here
        try {
            // 1. Create the user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // 2. Grab the JWT for the new user
            const token = await userCredential.user.getIdToken();

            // 3. Send the token AND the extra user data to your Express backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userName: name, role: 'user' }) // Assuming you want to set a default role
            });

            if (!response.ok) {
                // 🕵️‍♂️ READ THE ACTUAL SERVER RESPONSE HERE
                const errorText = await response.text();
                console.error("The server rejected the request because:", errorText);
                throw new Error(`Backend Error: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            console.log("Signup complete! Backend says:", data);
            router.push("/login");

        } catch (error) {
            console.error("Signup error:", error.message);
        }

    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
            <div style={{ border: "1px solid #ccc", padding: "2rem", borderRadius: "8px", width: "300px" }}>
                <h2>Create Account</h2>

                <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ padding: "0.5rem" }}
                    />
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

                    <button type="submit" style={{ padding: "0.5rem", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                        Register
                    </button>
                </form>

                <p style={{ marginTop: "1rem", fontSize: "0.9rem", textAlign: "center" }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "#0070f3", textDecoration: "underline" }}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}