/**
 * ObservacoesLog — Log estruturado de observações com histórico contínuo.
 *
 * Props:
 *   value   : string (JSON array serializado: [{timestamp, user, content}])
 *   onChange: (newJsonString) => void
 *   currentUser: string (nome/email do usuário atual)
 *   readOnly: boolean (opcional)
 */
import { useState, useRef, useEffect } from "react";
import { MessageSquarePlus, Copy, ChevronDown, ChevronUp, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

function parseLog(raw) {
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function ObservacoesLog({ value, onChange, currentUser = "Usuário", readOnly = false, label = "Observações" }) {
  const [entries, setEntries] = useState(() => parseLog(value));
  const [newText, setNewText] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(null);
  const scrollRef = useRef(null);

  // sync de fora → dentro
  useEffect(() => {
    setEntries(parseLog(value));
  }, [value]);

  const addEntry = () => {
    const text = newText.trim();
    if (!text) return;
    const entry = {
      timestamp: new Date().toISOString(),
      user: currentUser,
      content: text,
    };
    const updated = [...entries, entry];
    setEntries(updated);
    onChange(JSON.stringify(updated));
    setNewText("");
    // scroll para o fim
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 50);
  };

  const copyAll = () => {
    const text = entries.map(e => `[${formatDate(e.timestamp)}] ${e.user}\n${e.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied("all");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
        >
          {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          {label}
          {entries.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-semibold">
              {entries.length}
            </span>
          )}
        </button>
        {entries.length > 0 && !collapsed && (
          <button
            type="button"
            onClick={copyAll}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Copy size={10} />
            {copied === "all" ? "Copiado!" : "Copiar tudo"}
          </button>
        )}
      </div>

      {!collapsed && (
        <>
          {/* Log list */}
          {entries.length > 0 ? (
            <div
              ref={scrollRef}
              className="max-h-52 overflow-y-auto space-y-0 border border-slate-200 rounded-xl bg-slate-50/50"
            >
              {entries.map((entry, i) => (
                <div
                  key={i}
                  className="px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-white transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#1A4731]/10 flex items-center justify-center flex-shrink-0">
                        <User size={10} className="text-[#1A4731]" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{entry.user}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock size={9} />
                        <span>{formatDate(entry.timestamp)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(entry.content);
                          setCopied(i);
                          setTimeout(() => setCopied(null), 1200);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-400 hover:text-slate-600"
                      >
                        <Copy size={10} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap pl-7">
                    {copied === i ? <span className="text-emerald-600">✓ Copiado</span> : entry.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-xl px-4 py-5 text-center bg-slate-50/50">
              <MessageSquarePlus size={18} className="text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs text-slate-400">Nenhuma observação registrada.</p>
              <p className="text-[11px] text-slate-300 mt-0.5">Adicione a primeira abaixo.</p>
            </div>
          )}

          {/* Input */}
          {!readOnly && (
            <div className="flex gap-2 items-end">
              <textarea
                value={newText}
                onChange={e => setNewText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && e.ctrlKey) addEntry();
                }}
                rows={2}
                placeholder="Digite uma observação... (Ctrl+Enter para adicionar)"
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1A4731]/20 focus:border-[#1A4731]/40 bg-white"
              />
              <Button
                type="button"
                onClick={addEntry}
                disabled={!newText.trim()}
                size="sm"
                className="bg-[#1A4731] hover:bg-[#245E40] text-white text-xs gap-1 h-[52px] px-3 flex-shrink-0"
              >
                <MessageSquarePlus size={12} />
                Adicionar
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}