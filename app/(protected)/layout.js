// app/(protected)/layout.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthCheck } from "../../context/AuthContext";
import { auth } from "@/config/firebase";

export default function ProtectedLayout({ children }) {
    // Grab state from your shiny new global context
    const { user, loading } = useAuthCheck();
    const router = useRouter();


    const checkToken = async () => {
        const token = await user.getIdToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            console.log("Not ok");
        } else if (response.ok) {
            console.log("OK");
        }
    }
    // Second way of checking authentication
    useEffect(() => {
        checkToken();
    });

    useEffect(() => {
        // If it's done loading and there's no user, kick them out
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Show a loading screen while Firebase initializes
    if (loading) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
    }

    // Only render the protected pages if a user exists
    return user ? <>{children}</> : null;
}