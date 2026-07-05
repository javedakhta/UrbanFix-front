"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../config/firebase"; // Adjust path if needed
import { signOut } from "firebase/auth";

export default function DashboardPage() {
    const [dbProfile, setDbProfile] = useState(null);
    const [loadingDb, setLoadingDb] = useState(true);
    const router = useRouter();

    // Because of the protected layout, auth.currentUser is safely populated!
    const user = auth.currentUser;

    // --- 1. Handle Logout ---
    const handleLogout = async () => {
        try {
            await signOut(auth);
            // The protected layout will automatically detect the logout and boot them to /login,
            // but explicitly pushing to login is a good fallback.
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // --- 2. Fetch extra data from your Express backend (Optional but recommended) ---
    useEffect(() => {
        const fetchBackendProfile = async () => {
            if (!user) return;

            try {
                // Grab a fresh JWT token to prove who we are to Express
                const token = await user.getIdToken();

                // Example: Fetching from a theoretical GET /users/me route
                /*
                const response = await fetch("http://127.0.0.1:8787/users/me", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setDbProfile(data.user);
                }
                */
            } catch (error) {
                console.error("Failed to fetch DB profile:", error);
            } finally {
                setLoadingDb(false);
            }
        };

        fetchBackendProfile();
    }, [user]);

    // Safety fallback just in case
    if (!user) return null;

    return (
        <div style={{ maxWidth: "600px", margin: "4rem auto", padding: "2rem", border: "1px solid #eaeaea", borderRadius: "8px" }}>
            <h2>Dashboard</h2>
            <p style={{ color: "#666", marginBottom: "2rem" }}>
                You have successfully passed the layout bouncer.
            </p>

            <div style={{ background: "#f9f9f9", padding: "1.5rem", borderRadius: "6px", marginBottom: "2rem" }}>
                <h3>Firebase Auth Data</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Firebase UID:</strong> {user.uid}</p>
            </div>

            {/* If you uncommented the fetch block above, you could render D1 data here */}
            {/* <div style={{ background: "#f0f8ff", padding: "1.5rem", borderRadius: "6px", marginBottom: "2rem" }}>
                <h3>Database Profile Data</h3>
                {loadingDb ? (
                    <p>Loading your profile from Cloudflare...</p>
                ) : (
                    <>
                        <p><strong>Name:</strong> {dbProfile?.user_name}</p>
                        <p><strong>Role:</strong> {dbProfile?.role}</p>
                    </>
                )}
            </div> 
            */}

            <button
                onClick={handleLogout}
                style={{ background: "#d9534f", color: "white", padding: "0.75rem 1.5rem", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            >
                Log Out
            </button>
        </div>
    );
}