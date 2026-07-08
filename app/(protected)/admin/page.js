"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { getMyProfile } from "@/lib/api";

export default function AdminPage() {
    const [dbProfile, setDbProfile] = useState(null);
    const [loadingDb, setLoadingDb] = useState(true);
    const [notAdmin, setNotAdmin] = useState(false);
    const router = useRouter();

    const user = auth.currentUser;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        const fetchBackendProfile = async () => {
            if (!user) return;

            try {
                const token = await user.getIdToken();
                const data = await getMyProfile(token);
                setDbProfile(data.user);

                // The actual gate: only admins stay on this page
                if (data.user?.role !== "admin") {
                    setNotAdmin(true);
                    router.push("/"); // bounce customers to home
                }
            } catch (error) {
                console.error("Failed to fetch DB profile:", error);
                router.push("/"); // fail closed — if we can't confirm admin, don't show admin UI
            } finally {
                setLoadingDb(false);
            }
        };

        fetchBackendProfile();
    }, [user, router]);

    if (!user) return null;
    if (loadingDb) return <p style={{ textAlign: "center", marginTop: "4rem" }}>Checking access...</p>;
    if (notAdmin) return null; // already redirecting

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2>Admin Overview</h2>
                <button
                    onClick={handleLogout}
                    style={{ background: "#d9534f", color: "white", padding: "0.6rem 1.2rem", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                >
                    Log Out
                </button>
            </div>

            <div style={{ background: "#f9f9f9", padding: "1.5rem", borderRadius: "6px", marginBottom: "1.5rem" }}>
                <h3>Signed in as</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {dbProfile?.role}</p>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
                <a href="/admin/services" style={{ background: "#0070f3", color: "white", padding: "0.75rem 1.5rem", borderRadius: "6px", textDecoration: "none", fontWeight: "bold" }}>
                    Manage Services
                </a>
            </div>
        </div>
    );
}