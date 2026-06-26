"use client";

import React, { useEffect, useState } from "react";

type MascotState = "idle" | "talking" | "correct" | "incorrect";

interface MascotTobiProps {
  state: MascotState;
}

export default function MascotTobi({ state }: MascotTobiProps) {
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    if (state === "correct") {
      setShowStars(true);
      const timer = setTimeout(() => setShowStars(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Determine classes to apply based on mascot state
  const containerClass = `tobi-container tobi-${state}`;

  return (
    <div className={containerClass}>
      <style jsx>{`
        .tobi-container {
          position: relative;
          width: 180px;
          height: 180px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1rem;
        }

        /* SVG Element base animations */
        .tobi-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* Shadow beneath elephant */
        .tobi-shadow {
          fill: rgba(0, 0, 0, 0.15);
          animation: shadow-breath 3s ease-in-out infinite;
          transform-origin: 100px 155px;
        }

        /* Body & Head Breathing Bobbing */
        .tobi-body-group {
          animation: body-breath 3s ease-in-out infinite;
          transform-origin: 100px 110px;
        }

        /* Ears Flapping */
        .ear-left {
          animation: ear-flap-left 3s ease-in-out infinite;
          transform-origin: 75px 75px;
        }
        .ear-right {
          animation: ear-flap-right 3s ease-in-out infinite;
          transform-origin: 125px 75px;
        }

        /* Eyes Blinking */
        .eye {
          animation: eye-blink 5s ease-in-out infinite;
          transform-origin: 90px 75px;
        }
        .eye-r {
          animation: eye-blink 5s ease-in-out infinite;
          transform-origin: 110px 75px;
        }

        /* Trunk (Vòi) breathing / moving */
        .tobi-trunk {
          transform-origin: 100px 85px;
          animation: trunk-move 3s ease-in-out infinite;
        }

        /* --- STATE OVERRIDES --- */

        /* 1. TALKING STATE: Faster bobbing and trunk swing */
        .tobi-talking .tobi-body-group {
          animation: body-talk 0.5s ease-in-out infinite alternate;
        }
        .tobi-talking .tobi-trunk {
          animation: trunk-talk 0.25s ease-in-out infinite alternate;
        }
        .tobi-talking .tobi-shadow {
          animation: shadow-talk 0.5s ease-in-out infinite alternate;
        }

        /* 2. CORRECT STATE: Jump high, rotate ears, happy eyes */
        .tobi-correct .tobi-body-group {
          animation: body-correct 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) 2;
        }
        .tobi-correct .ear-left {
          animation: ear-correct-left 0.3s ease-in-out infinite alternate;
        }
        .tobi-correct .ear-right {
          animation: ear-correct-right 0.3s ease-in-out infinite alternate;
        }
        .tobi-correct .tobi-trunk {
          animation: trunk-correct 0.3s ease-in-out infinite alternate;
        }
        .tobi-correct .tobi-shadow {
          animation: shadow-correct 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) 2;
        }

        /* 3. INCORRECT STATE: Sad sway/wobble side to side */
        .tobi-incorrect .tobi-body-group {
          animation: body-incorrect 0.6s ease-in-out 2;
          transform-origin: 100px 140px;
        }
        .tobi-incorrect .tobi-trunk {
          animation: trunk-incorrect 0.6s ease-in-out 2;
        }
        .tobi-incorrect .tobi-shadow {
          animation: shadow-incorrect 0.6s ease-in-out 2;
        }

        /* --- CSS KEYFRAMES --- */

        @keyframes body-breath {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes shadow-breath {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.92); opacity: 0.7; }
        }

        @keyframes ear-flap-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }

        @keyframes ear-flap-right {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }

        @keyframes eye-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }

        @keyframes trunk-move {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-3deg); }
        }

        /* Talking Animations */
        @keyframes body-talk {
          0% { transform: translateY(0); }
          100% { transform: translateY(-2px); }
        }
        @keyframes shadow-talk {
          0% { transform: scale(1); }
          100% { transform: scale(0.96); }
        }
        @keyframes trunk-talk {
          0% { transform: rotate(0deg) scaleY(1); }
          100% { transform: rotate(10deg) scaleY(0.9); }
        }

        /* Correct (Jump) Animations */
        @keyframes body-correct {
          0% { transform: translateY(0) scaleY(1); }
          30% { transform: translateY(5px) scaleY(0.85); } /* squash */
          50% { transform: translateY(-40px) scaleY(1.1); } /* stretch */
          75% { transform: translateY(-40px) scaleY(1); }
          100% { transform: translateY(0) scaleY(1); }
        }
        @keyframes shadow-correct {
          0% { transform: scale(1); opacity: 1; }
          30% { transform: scale(1.1); opacity: 1; }
          50%, 75% { transform: scale(0.5); opacity: 0.2; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ear-correct-left {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-25deg); }
        }
        @keyframes ear-correct-right {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(25deg); }
        }
        @keyframes trunk-correct {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(20deg); }
        }

        /* Incorrect (Sad wobble) Animations */
        @keyframes body-incorrect {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg) translateY(2px); }
          75% { transform: rotate(5deg) translateY(2px); }
        }
        @keyframes shadow-incorrect {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes trunk-incorrect {
          0%, 100% { transform: rotate(0); }
          50% { transform: rotate(-15deg); }
        }

        /* Celebration Stars */
        .star {
          position: absolute;
          font-size: 1.5rem;
          color: #fca311;
          pointer-events: none;
          z-index: 5;
          animation: float-star 1.5s ease-out forwards;
          opacity: 0;
        }
        .star-1 { top: 20px; left: 20px; animation-delay: 0.1s; }
        .star-2 { top: 10px; right: 30px; animation-delay: 0.3s; }
        .star-3 { top: 50px; left: 140px; animation-delay: 0.2s; }

        @keyframes float-star {
          0% { transform: translateY(20px) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-60px) scale(1.2); opacity: 0; }
        }
      `}</style>

      {/* Floating stars on correct answer */}
      {showStars && (
        <>
          <div className="star star-1">⭐</div>
          <div className="star star-2">✨</div>
          <div className="star star-3">⭐</div>
        </>
      )}

      <svg className="tobi-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow */}
        <ellipse className="tobi-shadow" cx="100" cy="155" rx="45" ry="8" />

        {/* Bouncing Group */}
        <g className="tobi-body-group">
          {/* Back Legs */}
          <rect x="75" y="125" width="16" height="25" rx="8" fill="#708090" />
          <rect x="109" y="125" width="16" height="25" rx="8" fill="#708090" />

          {/* Body */}
          <ellipse cx="100" cy="115" rx="48" ry="38" fill="#778899" />
          <ellipse cx="100" cy="115" rx="40" ry="30" fill="#8796a5" />

          {/* Front Legs */}
          <rect x="68" y="125" width="18" height="25" rx="9" fill="#8796a5" />
          <rect x="114" y="125" width="18" height="25" rx="9" fill="#8796a5" />
          {/* Toenails */}
          <circle cx="73" cy="147" r="2.5" fill="#f1f5f9" />
          <circle cx="77" cy="147" r="2.5" fill="#f1f5f9" />
          <circle cx="81" cy="147" r="2.5" fill="#f1f5f9" />
          <circle cx="119" cy="147" r="2.5" fill="#f1f5f9" />
          <circle cx="123" cy="147" r="2.5" fill="#f1f5f9" />
          <circle cx="127" cy="147" r="2.5" fill="#f1f5f9" />

          {/* Tail */}
          <path d="M52,118 Q40,122 42,130" fill="none" stroke="#778899" strokeWidth="4" strokeLinecap="round" />
          <circle cx="42" cy="130" r="3" fill="#475569" />

          {/* Left Ear */}
          <path className="ear-left" d="M72,55 C42,50 35,90 62,100 C72,104 80,85 72,55 Z" fill="#778899" />
          <path className="ear-left" d="M70,60 C48,56 42,85 62,94 C68,97 75,85 70,60 Z" fill="#fda4af" opacity="0.7" />

          {/* Right Ear */}
          <path className="ear-right" d="M128,55 C158,50 165,90 138,100 C128,104 120,85 128,55 Z" fill="#778899" />
          <path className="ear-right" d="M130,60 C152,56 158,85 138,94 C132,97 125,85 130,60 Z" fill="#fda4af" opacity="0.7" />

          {/* Head */}
          <circle cx="100" cy="80" r="36" fill="#8796a5" />

          {/* Blush */}
          <circle cx="78" cy="87" r="5" fill="#fda4af" opacity="0.6" />
          <circle cx="122" cy="87" r="5" fill="#fda4af" opacity="0.6" />

          {/* Eyes (if correct, show happy arc eyes, else standard round eyes) */}
          {state === "correct" ? (
            <>
              {/* Happy eyes: arc pointing up ^ ^ */}
              <path d="M72,78 Q78,70 84,78" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
              <path d="M116,78 Q122,70 128,78" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Normal eyes with blink animation */}
              <ellipse className="eye" cx="78" cy="76" rx="4" ry="5" fill="#1e293b" />
              <ellipse className="eye-r" cx="122" cy="76" rx="4" ry="5" fill="#1e293b" />
              {/* Eye sparkle */}
              <circle className="eye" cx="76.5" cy="74" r="1.5" fill="white" />
              <circle className="eye-r" cx="120.5" cy="74" r="1.5" fill="white" />
            </>
          )}

          {/* Elephant Trunk (Vòi) */}
          <path
            className="tobi-trunk"
            d="M100,85 C93,98 90,113 103,117 C109,119 113,115 111,109"
            fill="none"
            stroke="#8796a5"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
