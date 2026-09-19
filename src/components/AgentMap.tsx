import { LuizaAvatar } from "@/components/LuizaAvatar";
import { FaRobot } from "react-icons/fa";

export type FloatingNode = {
  id: string;
  label: string;
  color: string;
  top: string;
  left: string;
};

export function AgentMap({ nodes }: { nodes: FloatingNode[] }) {
  return (
    <div className="relative mx-auto h-[620px] w-full max-w-4xl overflow-hidden rounded-2xl border border-foreground/10 bg-background">
      
      {/* Nova animação de Bate e Volta (Request -> Processing -> Response) */}
      <style>
        {nodes
          .map(
            (node) => `
          @keyframes ping-pong-${node.id} {
            0% { top: 50%; left: 50%; opacity: 0; }
            5% { top: 50%; left: 50%; opacity: 1; }    /* Nasce no centro */
            45% { top: ${node.top}; left: ${node.left}; opacity: 1; } /* Bate no subagente */
            55% { top: ${node.top}; left: ${node.left}; opacity: 1; } /* Pausa rápida (processando) */
            95% { top: 50%; left: 50%; opacity: 1; }   /* Volta pro centro */
            100% { top: 50%; left: 50%; opacity: 0; }  /* Some no centro */
          }
        `
          )
          .join("\n")}
      </style>

      {/* Grid de fundo fixo */}
      <div
        className="absolute inset-0 text-foreground opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* WRAPPER: Removi o "translate-x-12" pra deixar tudo bem centralizado de novo. 
          Se achar que precisa empurrar de novo, só colocar aqui! */}
      <div className="absolute inset-0 hover:cursor-move transition-transform duration-500">
        
        {/* 1. CAMADA INFERIOR (z-0): AS LINHAS ESTÁTICAS */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none z-0">
          {nodes.map((node) => (
            <line
              key={`line-${node.id}`}
              x1="50%"
              y1="50%"
              x2={node.left}
              y2={node.top}
              stroke={node.color}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-30"
            />
          ))}
        </svg>

        {/* 2. CAMADA DO MEIO (z-10): AS BOLINHAS DE DADOS (INDO E VINDO) */}
        {nodes.map((node, i) => (
          <div
            key={`data-${node.id}`}
            style={{
              backgroundColor: node.color,
              animationName: `ping-pong-${node.id}`,
              animationDuration: "4s", /* Aumentei de 3s para 4s pra dar tempo do bate e volta ficar suave */
              animationDelay: `${i * 0.4}s`,
              animationTimingFunction: "ease-in-out", /* Freia nas pontas, acelera no meio */
              animationIterationCount: "infinite",
              boxShadow: `0 0 10px 2px ${node.color}80`,
            }}
            className="absolute z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          />
        ))}

        {/* 3. CENTRO (z-30): ORQUESTRADORA LUIZA */}
        <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <LuizaAvatar />
          <span className="mt-2 text-sm font-semibold tracking-wider text-pink-400 drop-shadow-md">
            
          </span>
        </div>

        {/* 4. CAMADA SUPERIOR (z-20): BALÕES ESTÁTICOS COM FUNDO SÓLIDO */}
        {nodes.map((node, i) => (
          <div
            key={node.id}
            style={{ top: node.top, left: node.left }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <div
              style={{
                borderColor: node.color,
                boxShadow: `0 4px 12px ${node.color}15`,
              }}
              className="flex max-w-[150px] items-center gap-2 rounded-2xl border bg-background px-3 py-2 text-[11px] font-medium leading-tight text-foreground transition-transform hover:scale-105 cursor-default"
            >
              <span
                style={{ backgroundColor: node.color }}
                className="h-2 w-2 shrink-0 rounded-full animate-pulse shadow-sm"
              />
              <FaRobot style={{ color: node.color }} className="shrink-0 text-sm" />
              <span style={{ color: node.color }}>{node.label}</span>
            </div>
          </div>
        ))}

      </div>
    </div>
    
  );
}