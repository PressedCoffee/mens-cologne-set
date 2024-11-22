"use client";

export default function BuyButton({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        padding: "12px 24px",
        backgroundColor: "#1a1a1a",
        color: "white",
        textDecoration: "none",
        textTransform: "uppercase",
        letterSpacing: "1px",
        fontSize: "14px",
        border: "1px solid #333",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#333";
        e.currentTarget.style.borderColor = "#D4AF37";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "#1a1a1a";
        e.currentTarget.style.borderColor = "#333";
      }}
    >
      Buy Now
    </a>
  );
}
