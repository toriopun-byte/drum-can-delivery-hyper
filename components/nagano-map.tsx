"use client"

export function NaganoMap() {
  // 実際の地理データに基づく詳細な長野県の輪郭パス
  // viewBox="0 0 400 520" に合わせてスケール調整済み
  const naganoOutlinePath = `
    M 274.5 18.2 L 266.8 25.1 L 260.3 34.8 L 251.2 38.5 L 239.5 42.3 
    L 228.7 36.9 L 215.4 32.5 L 203.1 29.8 L 189.2 42.6 L 178.5 58.3 
    L 168.1 71.2 L 154.3 74.9 L 140.5 77.4 L 125.2 81.3 L 112.8 95.6 
    L 105.4 108.2 L 108.3 122.5 L 115.7 138.1 L 125.6 154.8 L 121.3 175.2 
    L 115.2 195.4 L 104.3 212.6 L 90.5 228.1 L 78.2 245.3 L 72.1 263.5 
    L 76.4 282.1 L 82.5 298.4 L 78.3 315.2 L 73.4 331.8 L 71.2 345.6 
    L 78.5 362.3 L 85.1 378.5 L 89.4 395.1 L 93.8 412.5 L 97.3 430.2 
    L 102.5 448.6 L 115.8 462.3 L 131.2 471.5 L 148.5 478.6 L 165.2 485.4 
    L 179.3 482.1 L 192.5 471.3 L 205.4 455.8 L 213.7 438.2 L 221.5 418.5 
    L 229.3 399.6 L 236.1 381.2 L 244.5 364.3 L 255.2 352.8 L 268.4 342.1 
    L 282.1 331.5 L 298.5 323.2 L 315.6 318.4 L 332.8 312.5 L 348.1 302.3 
    L 354.2 285.6 L 351.5 268.1 L 345.3 251.4 L 338.7 235.6 L 342.4 218.5 
    L 351.8 203.2 L 364.5 190.1 L 375.2 178.3 L 362.1 165.8 L 348.5 158.2 
    L 331.2 152.4 L 315.6 145.8 L 302.3 134.5 L 294.1 118.2 L 289.5 102.3 
    L 293.2 88.1 L 305.4 75.6 L 318.7 62.3 L 328.5 48.2 L 315.2 35.6 
    L 302.1 28.3 L 288.4 22.1 Z
  `

  return (
    <svg
      viewBox="0 0 400 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-md"
      aria-label="長野県の地図"
    >
      {/* Nagano prefecture outline - 実際の地形に基づく詳細なパス */}
      <path
        d={naganoOutlinePath}
        fill="hsl(211 65% 45% / 0.08)"
        stroke="hsl(211 65% 45%)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Mountain peaks decoration - 新しい地形に合わせて位置調整 */}
      <g opacity="0.15">
        {/* 北アルプス方面 */}
        <path
          d="M 90 185 L 108 160 L 125 185"
          stroke="hsl(211 65% 45%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />
        {/* 中央アルプス方面 */}
        <path
          d="M 118 345 L 136 315 L 154 345"
          stroke="hsl(211 65% 45%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />
        {/* 八ヶ岳方面 */}
        <path
          d="M 238 265 L 256 235 L 274 265"
          stroke="hsl(211 65% 45%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />
      </g>

      {/* Delivery route lines - 実際の交通網を意識して位置調整 */}
      <g opacity="0.25" strokeDasharray="4 3" stroke="hsl(211 65% 45%)" strokeWidth="1.2">
        <line x1="200" y1="105" x2="150" y2="235" /> {/* 長野 - 松本 */}
        <line x1="150" y1="235" x2="220" y2="275" /> {/* 松本 - 諏訪 */}
        <line x1="220" y1="275" x2="188" y2="320" /> {/* 諏訪 - 伊那 */}
        <line x1="188" y1="320" x2="170" y2="415" /> {/* 伊那 - 飯田 */}
        <line x1="200" y1="105" x2="260" y2="145" /> {/* 長野 - 上田 */}
        <line x1="260" y1="145" x2="308" y2="210" /> {/* 上田 - 佐久 */}
        <line x1="308" y1="210" x2="348" y2="185" /> {/* 佐久 - 軽井沢 */}
        <line x1="260" y1="145" x2="220" y2="275" /> {/* 上田 - 諏訪 */}
      </g>

      {/* City markers - 新しい詳細地形に合わせて座標を再調整 */}
      {[
        { x: 200, y: 105, label: "長野市", main: true },
        { x: 150, y: 235, label: "松本市", main: false },
        { x: 188, y: 320, label: "伊那市", main: true },
        { x: 170, y: 415, label: "飯田市", main: false },
        { x: 220, y: 275, label: "諏訪市", main: false },
        { x: 260, y: 145, label: "上田市", main: false },
        { x: 308, y: 210, label: "佐久市", main: false },
        { x: 348, y: 185, label: "軽井沢", main: false },
      ].map((city) => (
        <g key={city.label}>
          <circle
            cx={city.x}
            cy={city.y}
            r={city.main ? 6.5 : 4}
            fill={city.main ? "hsl(211 65% 45%)" : "hsl(199 80% 46%)"}
            opacity={city.main ? 1 : 0.8}
          />
          <circle
            cx={city.x}
            cy={city.y}
            r={city.main ? 13 : 9}
            fill="none"
            stroke={city.main ? "hsl(211 65% 45%)" : "hsl(199 80% 46%)"}
            strokeWidth="1.2"
            opacity={0.25}
          />
          <text
            x={city.x + (city.main ? 15 : 11)}
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
