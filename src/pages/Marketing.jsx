import { useState } from "react";
import { TrendingUp, Target, BarChart3 } from "lucide-react";
import MarketingComercial from "./MarketingComercial";
import MarketingOrcado from "./MarketingOrcado";
import MarketingIndicadores from "./MarketingIndicadores";

const TABS = [
  { id: "indicadores", label: "Indicadores Estratégicos", icon: BarChart3 },
  { id: "comercial", label: "Comercial Estratégico", icon: TrendingUp },
  { id: "orcado", label: "Orçado vs Realizado", icon: Target },
];

export default function Marketing() {
  const [tab, setTab] = useState("comercial");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[#DDE3DE] rounded-xl p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id
                ? "bg-[#1A4731] text-white shadow-sm"
                : "text-[#5C7060] hover:bg-[#F4F6F4]"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "indicadores" && <MarketingIndicadores />}
      {tab === "comercial" && <MarketingComercial />}
      {tab === "orcado" && <MarketingOrcado />}
    </div>
  );
}