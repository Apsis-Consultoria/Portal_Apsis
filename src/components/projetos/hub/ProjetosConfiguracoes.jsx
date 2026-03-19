import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings, Cloud, Tag, Download, Plug, Info, Layers, Bell,
  Plus, X, Save, CheckCircle2, Loader2, Eye, EyeOff, Zap, RefreshCw,
  AlertTriangle, Clock, Shield, FolderOpen, FileType
} from "lucide-react";
import SharePointConfig from "@/components/projetos/configuracoes/SharePointConfig";

const TABS = [
  { id: "gerais",       label: "Gerais",                    icon: Settings },
  { id: "sharepoint",   label: "Configuração SharePoint",   icon: Cloud    },
  { id: "status",       label: "Status e Categorias",       icon: Tag      },
  { id: "exportacao",   label: "Exportação",                icon: Download },
  { id: "integracoes",  label: "Integrações",               icon: Plug     },
];

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_GERAIS = {
  nome_modulo: "Projetos",
  tipos_projeto: ["Contábil - Laudo", "Contábil - Parecer", "Consultoria - Tributária", "Consultoria - Societária", "Consultoria - M&A", "Projetos Especiais", "Outros"],
  prazo_alerta_dias: "7",
  exibir_valor: true,
  exibir_horas: true,
  responsavel_padrao: "",
};

const DEFAULT_STATUS = {
  status_os: ["Ativo", "Pausado", "Cancelado", "Não iniciado"],
  status_tarefa: ["A fazer", "Em andamento", "Em revisão", "Concluída", "Bloqueada"],
  categorias_risco: ["Prazo", "Escopo", "Financeiro", "Técnico", "Comunicação", "Recurso"],
  tipos_documentais: ["Laudo", "Relatório", "Contrato", "Proposta", "Apresentação", "Planilha", "Outro"],
};

const DEFAULT_EXPORTACAO = {
  formato_padrao: "csv",
  incluir_financeiro: false,
  incluir_horas: true,
  incluir_riscos: true,
  incluir_documentos: true,
  politica_acesso: "admin",
  rodape_relatorio: "APSIS Consultoria – Documento Confidencial",
};

const DEFAULT_INTEGRACOES = {
  erp_ativo: false,
  erp_url: "",
  erp_token: "",
  email_notificacoes: "",
  slack_webhook: "",
  sync_calendario: false,
};

const CONFIG_KEY_MAP = {
  gerais:      "projetos_config_gerais",
  status:      "projetos_config_status",
  exportacao:  "projetos_config_exportacao",
  integracoes: "projetos_config_integracoes",
};

export default function ProjetosConfiguracoes() {
  const [tab, setTab] = useState("gerais");
  const [configs, setConfigs] = useState({ gerais: DEFAULT_GERAIS, status: DEFAULT_STATUS, exportacao: DEFAULT_EXPORTACAO, integracoes: DEFAULT_INTEGRACOES });
  const [ids, setIds] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const keys = Object.values(CONFIG_KEY_MAP);
    const recs = await base44.entities.AssistantConfig.filter({});
    const found = {};
    const foundIds = {};
    recs.forEach(r => {
      if (keys.includes(r.key)) {
        const section = Object.entries(CONFIG_KEY_MAP).find(([, v]) => v === r.key)?.[0];
        if (section) {
          try { found[section] = { ...configs[section], ...JSON.parse(r.value) }; } catch (e) {}
          foundIds[section] = r.id;
        }
      }
    });
    if (Object.keys(found).length) setConfigs(c => ({ ...c, ...found }));
    setIds(foundIds);
  };

  const save = async (section) => {
    setSaving(true);
    const key = CONFIG_KEY_MAP[section];
    const val = JSON.stringify(configs[section]);
    if (ids[section]) await base44.entities.AssistantConfig.update(ids[section], { key, value: val });
    else {
      const rec = await base44.entities.AssistantConfig.create({ key, value: val, descricao: `Config: ${section}` });
      setIds(i => ({ ...i, [section]: rec.id }));
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const setSection = (section, field, value) =>
    setConfigs(c => ({ ...c, [section]: { ...c[section], [field]: value } }));

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Configurações do Módulo</h2>
        <p className="text-sm text-slate-400 mt-0.5">Parâmetros, integrações e políticas do módulo de Projetos</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap ${
              tab === t.id ? "border-[#F47920] text-slate-800" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {saved && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
          <CheckCircle2 size={13} /> Configuração salva com sucesso!
        </div>
      )}

      {/* ── TAB: GERAIS ─────────────────────────────────── */}
      {tab === "gerais" && (
        <div className="space-y-4 max-w-3xl">
          <Section title="Parâmetros Gerais" icon={Settings} desc="Configurações padrão do módulo de projetos.">
            <Field label="Nome do módulo">
              <Input className="h-9 text-sm" value={configs.gerais.nome_modulo}
                onChange={e => setSection("gerais", "nome_modulo", e.target.value)} />
            </Field>
            <Field label="Responsável padrão">
              <Input className="h-9 text-sm" placeholder="Nome do responsável padrão"
                value={configs.gerais.responsavel_padrao}
                onChange={e => setSection("gerais", "responsavel_padrao", e.target.value)} />
            </Field>
            <Field label="Alerta de prazo (dias antes)">
              <Input type="number" className="h-9 text-sm" value={configs.gerais.prazo_alerta_dias}
                onChange={e => setSection("gerais", "prazo_alerta_dias", e.target.value)} />
            </Field>
            <div className="sm:col-span-2 space-y-3">
              <Toggle label="Exibir valor financeiro do projeto" desc="Mostra o valor nos cards e listagem"
                value={configs.gerais.exibir_valor} onChange={v => setSection("gerais", "exibir_valor", v)} />
              <Toggle label="Exibir horas alocadas" desc="Mostra horas previstas e realizadas nos cards"
                value={configs.gerais.exibir_horas} onChange={v => setSection("gerais", "exibir_horas", v)} />
            </div>
          </Section>

          <Section title="Tipos de Projeto" icon={Layers} desc="Categorias utilizadas na criação de novos projetos.">
            <div className="sm:col-span-2">
              <TagList
                items={configs.gerais.tipos_projeto}
                onAdd={item => setSection("gerais", "tipos_projeto", [...configs.gerais.tipos_projeto, item])}
                onRemove={i => setSection("gerais", "tipos_projeto", configs.gerais.tipos_projeto.filter((_, idx) => idx !== i))}
              />
            </div>
          </Section>

          <div className="flex justify-end">
            <SaveBtn saving={saving} onSave={() => save("gerais")} />
          </div>
        </div>
      )}

      {/* ── TAB: SHAREPOINT ─────────────────────────────── */}
      {tab === "sharepoint" && <SharePointConfig />}

      {/* ── TAB: STATUS E CATEGORIAS ────────────────────── */}
      {tab === "status" && (
        <div className="space-y-4 max-w-3xl">
          <Section title="Status dos Projetos (OS)" icon={Tag} desc="Status disponíveis para ordens de serviço.">
            <div className="sm:col-span-2">
              <TagList
                color="green"
                items={configs.status.status_os}
                onAdd={item => setSection("status", "status_os", [...configs.status.status_os, item])}
                onRemove={i => setSection("status", "status_os", configs.status.status_os.filter((_, idx) => idx !== i))}
              />
            </div>
          </Section>

          <Section title="Status das Tarefas" icon={Tag} desc="Status do fluxo de tarefas dentro de cada projeto.">
            <div className="sm:col-span-2">
              <TagList
                color="blue"
                items={configs.status.status_tarefa}
                onAdd={item => setSection("status", "status_tarefa", [...configs.status.status_tarefa, item])}
                onRemove={i => setSection("status", "status_tarefa", configs.status.status_tarefa.filter((_, idx) => idx !== i))}
              />
            </div>
          </Section>

          <Section title="Categorias de Risco" icon={AlertTriangle} desc="Categorias utilizadas no registro de riscos.">
            <div className="sm:col-span-2">
              <TagList
                color="red"
                items={configs.status.categorias_risco}
                onAdd={item => setSection("status", "categorias_risco", [...configs.status.categorias_risco, item])}
                onRemove={i => setSection("status", "categorias_risco", configs.status.categorias_risco.filter((_, idx) => idx !== i))}
              />
            </div>
          </Section>

          <Section title="Tipos Documentais" icon={FileType} desc="Tipos aceitos no registro de documentos do projeto.">
            <div className="sm:col-span-2">
              <TagList
                color="purple"
                items={configs.status.tipos_documentais}
                onAdd={item => setSection("status", "tipos_documentais", [...configs.status.tipos_documentais, item])}
                onRemove={i => setSection("status", "tipos_documentais", configs.status.tipos_documentais.filter((_, idx) => idx !== i))}
              />
            </div>
          </Section>

          <div className="flex justify-end">
            <SaveBtn saving={saving} onSave={() => save("status")} />
          </div>
        </div>
      )}

      {/* ── TAB: EXPORTAÇÃO ─────────────────────────────── */}
      {tab === "exportacao" && (
        <div className="space-y-4 max-w-3xl">
          <Section title="Políticas de Exportação" icon={Download} desc="Controle o que pode ser exportado e por quem.">
            <Field label="Formato padrão">
              <Select value={configs.exportacao.formato_padrao} onValueChange={v => setSection("exportacao", "formato_padrao", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Acesso permitido para exportar">
              <Select value={configs.exportacao.politica_acesso} onValueChange={v => setSection("exportacao", "politica_acesso", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="gerente">Gerente ou superior</SelectItem>
                  <SelectItem value="admin">Somente Admin</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Rodapé dos relatórios" span={2}>
              <Input className="h-9 text-sm" value={configs.exportacao.rodape_relatorio}
                onChange={e => setSection("exportacao", "rodape_relatorio", e.target.value)}
                placeholder="Texto que aparece no rodapé dos relatórios exportados" />
            </Field>
            <div className="sm:col-span-2 space-y-3">
              <Toggle label="Incluir dados financeiros" desc="Exporta valores e parcelas dos projetos"
                value={configs.exportacao.incluir_financeiro} onChange={v => setSection("exportacao", "incluir_financeiro", v)} />
              <Toggle label="Incluir horas e alocações" desc="Exporta timesheet e alocações de colaboradores"
                value={configs.exportacao.incluir_horas} onChange={v => setSection("exportacao", "incluir_horas", v)} />
              <Toggle label="Incluir registros de risco" desc="Exporta riscos e planos de mitigação"
                value={configs.exportacao.incluir_riscos} onChange={v => setSection("exportacao", "incluir_riscos", v)} />
              <Toggle label="Incluir documentos vinculados" desc="Exporta metadados de documentos do projeto"
                value={configs.exportacao.incluir_documentos} onChange={v => setSection("exportacao", "incluir_documentos", v)} />
            </div>
          </Section>

          <div className="flex justify-end">
            <SaveBtn saving={saving} onSave={() => save("exportacao")} />
          </div>
        </div>
      )}

      {/* ── TAB: INTEGRAÇÕES ────────────────────────────── */}
      {tab === "integracoes" && (
        <div className="space-y-4 max-w-3xl">
          <Section title="ERP / Sistema Legado" icon={Plug} desc="Integração com sistema ERP externo via API.">
            <div className="sm:col-span-2">
              <Toggle label="Ativar integração ERP" desc="Sincroniza projetos com o sistema ERP configurado"
                value={configs.integracoes.erp_ativo} onChange={v => setSection("integracoes", "erp_ativo", v)} />
            </div>
            <Field label="URL da API ERP">
              <Input className="h-9 text-sm" placeholder="https://erp.empresa.com/api/v1"
                value={configs.integracoes.erp_url}
                onChange={e => setSection("integracoes", "erp_url", e.target.value)} />
            </Field>
            <Field label="Token de acesso">
              <Input className="h-9 text-sm" type="password" placeholder="••••••••••••"
                value={configs.integracoes.erp_token}
                onChange={e => setSection("integracoes", "erp_token", e.target.value)} />
            </Field>
          </Section>

          <Section title="Notificações" icon={Bell} desc="Canais de notificação para alertas e atualizações.">
            <Field label="E-mail para notificações" span={2}>
              <Input className="h-9 text-sm" type="email" placeholder="equipe@empresa.com"
                value={configs.integracoes.email_notificacoes}
                onChange={e => setSection("integracoes", "email_notificacoes", e.target.value)} />
            </Field>
            <Field label="Slack Webhook URL" span={2}>
              <Input className="h-9 text-sm" placeholder="https://hooks.slack.com/services/..."
                value={configs.integracoes.slack_webhook}
                onChange={e => setSection("integracoes", "slack_webhook", e.target.value)} />
            </Field>
          </Section>

          <Section title="Calendário" icon={Clock} desc="Sincronização de prazos e tarefas com calendário.">
            <div className="sm:col-span-2">
              <Toggle label="Sincronizar prazos com calendário" desc="Exporta prazos de projetos e tarefas para o calendário da equipe"
                value={configs.integracoes.sync_calendario} onChange={v => setSection("integracoes", "sync_calendario", v)} />
            </div>
          </Section>

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Info size={12} /> A integração com SharePoint é configurada na aba específica.
            </div>
            <SaveBtn saving={saving} onSave={() => save("integracoes")} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, icon: Icon, desc, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60">
        <div className="w-8 h-8 rounded-lg bg-[#1A4731]/10 flex items-center justify-center">
          <Icon size={14} className="text-[#1A4731]" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800">{title}</div>
          {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, span, children }) {
  return (
    <div className={span === 2 ? "sm:col-span-2" : ""}>
      <label className="text-xs font-medium text-slate-600 mb-1.5 block">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${value ? "bg-[#1A4731]" : "bg-slate-200"}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

function SaveBtn({ saving, onSave }) {
  return (
    <Button size="sm" onClick={onSave} disabled={saving}
      className="bg-[#1A4731] hover:bg-[#245E40] text-white gap-1.5 text-xs">
      {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
      {saving ? "Salvando..." : "Salvar configuração"}
    </Button>
  );
}

const TAG_COLORS = {
  green:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  blue:   "bg-blue-50 text-blue-700 border border-blue-200",
  red:    "bg-red-50 text-red-700 border border-red-200",
  purple: "bg-purple-50 text-purple-700 border border-purple-200",
  default:"bg-slate-100 text-slate-600 border border-slate-200",
};

function TagList({ items, onAdd, onRemove, color = "default" }) {
  const [input, setInput] = useState("");
  const tc = TAG_COLORS[color] || TAG_COLORS.default;

  const add = () => {
    const val = input.trim();
    if (val && !items.includes(val)) { onAdd(val); setInput(""); }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
        {items.map((item, i) => (
          <span key={i} className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${tc}`}>
            {item}
            <button onClick={() => onRemove(i)} className="hover:opacity-60 transition-opacity"><X size={10} /></button>
          </span>
        ))}
        {items.length === 0 && <span className="text-xs text-slate-300 italic">Nenhum item cadastrado</span>}
      </div>
      <div className="flex gap-2">
        <Input className="h-8 text-xs flex-1" placeholder="Adicionar novo..." value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()} />
        <Button size="sm" variant="outline" onClick={add} className="h-8 px-3 text-xs gap-1">
          <Plus size={11} /> Adicionar
        </Button>
      </div>
    </div>
  );
}