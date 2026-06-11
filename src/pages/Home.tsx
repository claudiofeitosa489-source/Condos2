import { useState } from "react";
import GameModal from "@/components/GameModal";

export interface Game {
  id: number;
  name: string;
  tag: string;
  tagColor: string;
  players: string;
  icon: string;
  description: string;
  serverLink: string;
  placeId: string;
  rating: string;
  genre: string;
}

const GAMES: Game[] = [
  {
    id: 1,
    name: "Condo World v2",
    tag: "POPULAR",
    tagColor: "#3b82f6",
    players: "1.2K",
    icon: "🏠",
    description: "The ultimate condo experience. Join thousands of players in this fully customizable world.",
    serverLink: "https://abrir.link/gmpvB",
    placeId: "123456789",
    rating: "4.9",
    genre: "Social",
  },
  {
    id: 2,
    name: "Dark Condo Hub",
    tag: "NEW",
    tagColor: "#22c55e",
    players: "876",
    icon: "🌙",
    description: "A dark-themed condo hub with exclusive rooms and features.",
    serverLink: "https://abre.ai/pnsQ",
    placeId: "987654321",
    rating: "4.7",
    genre: "Social",
  },
  {
    id: 3,
    name: "Neon City Condo",
    tag: "HOT",
    tagColor: "#f97316",
    players: "2.3K",
    icon: "🌆",
    description: "Experience the future in this neon-lit city condo with amazing visuals.",
    serverLink: "https://abre.ai/pnsS",
    placeId: "112233445",
    rating: "4.8",
    genre: "Adventure",
  },
  {
    id: 4,
    name: "Sky Lounge Premium",
    tag: "VIP",
    tagColor: "#a855f7",
    players: "540",
    icon: "☁️",
    description: "An exclusive sky lounge with premium features and private rooms.",
    serverLink: "https://abre.ai/pnsV",
    placeId: "556677889",
    rating: "5.0",
    genre: "Social",
  },
  {
    id: 5,
    name: "Underground Base",
    tag: "TRENDING",
    tagColor: "#eab308",
    players: "1.8K",
    icon: "⚡",
    description: "Go underground in this massive base with hidden rooms and secret areas.",
    serverLink: "https://abrir.link/gmpvB",
    placeId: "998877665",
    rating: "4.6",
    genre: "Action",
  },
  {
    id: 6,
    name: "Ocean View Villa",
    tag: "POPULAR",
    tagColor: "#3b82f6",
    players: "990",
    icon: "🌊",
    description: "Relax in this stunning ocean-side villa with breathtaking views.",
    serverLink: "https://abre.ai/pnsQ",
    placeId: "334455667",
    rating: "4.8",
    genre: "Social",
  },
  {
    id: 7,
    name: "Cyberpunk District",
    tag: "NEW",
    tagColor: "#22c55e",
    players: "3.1K",
    icon: "🤖",
    description: "Dive into a cyberpunk-themed district with high-tech gadgets and unique gameplay.",
    serverLink: "https://abre.ai/pnsS",
    placeId: "778899001",
    rating: "4.9",
    genre: "Sci-Fi",
  },
  {
    id: 8,
    name: "Tropical Paradise",
    tag: "HOT",
    tagColor: "#f97316",
    players: "1.5K",
    icon: "🌴",
    description: "A tropical paradise with white sandy beaches and crystal clear waters.",
    serverLink: "https://abre.ai/pnsV",
    placeId: "445566778",
    rating: "4.7",
    genre: "Social",
  },
];

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [search, setSearch] = useState("");

  const filtered = GAMES.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
      {/* ── Header ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(4, 9, 19, 0.80)",
          borderBottom: "1px solid rgba(59, 130, 246, 0.14)",
          boxShadow: "0 1px 0 rgba(59,130,246,0.08), 0 4px 40px rgba(4,9,19,0.8)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 1.25rem",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo + name */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
                boxShadow: "0 0 20px rgba(59,130,246,0.55), 0 0 0 1px rgba(59,130,246,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
              }}
            >
              🎮
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.05rem",
                letterSpacing: "-0.02em",
                background: "linear-gradient(90deg, #fff 40%, rgba(147,197,253,0.9) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Roblox.game
            </span>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#93c5fd",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              Games
            </span>
            <a
              href="https://discord.gg/E8gXpFDtw"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: "0.82rem",
                fontWeight: 500,
                color: "rgba(148,163,184,0.7)",
                cursor: "pointer",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#c4b5fd"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(148,163,184,0.7)"; }}
            >
              Discord
            </a>
            <a
              href="https://abre.ai/pnRe"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#fbbf24",
                cursor: "pointer",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 12px",
                borderRadius: "99px",
                background: "rgba(251,191,36,0.10)",
                border: "1px solid rgba(251,191,36,0.25)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(251,191,36,0.18)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(251,191,36,0.5)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(251,191,36,0.10)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(251,191,36,0.25)";
              }}
            >
              💛 Donate
            </a>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "3.5rem 1.25rem 2rem",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Welcome badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 14px",
            borderRadius: "9999px",
            background: "rgba(37,99,235,0.12)",
            border: "1px solid rgba(59,130,246,0.28)",
            boxShadow: "0 0 12px rgba(59,130,246,0.1)",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#3b82f6",
              boxShadow: "0 0 8px rgba(59,130,246,0.8)",
              display: "inline-block",
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#93c5fd", letterSpacing: "0.06em" }}>
            LIVE — {GAMES.reduce((a, g) => a + parseFloat(g.players), 0).toFixed(0)}+ PLAYERS ONLINE
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: "1rem",
            background: "linear-gradient(180deg, #fff 0%, rgba(147,197,253,0.8) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          The Best{" "}
          <span
            style={{
              color: "#60a5fa",
              WebkitTextFillColor: "#60a5fa",
              textShadow: "0 0 30px rgba(96,165,250,0.4)",
            }}
          >
            Condo
          </span>{" "}
          Games
        </h1>

        <p
          style={{
            fontSize: "1rem",
            color: "rgba(148,163,184,0.8)",
            maxWidth: "480px",
            margin: "0 auto 2rem",
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Discover and join the most popular Roblox condo games. Updated daily with the latest servers.
        </p>

        {/* Search */}
        <div
          style={{
            maxWidth: "420px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 20px 12px 44px",
              borderRadius: "14px",
              background: "rgba(37,99,235,0.07)",
              border: "1px solid rgba(59,130,246,0.2)",
              color: "#e2e8f0",
              fontSize: "0.9rem",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(59,130,246,0.5)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(59,130,246,0.2)")}
          />
          <span
            style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "16px",
              opacity: 0.5,
            }}
          >
            🔍
          </span>
        </div>
      </div>

      {/* ── Games List ── */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 1.25rem 4rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              background: "linear-gradient(90deg, #fff 0%, rgba(147,197,253,0.85) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            Featured Games
          </h2>
          <span style={{ fontSize: "0.78rem", color: "#60a5fa", fontWeight: 500 }}>
            {filtered.length} games
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {filtered.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} onClick={() => setSelectedGame(game)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "rgba(148,163,184,0.5)",
              fontSize: "0.9rem",
            }}
          >
            No games found for "{search}"
          </div>
        )}
      </div>

      {/* ── Donations Banner ── */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 1.25rem 2rem",
        }}
      >
        <a
          href="https://abre.ai/pnRe"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "1.1rem 1.5rem",
            borderRadius: "1.25rem",
            background: "linear-gradient(135deg, rgba(120,80,0,0.18) 0%, rgba(251,191,36,0.07) 100%)",
            border: "1px solid rgba(251,191,36,0.22)",
            boxShadow: "0 4px 24px rgba(251,191,36,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
            textDecoration: "none",
            transition: "all 0.25s ease",
            cursor: "pointer",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(251,191,36,0.45)";
            (e.currentTarget as HTMLAnchorElement).style.background = "linear-gradient(135deg, rgba(120,80,0,0.28) 0%, rgba(251,191,36,0.12) 100%)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 32px rgba(251,191,36,0.14), inset 0 1px 0 rgba(255,255,255,0.06)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(251,191,36,0.22)";
            (e.currentTarget as HTMLAnchorElement).style.background = "linear-gradient(135deg, rgba(120,80,0,0.18) 0%, rgba(251,191,36,0.07) 100%)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 24px rgba(251,191,36,0.06), inset 0 1px 0 rgba(255,255,255,0.04)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #92400e, #d97706)",
                boxShadow: "0 0 20px rgba(217,119,6,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                flexShrink: 0,
              }}
            >
              💛
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "#fde68a",
                  letterSpacing: "-0.01em",
                  marginBottom: "2px",
                }}
              >
                Support the Creator — Donations
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(251,191,36,0.55)", fontWeight: 500 }}>
                Gostou do site? Considere apoiar o criador 💛
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 16px",
              borderRadius: "99px",
              background: "rgba(251,191,36,0.15)",
              border: "1px solid rgba(251,191,36,0.3)",
              color: "#fbbf24",
              fontSize: "0.8rem",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            Donate →
          </div>
        </a>
      </div>

      {/* ── Modal ── */}
      {selectedGame && (
        <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

function GameCard({ game, index, onClick }: { game: Game; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.25rem",
        borderRadius: "1.25rem",
        background: hovered
          ? "linear-gradient(135deg, rgba(20,35,75,0.95) 0%, rgba(14,24,55,0.95) 100%)"
          : "linear-gradient(135deg, rgba(15,25,55,0.9) 0%, rgba(10,18,42,0.9) 100%)",
        border: hovered
          ? "1px solid rgba(59,130,246,0.35)"
          : "1px solid rgba(59,130,246,0.12)",
        boxShadow: hovered
          ? "0 0 0 1px rgba(59,130,246,0.15), 0 8px 40px rgba(59,130,246,0.12), 0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)"
          : "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Rank */}
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          color: "rgba(148,163,184,0.4)",
          width: "20px",
          flexShrink: 0,
          textAlign: "center",
        }}
      >
        {index + 1}
      </span>

      {/* Icon */}
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
          boxShadow: "0 0 20px rgba(37,99,235,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          flexShrink: 0,
        }}
      >
        {game.icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {game.name}
          </span>
          <span
            style={{
              padding: "2px 7px",
              borderRadius: "6px",
              background: `${game.tagColor}22`,
              border: `1px solid ${game.tagColor}55`,
              color: game.tagColor,
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}
          >
            {game.tag}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.6)" }}>
            👥 {game.players} online
          </span>
          <span style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.4)" }}>
            {game.genre}
          </span>
        </div>
      </div>

      {/* Rating + arrow */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <span style={{ fontSize: "0.78rem", color: "#fbbf24", fontWeight: 600 }}>
          ★ {game.rating}
        </span>
        <span
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: "#60a5fa",
            transition: "transform 0.2s",
            transform: hovered ? "translateX(2px)" : "translateX(0)",
          }}
        >
          →
        </span>
      </div>

      {/* Shimmer left edge */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "15%",
            bottom: "15%",
            width: "2px",
            background: "linear-gradient(180deg, transparent, #3b82f6, transparent)",
            borderRadius: "9999px",
          }}
        />
      )}
    </button>
  );
}
