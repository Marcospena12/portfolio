export function LuizaAvatar() {
  return (
    <div className="relative h-32 w-32 flex items-center justify-center">
      {/* Glow externo bem suave e sutil */}
      <div className="absolute inset-0 rounded-full bg-pink-400 opacity-15 blur-2xl glow-pulse" />
      
      <svg viewBox="0 0 150 150" className="relative h-full w-full">
        <defs>
          {/* Gradiente suave e escuro para o chassi, permitindo contraste */}
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#221e24" />
            <stop offset="100%" stopColor="#121015" />
          </linearGradient>
          
          {/* Gradiente rosa delicado para os olhos */}
          <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>

        {/* Antena superior refinada */}
        <line x1="75" y1="38" x2="75" y2="20" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="75" cy="16" r="3.5" fill="#fbcfe8" />
        <circle cx="75" cy="35" r="4" fill="#f472b6" />

        {/* Corpo principal escuro para destacar os detalhes claros/rosas */}
        <rect 
          x="32" y="38" width="86" height="74" rx="24" 
          fill="url(#bodyGradient)" 
          stroke="#f472b6" 
          strokeWidth="1.5" 
          opacity="0.95" 
        />

        {/* Detalhes de circuito delicados e visíveis */}
        <path d="M48 55 L60 55 M54 48 L54 62" fill="none" stroke="#f472b6" strokeWidth="1" opacity="0.5" strokeLinecap="round"/>
        <path d="M102 55 L90 55 M96 48 L96 62" fill="none" stroke="#f472b6" strokeWidth="1" opacity="0.5" strokeLinecap="round"/>

        {/* Olhos expressivos com cílios visíveis */}
        <g className="eye" transform="translate(0, 4)">
          <circle cx="58" cy="70" r="10" fill="url(#eyeGradient)" />
          <circle cx="55" cy="67" r="2" fill="#ffffff" opacity="0.8" />
          {/* Cílios */}
          <path d="M47 64 C 47 60, 51 58, 55 60" stroke="#f472b6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M50 62 C 50 58, 53 56, 57 58" stroke="#f472b6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>

        <g className="eye" transform="translate(0, 4)">
          <circle cx="92" cy="70" r="10" fill="url(#eyeGradient)" />
          <circle cx="89" cy="67" r="2" fill="#ffffff" opacity="0.8" />
          {/* Cílios */}
          <path d="M103 64 C 103 60, 99 58, 95 60" stroke="#f472b6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M100 62 C 100 58, 97 56, 93 58" stroke="#f472b6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>

        {/* Sorriso suave */}
        <path d="M 65 90 Q 75 97 85 90" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </svg>
    </div>
  );
}