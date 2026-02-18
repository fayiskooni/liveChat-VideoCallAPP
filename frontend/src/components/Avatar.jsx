import React, { useState } from "react";
import { User } from "lucide-react";

const Avatar = ({ src, alt, className = "", fallback }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div
            className={`relative flex items-center justify-center w-full h-full bg-base-300 text-base-content/50 overflow-hidden !flex ${className}`}
        >
            {/* Fallback / Loader - Visible when image is loading or error */}
            {(!src || !imageLoaded || error) && (
                <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-base-300 text-base-content/50 animate-pulse">
                    {fallback || <User className="w-1/2 h-1/2" />}
                </div>
            )}

            {/* Image - Visible only when loaded and no error */}
            {src && !error && (
                <img
                    src={src}
                    alt={alt || "Avatar"}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setError(true)}
                />
            )}
        </div>
    );
};

export default Avatar;
