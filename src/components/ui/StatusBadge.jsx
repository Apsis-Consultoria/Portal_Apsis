const configs = {
  "Ganha":        { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Enviada":      { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  "Em elaboração":{ bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  "Perdida":      { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500" },
  "Caducada":     { bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400" },
  "Aberta":       { bg: "bg-sky-50",     text: "text-sky-700",     dot: "bg-sky-500" },
  "Em análise":   { bg: "bg-violet-50",  text: "text-violet-700",  dot: "bg-violet-500" },
  "Encerrada":    { bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400" },
  "Ativo":        { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Pausado":      { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  "Cancelado":    { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500" },
  "Não iniciado": { bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400" },
  "Lançada":      { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  "Faturada":     { bg: "bg-violet-50",  text: "text-violet-700",  dot: "bg-violet-500" },
  "Recebida":     { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Em atraso":    { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500" },
};

export default function StatusBadge({ status }) {
  const c = configs[status] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}