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
      {/* Nagano prefecture outline - 実際の長野県のシルエットに合わせたパス */}
      <path
        d="M 280 20 L 260 40 L 240 50 L 220 35 L 200 30 L 170 70 L 140 75 L 120 80 L 105 110 L 110 130 L 130 160 L 125 190 L 110 220 L 70 260 L 80 290 L 75 320 L 70 340 L 85 370 L 90 400 L 95 430 L 100 460 L 130 480 L 160 500 L 180 480 L 200 460 L 210 430 L 220 400 L 230 370 L 240 340 L 260 325 L 280 310 L 310 305 L 350 290 L 340 265 L 330 240 L 345 210 L 370 180 L 340 160 L 310 150 L 295 125 L 290 100 L 310 80 L 330 60 L 305 40 Z"
        fill="hsl(211 65% 45% / 0.08)"
        stroke="hsl(211 65% 45%)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Mountain peaks decoration - 実際の山脈（北アルプス、中央アルプス、八ヶ岳）の位置に調整 */}
      <g opacity="0.15">
        <path d="M 80 180 L 100 150 L 120 180" stroke="hsl(211 65% 45%)" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <path d="M 110 340 L 130 305 L 150 340" stroke="hsl(211 65% 45%)" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <path d="M 235 260 L 255 225 L 275 260" stroke="hsl(211 65% 45%)" strokeWidth="2" fill="none" strokeLinejoin="round" />
      </g>

      {/* Delivery route lines - 実際の交通網（高速道路等）を意識したネットワーク状のルーティング */}
      <g opacity="0.25" strokeDasharray="5 4" stroke="hsl(211 65% 45%)" strokeWidth="1.5">
        <line x1="190" y1="110" x2="140" y2="230" /> {/* 長野 - 松本 */}
        <line x1="140" y1="230" x2="210" y2="270" /> {/* 松本 - 諏訪 */}
        <line x1="210" y1="270" x2="180" y2="310" /> {/* 諏訪 - 伊那 */}
        <line x1="180" y1="310" x2="160" y2="410" /> {/* 伊那 - 飯田 */}
        <line x1="190" y1="110" x2="250" y2="150" /> {/* 長野 - 上田 */}
        <line x1="250" y1="150" x2="300" y2="210" /> {/* 上田 - 佐久 */}
        <line x1="300" y1="210" x2="340" y2="180" /> {/* 佐久 - 軽井沢 */}
        <line x1="250" y1="150" x2="210" y2="270" /> {/* 上田 - 諏訪 */}
      </g>

      {/* City markers - 地形に合わせて実際の地理に近い座標へ修正 */}
      {[
        { x: 190, y: 110, label: "長野市", main: true },
        { x: 140, y: 230, label: "松本市", main: false },
        { x: 180, y: 310, label: "伊那市", main: true },
        { x: 160, y: 410, label: "飯田市", main: false },
        { x: 210, y: 270, label: "諏訪市", main: false },
        { x: 250, y: 150, label: "上田市", main: false },
        { x: 300, y: 210, label: "佐久市", main: false },
        { x: 340, y: 180, label: "軽井沢", main: false },
      ].map((city) => (
        <g key={city.label}>
          <circle
            cx={city.x}
            cy={city.y}
            r={city.main ? 7 : 4.5}
            fill={city.main ? "hsl(211 65% 45%)" : "hsl(199 80% 46%)"}
            opacity={city.main ? 1 : 0.8}
          />
          <circle
            cx={city.x}
            cy={city.y}
            r={city.main ? 14 : 10}
            fill="none"
            stroke={city.main ? "hsl(211 65% 45%)" : "hsl(199 80% 46%)"}
            strokeWidth="1.5"
            opacity={0.25}
          />
          <text
            x={city.x + (city.main ? 16 : 12)}
            y={city.y + 4}
            fill="hsl(212 45% 15%)"
            fontSize={city.main ? "13" : "11"}
            fontWeight={city.main ? "700" : "600"}
          >
            {city.label}
          </text>
        </g>
      ))}

      {/* Label */}
      <text x="200" y="508" textAnchor="middle" fill="hsl(212 15% 50%)" fontSize="13" fontWeight="500">
        長野県全域に配送対応
      </text>
    </svg>
  )
}
