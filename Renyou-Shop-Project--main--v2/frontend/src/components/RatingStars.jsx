import { Star } from "lucide-react";

export default function RatingStars({
  rating = 0,
  reviewCount = 0,
  size = 16,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 2,
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const fill =
            rating >= star
              ? 100
              : rating >= star - 0.5
              ? 50
              : 0;

          return (
            <div
              key={star}
              style={{
                position: "relative",
                width: size,
                height: size,
              }}
            >
              {/* Gray star */}
              <Star
                size={size}
                strokeWidth={2}
                color="#d1d5db"
                fill="transparent"
                style={{
                  position: "absolute",
                  inset: 0,
                }}
              />

              {/* Gold fill */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${fill}%`,
                  overflow: "hidden",
                }}
              >
                <Star
                  size={size}
                  strokeWidth={2}
                  color="#fbbf24"
                  fill="#fbbf24"
                />
              </div>
            </div>
          );
        })}
      </div>

<span className="text-sm text-gray-600 font-medium">
  {reviewCount > 0
    ? `${rating.toFixed(1)} (${reviewCount} ${
        reviewCount === 1 ? "review" : "reviews"
      })`
    : "No reviews yet"}
</span>
    </div>
  );
}