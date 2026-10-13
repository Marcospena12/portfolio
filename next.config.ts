import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Renomeação do projeto Luiza → Super-Agente: preserva links externos.
      {
        source: "/projetos/luiza",
        destination: "/projetos/super-agente",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
