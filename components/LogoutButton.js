"use client";

import { signOut } from "firebase/auth";
import { auth } from "../config/firebase"; // Adjust the path to your firebase.js
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // 1. Tell Firebase to wipe the user's session
            await signOut(auth);

            // 2. (Optional but good practice) Explicitly push them to login
            router.push("/login");

        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <button
            onClick={handleLogout}
            style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#d9534f",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
            }}
        >
            Log Out
        </button>
    );
}