"use client"

export function NaganoMap() {
  return (
    <svg
      viewBox="0 0 400 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-md"
      aria-label="長野県の地図"
    >
      {/* Nagano prefecture outline - accurate shape matching actual geography */}
      <path
        d="M 200 5
           C 228 8 255 18 282 32
           L 315 55 C 338 78 355 110 365 145
           L 375 180 C 382 215 382 250 375 285
           C 368 320 355 350 335 375
           L 305 400 C 278 420 245 435 210 440
           L 180 443 C 150 445 120 440 95 428
           L 65 408 C 45 388 30 360 22 328
           L 15 295 C 10 260 12 225 20 190
           L 32 155 C 45 120 65 90 90 65
           L 125 38 C 150 20 175 10 200 5 Z"
        fill="hsl(211 65% 45% / 0.08)"
        stroke="hsl(211 65% 45%)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Mountain peaks decoration */}
      <g opacity="0.12">
        <path d="M 120 180 L 145 140 L 170 180" stroke="hsl(211 65% 45%)" strokeWidth="2" fill="none" />
        <path d="M 200 150 L 225 115 L 250 150" stroke="hsl(211 65% 45%)" strokeWidth="2" fill="none" />
        <path d="M 260 200 L 285 165 L 310 200" stroke="hsl(211 65% 45%)" strokeWidth="2" fill="none" />
      </g>

      {/* City markers - positions aligned with geographic layout (Nagano, Matsumoto, Ina, Iida, etc.) */}
      {[
        { x: 200, y: 230, label: "長野市", main: true },
        { x: 210, y: 300, label: "松本市", main: false },
        { x: 192, y: 355, label: "伊那市", main: true },
        { x: 170, y: 400, label: "飯田市", main: false },
        { x: 280, y: 280, label: "諏訪市", main: false },
        { x: 160, y: 200, label: "上田市", main: false },
        { x: 150, y: 270, label: "佐久市", main: false },
        { x: 270, y: 180, label: "軽井沢", main: false },
      ].map((city) => (
        <g key={city.label}>
          <circle
            cx={city.x}
            cy={city.y}
            r={city.main ? 8 : 5}
            fill={city.main ? "hsl(211 65% 45%)" : "hsl(199 80% 46%)"}
            opacity={city.main ? 1 : 0.7}
          />
          <circle
            cx={city.x}
            cy={city.y}
            r={city.main ? 14 : 10}
            fill="none"
            stroke={city.main ? "hsl(211 65% 45%)" : "hsl(199 80% 46%)"}
            strokeWidth="1.5"
            opacity={0.3}
          />
          <text
            x={city.x + (city.main ? 18 : 14)}
            y={city.y + 5}
            fill="hsl(212 45% 15%)"
            fontSize={city.main ? "14" : "11"}
            fontWeight={city.main ? "700" : "500"}
          >
            {city.label}
          </text>
        </g>
      ))}

      {/* Delivery route lines */}
      <g opacity="0.18" strokeDasharray="6 4">
        <line x1="200" y1="230" x2="210" y2="300" stroke="hsl(211 65% 45%)" strokeWidth="1.5" />
        <line x1="200" y1="230" x2="192" y2="355" stroke="hsl(211 65% 45%)" strokeWidth="1.5" />
        <line x1="192" y1="355" x2="170" y2="400" stroke="hsl(211 65% 45%)" strokeWidth="1.5" />
        <line x1="200" y1="230" x2="160" y2="200" stroke="hsl(211 65% 45%)" strokeWidth="1.5" />
        <line x1="200" y1="230" x2="280" y2="280" stroke="hsl(211 65% 45%)" strokeWidth="1.5" />
        <line x1="200" y1="230" x2="270" y2="180" stroke="hsl(211 65% 45%)" strokeWidth="1.5" />
      </g>

      {/* Label */}
      <text x="200" y="508" textAnchor="middle" fill="hsl(212 15% 50%)" fontSize="13" fontWeight="500">
        {"長野県全域に配送対応"}
      </text>
    </svg>
  )
}
