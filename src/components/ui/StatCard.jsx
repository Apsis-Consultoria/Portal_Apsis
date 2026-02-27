export default function StatCard({ label, value, sub, icon: Icon, color = "gold", trend }) {
  const colors = {
    gold: "bg-[#C9A84C]/10 text-[#C9A84C]",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-500",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-[#E8ECF0] p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-[#6B7A99] uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colors[color]}`}>
            <Icon size={15} />
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-[#0F1B35] leading-tight">{value}</div>
        {sub && <div className="text-xs text-[#6B7A99] mt-1">{sub}</div>}
      </div>
      {trend !== undefined && (
        <div className={`text-xs font-medium ${trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs meta
        </div>
      )}
    </div>
  );
}