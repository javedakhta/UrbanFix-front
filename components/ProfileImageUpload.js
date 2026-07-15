"use client";

import { useState, useRef, useEffect } from "react";

export default function ProfileImageUpload({ initialImage, userId }) {
    const [imagePreview, setImagePreview] = useState(initialImage || null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);

    // Watch for the database image loading in from the parent component
    useEffect(() => {
        if (initialImage && !selectedFile) {
            setImagePreview(initialImage);
        }
    }, [initialImage, selectedFile]);

    // Trigger the hidden file input
    const handleImageClick = () => {
        if (!isUploading) {
            fileInputRef.current.click();
        }
    };

    // Handle file selection and generate local preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setError("Please select a valid image file.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError("Image must be smaller than 5MB.");
                return;
            }

            setError("");
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle the actual upload to your Express backend
    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setError("");

        try {
            // Convert file to Base64 to match our Cloudflare Worker setup
            const base64String = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(selectedFile);
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = (error) => reject(error);
            });

            // 1. Upload to R2 via the backend
            const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-image`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`, // Verify your auth method
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageBase64: base64String,
                    mimeType: selectedFile.type,
                    originalName: selectedFile.name
                }),
            });

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) throw new Error(uploadData.error || "Upload failed");

            // 2. Update the user's database record with the new URL
            // (Assuming you will create this PUT route next!)
            const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/image`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageUrl: uploadData.imageUrl
                })
            });

            if (!updateResponse.ok) throw new Error("Failed to update profile image in database");

            setSelectedFile(null);
            setIsUploading(false);

        } catch (err) {
            console.error("Upload error:", err);
            setError(err.message || "Something went wrong uploading the image.");
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setImagePreview(initialImage || null);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar Container */}
            <div
                onClick={handleImageClick}
                className={`relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50 cursor-pointer group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                title="Click to change profile picture"
            >
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            console.error("Failed to load image. Check R2 CORS or database URL.");
                        }}
                    />
                ) : (
                    // Fallback UI if no image exists
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-white text-sm font-medium">Change</span>
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
            />

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Action Buttons (Only show when a new file is selected) */}
            {selectedFile && (
                <div className="flex gap-2">
                    <button
                        onClick={handleCancel}
                        disabled={isUploading}
                        className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition flex items-center justify-center min-w-[100px] disabled:opacity-50"
                    >
                        {isUploading ? "Saving..." : "Save Image"}
                    </button>
                </div>
            )}
        </div>
    );
}