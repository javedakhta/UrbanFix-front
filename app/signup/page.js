"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Image Upload States
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);
    const router = useRouter();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        console.log("Attempting Signup with:", { name, email, password, hasImage: !!imageFile });

        try {
            // 1. Create the user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // 2. Grab the JWT for the new user
            const token = await userCredential.user.getIdToken();

            let finalImageUrl = null;

            // Replace steps 3 and 4 in your handleSignup function with this:

            if (imageFile) {
                // Convert file to Base64
                const base64String = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(imageFile);
                    reader.onload = () => {
                        // Strip the data:image/png;base64, prefix
                        const result = reader.result.split(',')[1];
                        resolve(result);
                    };
                    reader.onerror = (error) => reject(error);
                });

                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        imageBase64: base64String,
                        mimeType: imageFile.type,
                        originalName: imageFile.name
                    })
                });

                if (!uploadRes.ok) {
                    const errText = await uploadRes.text();
                    throw new Error(`Image upload failed: ${errText}`);
                }

                const uploadData = await uploadRes.json();
                finalImageUrl = uploadData.imageUrl;
            }

            // 4. Send the token AND the extra user data (including image URL) to your Express backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: name,
                    role: 'USER',
                    imageUrl: finalImageUrl
                })
            });
            if (!response.ok) {
                // 🕵️‍♂️ READ THE ACTUAL SERVER RESPONSE HERE
                const errorText = await response.text();
                console.error("The server rejected the request because:", errorText);
                throw new Error(`Backend Error: ${response.status} - ${errorText}`);
            }

            // Success! Route to login
            router.push("/login");

        } catch (error) {
            console.error("Signup error:", error.message);
            alert(`Signup failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", flexDirection: "column", padding: "2rem 0" }}>
            <div style={{ border: "1px solid #ccc", padding: "2rem", borderRadius: "8px", width: "320px", backgroundColor: "#fff" }}>
                <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Create Account</h2>

                <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                    {/* --- Image Upload UI --- */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "0.5rem" }}>
                        <div
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                backgroundColor: "#f0f0f0",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "hidden",
                                cursor: "pointer",
                                border: "2px dashed #ccc"
                            }}
                            title="Click to upload profile picture"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <span style={{ fontSize: "2rem", color: "#aaa" }}>+</span>
                            )}
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.5rem" }}>Profile Picture (Optional)</span>

                        <input
                            type="file"
                            accept="image/jpeg, image/png, image/webp"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                    </div>
                    {/* ----------------------- */}

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: "0.6rem", borderRadius: "4px", border: "1px solid #ccc" }}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            padding: "0.7rem",
                            background: isLoading ? "#6c757d" : "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            fontWeight: "bold",
                            marginTop: "0.5rem"
                        }}
                    >
                        {isLoading ? "Creating Account..." : "Register"}
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