import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import {
  ipfsHashToUrl,
  DigitalArt,
  DigitalArtWithToken,
} from "../utils/helpers";

interface OptimizedImageProps {
  art: DigitalArt | DigitalArtWithToken;
  width?: number;
  height?: number;
  onClick?: () => void;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = React.memo(
  ({ art, width = 300, height = 300, onClick, priority = false }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Add timeout for image loading
    useEffect(() => {
      const timeout = setTimeout(() => {
        if (loading) {
          setLoading(false);
          setError(true);
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }, [loading]);

    // Handle both art types (with and without token wrapper)
    const imageData = "token" in art ? art.token : art;

    // For videos, use display_uri or thumbnail_uri as preview
    // For images, use extra[0].uri or display_uri
    const isVideo = imageData.extra[0]?.mime_type?.startsWith("video/");
    const isAnimated = imageData.extra[0]?.mime_type === "image/gif";

    // Try multiple fallback options
    let imageUrl = null;
    if (isVideo) {
      // For videos, try display_uri first, then thumbnail_uri
      imageUrl =
        ipfsHashToUrl(imageData.display_uri) ||
        ipfsHashToUrl(imageData.thumbnail_uri);
    } else {
      // For images, try extra[0].uri first, then display_uri
      imageUrl =
        ipfsHashToUrl(imageData.extra[0]?.uri) ||
        ipfsHashToUrl(imageData.display_uri);
    }

    if (!imageUrl || error) {
      // If we have any URI at all, try to use it as a fallback
      const fallbackUrl =
        ipfsHashToUrl(imageData.display_uri) ||
        ipfsHashToUrl(imageData.thumbnail_uri) ||
        ipfsHashToUrl(imageData.extra[0]?.uri);

      if (fallbackUrl && !error) {
        // Try the fallback URL
        return (
          <div style={{ position: "relative", width, height }}>
            <Image
              src={fallbackUrl}
              alt={imageData.name || "Digital art"}
              width={width}
              height={height}
              priority={priority}
              unoptimized={true} // Don't optimize fallback images
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
              onClick={onClick}
              style={{
                objectFit: "contain",
                cursor: onClick ? "pointer" : "default",
                opacity: loading ? 0 : 1,
                transition: "opacity 0.3s ease",
              }}
            />
          </div>
        );
      }

      return (
        <div
          style={{
            width,
            height,
            backgroundColor: "#333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #555",
            borderRadius: "4px",
          }}
          onClick={onClick}
        >
          <span
            style={{ color: "#999", fontSize: "12px", textAlign: "center" }}
          >
            {isVideo ? "Video preview unavailable" : "Image unavailable"}
          </span>
        </div>
      );
    }

    return (
      <div style={{ position: "relative", width, height }}>
        {loading && (
          <Skeleton
            variant="rectangular"
            width={width}
            height={height}
            sx={{ position: "absolute", top: 0, left: 0 }}
          />
        )}
        <Image
          src={imageUrl}
          alt={imageData.name || "Digital art"}
          width={width}
          height={height}
          priority={priority}
          unoptimized={isAnimated} // Don't optimize animated images
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          onClick={onClick}
          style={{
            objectFit: "contain",
            cursor: onClick ? "pointer" : "default",
            opacity: loading ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";
