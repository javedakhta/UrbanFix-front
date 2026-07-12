"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { useAuthCheck } from "@/context/AuthContext";

export default function AdminPage() {
    // Bring in 'loading' from your context
    const { dbUser, loading } = useAuthCheck();
    const router = useRouter();

    useEffect(() => {
        // Wait until Firebase and your backend are done loading
        if (!loading) {
            console.log(dbUser);
            // If there is no user, OR they aren't an admin, kick them out
            if (!dbUser || dbUser.role !== "ADMIN") {
                router.push("/login");
            }
        }
    }, [dbUser, loading, router]); // Add dependencies

    // Show a loading state while fetching to prevent flickering
    if (loading) {
        return <div>Loading Admin Panel...</div>;
    }

    // Don't render the panel if they are about to be redirected
    if (!dbUser || dbUser.role !== "ADMIN") {
        return null;
    }

    return (
        <div>
            Admin Panel
        </div>
    );
}