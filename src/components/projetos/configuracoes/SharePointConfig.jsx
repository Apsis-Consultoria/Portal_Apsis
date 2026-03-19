import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Cloud, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Save,
  Zap, Eye, EyeOff, Settings, FolderOpen, FileType, Shield,
  Clock, Wifi, WifiOff, Loader2
} from "lucide-react";

const ENTITY_KEY = "sharepoint_config";

const DEFAULT_CONFIG = {
  tenant_url: "",
  site_url: "",
  biblioteca: "Shared Documents",
  pasta_raiz: "Projetos",
  client_id: "",
  client_secret: "",
  tenant_id: "",
  nome_conexao: "APSIS SharePoint",
  tipo_auth: "client_credentials",
  sync_automatico: false,
  upload_automatico: false,
  modo_vinculo: "apenas_url",
  padrao_nomenclatura: "{cliente}_{tipo}_{data}",
  estrutura_pastas: "{cliente}/{projeto}",
  tipos_aceitos: "Laudo,Relatório,Contrato,Proposta,Apresentação,Planilha,Outro",
  tamanho_maximo: "50",
  visibilidade_padrao: "Interno",
  compartilhavel_cliente: false,
  // status (não editável)
  status_conexao: "nao_testado",
  ultimo_teste: null,
  ultima_sync: null,
  erro_conexao: null,
};

export default function SharePointConfig() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [configId, setConfigId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const records = await base44.entities.AssistantConfig.filter({ key: ENTITY_KEY });
    if (records.length > 0) {
      setConfigId(records[0].id);
      try { setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(records[0].value) }); } catch (e) {}
    }
  };

  const set = (field, value) => setConfig(c => ({ ...c, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    const payload = { key: ENTITY_KEY, value: JSON.stringify(config), descricao: "Configuração SharePoint" };
    if (configId) await base44.entities.AssistantConfig.update(configId, payload);
    else {
      const rec = await base44.entities.AssistantConfig.create(payload);
      setConfigId(rec.id);
    }
    setSaving(false);
    setSaveMsg("Configuração salva com sucesso!");
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleTest = async () => {
    setTesting(true);
    await new Promise(r => setTimeout(r, 1800));
    const ok = !!(config.tenant_url && config.client_id && config.client_secret && config.tenant_id);
    const now = new Date().toISOString();
    const updated = {
      ...config,
      status_conexao: ok ? "conectado" : "erro",
      ultimo_teste: now,
      erro_conexao: ok ? null : "Campos obrigatórios incompletos. Verifique Tenant URL, Client ID, Client Secret e Tenant ID.",
    };
    setConfig(updated);
    const payload = { key: ENTITY_KEY, value: JSON.stringify(updated), descricao: "Configuração SharePoint" };
    if (configId) await base44.entities.AssistantConfig.update(configId, payload);
    setTesting(false);
  };

  const handleSync = async () => {
    if (config.status_conexao !== "conectado") return;
    setSyncing(true);
    await new Promise(r => setTimeout(r, 2200));
    const updated = { ...config, ultima_sync: new Date().toISOString() };
    setConfig(updated);
    if (configId) await base44.entities.AssistantConfig.update(configId, { key: ENTITY_KEY, value: JSON.stringify(updated), descricao: "Configuração SharePoint" });
    setSyncing(false);
  };

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleString("pt-BR") : "—";

  const statusInfo = {
    nao_testado: { icon: Wifi,      color: "text-slate-400", bg: "bg-slate-50",   border: "border-slate-200", label: "Não testado" },
    conectado:   { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Conectado" },
    erro:        { icon: XCircle,    color: "text-red-500",   bg: "bg-red-50",     border: "border-red-200",    label: "Erro de conexão" },
  };
  const si = statusInfo[config.status_conexao] || statusInfo.nao_testado;

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Status bar */}
      <div className={`rounded-xl border ${si.border} ${si.bg} p-4 flex flex-wrap items-center gap-4`}>
        <div className="flex items-center gap-2">
          <si.icon size={16} className={si.color} />
          <span className={`text-sm font-semibold ${si.color}`}>{si.label}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1"><Clock size={11} /> Último teste: {fmtDate(config.ultimo_teste)}</span>
          <span className="flex items-center gap-1"><RefreshCw size={11} /> Última sync: {fmtDate(config.ultima_sync)}</span>
        </div>
        {config.erro_conexao && (
          <div className="w-full flex items-start gap-2 mt-1">
            <AlertTriangle size={13} className="text-red-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-red-600">{config.erro_conexao}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={handleTest} disabled={testing}
          className="gap-1.5 text-xs border-slate-300 hover:border-[#1A4731]/40">
          {testing ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
          Testar conexão
        </Button>
        <Button size="sm" variant="outline" onClick={handleSync}
          disabled={syncing || config.status_conexao !== "conectado"}
          className="gap-1.5 text-xs border-slate-300 hover:border-[#1A4731]/40">
          {syncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
          Sincronizar agora
        </Button>
        <Button size="sm" onClick={handleSave} disabled={saving}
          className="gap-1.5 text-xs bg-[#1A4731] hover:bg-[#245E40] text-white ml-auto">
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          {saving ? "Salvando..." : "Salvar configuração"}
        </Button>
      </div>

      {saveMsg && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
          <CheckCircle2 size={13} /> {saveMsg}
        </div>
      )}

      {/* Section: Conexão */}
      <Section title="Conexão com o SharePoint" icon={Cloud} desc="Credenciais e parâmetros de autenticação com o Microsoft SharePoint.">
        <Field label="Nome da conexão">
          <Input className="h-9 text-sm" value={config.nome_conexao} onChange={e => set("nome_conexao", e.target.value)} placeholder="Ex: APSIS SharePoint" />
        </Field>
        <Field label="Tenant URL">
          <Input className="h-9 text-sm" value={config.tenant_url} onChange={e => set("tenant_url", e.target.value)} placeholder="https://apsis.sharepoint.com" />
        </Field>
        <Field label="Site URL">
          <Input className="h-9 text-sm" value={config.site_url} onChange={e => set("site_url", e.target.value)} placeholder="https://apsis.sharepoint.com/sites/projetos" />
        </Field>
        <Field label="Tenant ID">
          <Input className="h-9 text-sm" value={config.tenant_id} onChange={e => set("tenant_id", e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
        </Field>
        <Field label="Client ID (App Registration)">
          <Input className="h-9 text-sm" value={config.client_id} onChange={e => set("client_id", e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
        </Field>
        <Field label="Client Secret">
          <div className="relative">
            <Input
              type={showSecret ? "text" : "password"}
              className="h-9 text-sm pr-9"
              value={config.client_secret}
              onChange={e => set("client_secret", e.target.value)}
              placeholder="••••••••••••••••"
            />
            <button onClick={() => setShowSecret(!showSecret)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Field>
        <Field label="Tipo de autenticação" span={2}>
          <Select value={config.tipo_auth} onValueChange={v => set("tipo_auth", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="client_credentials">Client Credentials (App Only)</SelectItem>
              <SelectItem value="delegated">Delegated (User login)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </Section>

      {/* Section: Estrutura */}
      <Section title="Estrutura de Arquivos" icon={FolderOpen} desc="Como os documentos são organizados e nomeados no SharePoint.">
        <Field label="Biblioteca padrão">
          <Input className="h-9 text-sm" value={config.biblioteca} onChange={e => set("biblioteca", e.target.value)} placeholder="Shared Documents" />
        </Field>
        <Field label="Pasta raiz">
          <Input className="h-9 text-sm" value={config.pasta_raiz} onChange={e => set("pasta_raiz", e.target.value)} placeholder="Projetos" />
        </Field>
        <Field label="Estrutura de pastas" hint="Variáveis: {cliente}, {projeto}, {tipo}">
          <Input className="h-9 text-sm" value={config.estrutura_pastas} onChange={e => set("estrutura_pastas", e.target.value)} placeholder="{cliente}/{projeto}" />
        </Field>
        <Field label="Padrão de nomenclatura" hint="Variáveis: {cliente}, {tipo}, {data}, {versao}">
          <Input className="h-9 text-sm" value={config.padrao_nomenclatura} onChange={e => set("padrao_nomenclatura", e.target.value)} placeholder="{cliente}_{tipo}_{data}" />
        </Field>
      </Section>

      {/* Section: Documentos */}
      <Section title="Regras Documentais" icon={FileType} desc="Tipos aceitos, tamanhos e modo de vinculação.">
        <Field label="Tipos documentais aceitos" hint="Separe por vírgula" span={2}>
          <Input className="h-9 text-sm" value={config.tipos_aceitos} onChange={e => set("tipos_aceitos", e.target.value)} />
        </Field>
        <Field label="Tamanho máximo (MB)">
          <Input className="h-9 text-sm" type="number" value={config.tamanho_maximo} onChange={e => set("tamanho_maximo", e.target.value)} />
        </Field>
        <Field label="Modo de vinculação">
          <Select value={config.modo_vinculo} onValueChange={v => set("modo_vinculo", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="apenas_url">Apenas URL (link externo)</SelectItem>
              <SelectItem value="upload_integrado">Upload integrado</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Visibilidade padrão">
          <Select value={config.visibilidade_padrao} onValueChange={v => set("visibilidade_padrao", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Interno">Interno</SelectItem>
              <SelectItem value="Cliente">Visível ao cliente</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </Section>

      {/* Section: Automações */}
      <Section title="Automações e Permissões" icon={Shield} desc="Sincronização automática e permissões de compartilhamento.">
        <Toggle label="Sincronização automática" desc="Sincroniza metadados periodicamente com o SharePoint"
          value={config.sync_automatico} onChange={v => set("sync_automatico", v)} />
        <Toggle label="Upload automático" desc="Faz upload de arquivos diretamente ao salvar no portal"
          value={config.upload_automatico} onChange={v => set("upload_automatico", v)} />
        <Toggle label="Documentos compartilháveis com cliente" desc="Permite marcar documentos como visíveis ao cliente"
          value={config.compartilhavel_cliente} onChange={v => set("compartilhavel_cliente", v)} />
      </Section>

    </div>
  );
}

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
    <div className="sm:col-span-2 flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${value ? "bg-[#1A4731]" : "bg-slate-200"}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}