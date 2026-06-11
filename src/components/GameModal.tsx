import { useState, useEffect } from "react";
import type { Game } from "@/pages/Home";

interface GameModalProps {
  game: Game;
  onClose: () => void;
}

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "RBX-";
  for (let i = 0; i < 32; i++) {
    if (i > 0 && i % 8 === 0) token += "-";
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export default function GameModal({ game, onClose }: GameModalProps) {
  const [token, setToken] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPlaceId, setCopiedPlaceId] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setToken(generateToken());
      setGenerating(false);
    }, 800);
  };

  const handleCopy = (text: string, type: "token" | "placeId") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "token") {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } else {
        setCopiedPlaceId(true);
        setTimeout(() => setCopiedPlaceId(false), 1800);
      }
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(4, 9, 19, 0.82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        data-testid="modal-game"
        data-game={game.name}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "1.5rem",
          background: "linear-gradient(180deg, rgba(12,22,50,0.98) 0%, rgba(8,16,38,0.98) 100%)",
          border: "1px solid rgba(59,130,246,0.2)",
          boxShadow:
            "0 0 0 1px rgba(59,130,246,0.08), 0 40px 80px rgba(0,0,0,0.8), 0 0 100px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(40px)",
          overflow: "hidden",
          position: "relative",
          animation: "modalIn 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Top glow line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.6), transparent)",
            zIndex: 1,
          }}
        />

        {/* Banner */}
        <div
          style={{
            height: "100px",
            background: "linear-gradient(180deg, #0a1833 0%, #060d22 100%)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)",
              top: "-60px",
              left: "-40px",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
              bottom: "-40px",
              right: "20px",
            }}
          />
          <span style={{ fontSize: "3rem", zIndex: 1 }}>{game.icon}</span>

          {/* Close button */}
          <button
            data-testid="button-close-modal"
            onClick={onClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "rgba(37,99,235,0.12)",
              border: "1px solid rgba(59,130,246,0.2)",
              color: "#93c5fd",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              zIndex: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(59,130,246,0.2)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(37,99,235,0.12)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "1.25rem" }}>
          {/* Title + tag */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#f1f5f9",
                letterSpacing: "-0.02em",
              }}
            >
              {game.name}
            </h3>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: "6px",
                background: `${game.tagColor}22`,
                border: `1px solid ${game.tagColor}55`,
                color: game.tagColor,
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              {game.tag}
            </span>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "12px",
              fontSize: "0.78rem",
              color: "rgba(148,163,184,0.6)",
            }}
          >
            <span>👥 {game.players} online</span>
            <span>⭐ {game.rating}/5.0</span>
            <span>🎮 {game.genre}</span>
          </div>

          <p
            style={{
              fontSize: "0.82rem",
              color: "rgba(148,163,184,0.7)",
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
          >
            {game.description}
          </p>

          {/* Place ID */}
          <div
            style={{
              borderRadius: "12px",
              background: "rgba(37,99,235,0.05)",
              border: "1px solid rgba(59,130,246,0.12)",
              padding: "12px 14px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 600,
                color: "rgba(148,163,184,0.5)",
                letterSpacing: "0.06em",
                marginBottom: "8px",
              }}
            >
              PLACE ID
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  flex: 1,
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  color: "#93c5fd",
                  letterSpacing: "0.02em",
                }}
              >
                {game.placeId}
              </span>
              <button
                onClick={() => handleCopy(game.placeId, "placeId")}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  background: copiedPlaceId ? "rgba(34,197,94,0.15)" : "rgba(37,99,235,0.1)",
                  border: copiedPlaceId ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(59,130,246,0.18)",
                  color: copiedPlaceId ? "#4ade80" : "#60a5fa",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                {copiedPlaceId ? "✓" : "⧉"}
              </button>
            </div>
          </div>

          {/* Token display */}
          {token && (
            <div
              style={{
                borderRadius: "12px",
                background: "rgba(37,99,235,0.05)",
                border: "1px solid rgba(59,130,246,0.12)",
                padding: "12px 14px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  color: "rgba(148,163,184,0.5)",
                  letterSpacing: "0.06em",
                  marginBottom: "8px",
                }}
              >
                ACCESS TOKEN
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    flex: 1,
                    fontFamily: "monospace",
                    fontSize: "0.68rem",
                    color: "#93c5fd",
                    letterSpacing: "0.02em",
                    wordBreak: "break-all",
                  }}
                >
                  {token}
                </span>
                <button
                  onClick={() => handleCopy(token, "token")}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    background: copied ? "rgba(34,197,94,0.15)" : "rgba(37,99,235,0.1)",
                    border: copied ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(59,130,246,0.18)",
                    color: copied ? "#4ade80" : "#60a5fa",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  {copied ? "✓" : "⧉"}
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
            <button
              data-testid="button-generate-token"
              onClick={handleGenerate}
              disabled={generating}
              style={{
                width: "100%",
                padding: "11px 16px",
                borderRadius: "0.9rem",
                background: generating
                  ? "rgba(37,99,235,0.2)"
                  : "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 60%, #2563eb 100%)",
                border: "none",
                color: "#fff",
                fontFamily: "inherit",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: "0.01em",
                cursor: generating ? "not-allowed" : "pointer",
                boxShadow: generating
                  ? "none"
                  : "0 0 0 1px rgba(59,130,246,0.3), 0 4px 20px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                if (!generating) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {generating ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
                  Generating...
                </>
              ) : (
                <>🔑 Generate Token</>
              )}
            </button>

            <a
              data-testid="button-access-game"
              href={token ? game.serverLink : "#"}
              target={token ? "_blank" : undefined}
              rel="noreferrer"
              onClick={(e) => {
                if (!token) {
                  e.preventDefault();
                }
              }}
              style={{
                width: "100%",
                padding: "11px 16px",
                borderRadius: "0.9rem",
                background: token ? "rgba(37,99,235,0.08)" : "rgba(37,99,235,0.04)",
                border: token
                  ? "1px solid rgba(59,130,246,0.22)"
                  : "1px solid rgba(59,130,246,0.08)",
                color: token ? "#93c5fd" : "rgba(148,163,184,0.35)",
                fontFamily: "inherit",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: token ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                textDecoration: "none",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                if (token) {
                  e.currentTarget.style.background = "rgba(59,130,246,0.14)";
                  e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = token ? "rgba(37,99,235,0.08)" : "rgba(37,99,235,0.04)";
                e.currentTarget.style.borderColor = token
                  ? "rgba(59,130,246,0.22)"
                  : "rgba(59,130,246,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🎮 Access Game
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
