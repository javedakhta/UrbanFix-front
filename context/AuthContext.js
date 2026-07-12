"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/config/firebase"

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dbUser, setDbUser] = useState(null);

    const loginUser = (userData) => {
        setDbUser(userData.dbUser);
    };

    const getToken = async () => {
        const token = await user.getIdToken();
        return token;
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // User is authenticated with Firebase, now fetch backend data
                try {
                    const token = await currentUser.getIdToken();
                    // Note: You might want a dedicated GET /users/me endpoint for this, 
                    // but reusing your login endpoint works if your backend handles it!
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
                        method: 'POST',
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setDbUser(userData.dbUser);
                    }
                } catch (error) {
                    console.error("Failed to fetch dbUser on load:", error);
                    setDbUser(null);
                }
            } else {
                // No user is logged in
                setDbUser(null);
            }

            // Finish loading AFTER the backend fetch completes
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, dbUser, loginUser, getToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthCheck = () => useContext(AuthContext);