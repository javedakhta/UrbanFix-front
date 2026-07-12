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
            className="px-4 py-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors text-sm font-medium"

        >
            Log Out
        </button>
    );
}