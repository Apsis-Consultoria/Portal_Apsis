import { useState } from "react";
import EstoqueMateriais from "@/components/estoque/EstoqueMateriais";
import EstoqueMovimentacoes from "@/components/estoque/EstoqueMovimentacoes";

export default function Estoque() {
  const [aba, setAba] = useState("materiais");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A2B1F]">Estoque</h1>
        <p className="text-sm text-[#5C7060] mt-1">Controle de materiais e movimentações</p>
      </div>

      {/* Abas */}
      <div className="border-b border-[#DDE3DE] flex gap-0">
        <button
          onClick={() => setAba("materiais")}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            aba === "materiais"
              ? "border-[#F47920] text-[#1A2B1F]"
              : "border-transparent text-[#5C7060] hover:text-[#1A2B1F]"
          }`}
        >
          Cadastro de Materiais
        </button>
        <button
          onClick={() => setAba("movimentacoes")}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            aba === "movimentacoes"
              ? "border-[#F47920] text-[#1A2B1F]"
              : "border-transparent text-[#5C7060] hover:text-[#1A2B1F]"
          }`}
        >
          Movimentações
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="space-y-6">
        {aba === "materiais" && <EstoqueMateriais />}
        {aba === "movimentacoes" && <EstoqueMovimentacoes />}
      </div>
    </div>
  );
}