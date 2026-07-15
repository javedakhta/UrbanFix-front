"use client";

import { useAuthCheck } from "@/context/AuthContext";

import ProfileImageUpload from "@/components/ProfileImageUpload";

export default function ProfilePage() {
    // 1. Grab everything you need directly from your global AuthContext
    const { loading, dbUser } = useAuthCheck();

    // 2. Handle the global loading state
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                Loading profile...
            </div>
        );
    }

    // 3. Handle the case where someone visits this page but isn't logged in
    if (!dbUser) {
        return (
            <div className="flex h-screen items-center justify-center text-red-500">
                Please log in to view this page.
            </div>
        );
    }

    // 4. Render the profile using the dbUser object
    return (
        <div className="flex flex-col items-center p-8 max-w-md mx-auto mt-10 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>

            {/* Pass the ID and image_url straight from your global context */}
            <ProfileImageUpload
                userId={dbUser.id}
                initialImage={dbUser.image_url}
            />

            <div className="mt-6 text-center w-full">
                <div className="bg-gray-50 p-3 rounded mb-2 border">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{dbUser.user_name}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{dbUser.email}</p>
                </div>
            </div>
        </div>
    );
}