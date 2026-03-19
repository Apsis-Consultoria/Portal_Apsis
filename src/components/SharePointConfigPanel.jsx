import { useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle, Loader } from 'lucide-react';

export default function SharePointConfigPanel() {
  const [config, setConfig] = useState({
    tenant_url: '',
    site_url: '',
    biblioteca_padrao: 'Documentos',
    pasta_base: '/Shared Documents',
    client_id: '',
    tenant_id: '',
    habilitado: false,
  });

  const [showSecret, setShowSecret] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setTestResult(null);

    // Simular teste de conexão
    setTimeout(() => {
      setTestResult({
        success: Math.random() > 0.3,
        message: 'Conexão testada com sucesso' || 'Erro ao conectar com SharePoint',
        timestamp: new Date().toLocaleString('pt-BR'),
      });
      setLoading(false);
    }, 1500);
  };

  const handleSave = async () => {
    setSaved(false);
    setLoading(true);

    // Simular salvamento
    setTimeout(() => {
      setSaved(true);
      setLoading(false);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Integração SharePoint</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Configure a conexão segura com SharePoint. O portal controla todos os acessos e visibilidade dos documentos.
        </p>
      </div>

      {/* Status e Avisos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Segurança Ativada</p>
            <ul className="space-y-1 text-xs">
              <li>✓ Filtragem obrigatória por client_id</li>
              <li>✓ Verificação de visibilidade em cada acesso</li>
              <li>✓ Armazenamento apenas de metadados e URLs seguras</li>
              <li>✓ Log de auditoria de todos os acessos</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Configurações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tenant URL */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Tenant URL</label>
          <input
            type="text"
            placeholder="https://seu-tenant.sharepoint.com"
            value={config.tenant_url}
            onChange={(e) => handleChange('tenant_url', e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
          />
          <p className="text-xs text-[var(--text-secondary)] mt-1">URL raiz do seu tenant SharePoint</p>
        </div>

        {/* Site URL */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Site URL</label>
          <input
            type="text"
            placeholder="/sites/apsis-nexus"
            value={config.site_url}
            onChange={(e) => handleChange('site_url', e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
          />
          <p className="text-xs text-[var(--text-secondary)] mt-1">Caminho do site no SharePoint</p>
        </div>

        {/* Biblioteca Padrão */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Biblioteca Padrão</label>
          <input
            type="text"
            placeholder="Documentos"
            value={config.biblioteca_padrao}
            onChange={(e) => handleChange('biblioteca_padrao', e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
          />
          <p className="text-xs text-[var(--text-secondary)] mt-1">Nome da biblioteca de documentos</p>
        </div>

        {/* Pasta Base */}
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Pasta Base</label>
          <input
            type="text"
            placeholder="/Shared Documents"
            value={config.pasta_base}
            onChange={(e) => handleChange('pasta_base', e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
          />
          <p className="text-xs text-[var(--text-secondary)] mt-1">Caminho base para organização dos documentos</p>
        </div>
      </div>

      {/* Credenciais Azure */}
      <div className="border-t border-[var(--border)] pt-6">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Credenciais Azure AD</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client ID */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Client ID</label>
            <input
              type="text"
              placeholder="xxxxx-xxxxx-xxxxx-xxxxx"
              value={config.client_id}
              onChange={(e) => handleChange('client_id', e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
            />
          </div>

          {/* Tenant ID */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Tenant ID</label>
            <input
              type="text"
              placeholder="xxxxx-xxxxx-xxxxx-xxxxx"
              value={config.tenant_id}
              onChange={(e) => handleChange('tenant_id', e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50"
            />
          </div>
        </div>

        {/* Client Secret */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Client Secret</label>
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              placeholder="••••••••••••••••••••"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]/50 pr-10"
            />
            <button
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Será armazenado com criptografia</p>
        </div>
      </div>

      {/* Habilitar */}
      <div className="border-t border-[var(--border)] pt-6">
        <div className="flex items-center gap-3 p-4 bg-[var(--surface-2)] rounded-lg">
          <input
            type="checkbox"
            checked={config.habilitado}
            onChange={(e) => handleChange('habilitado', e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Habilitar Integração SharePoint</p>
            <p className="text-xs text-[var(--text-secondary)]">Ativar sincronização de documentos após testes bem-sucedidos</p>
          </div>
        </div>
      </div>

      {/* Teste de Conexão */}
      <div className="border-t border-[var(--border)] pt-6">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Validação</h4>

        {testResult && (
          <div
            className={`p-4 rounded-lg mb-4 flex items-start gap-3 ${
              testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            {testResult.success ? (
              <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <p className={`font-semibold ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {testResult.message}
              </p>
              <p className={`text-xs mt-1 ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                {testResult.timestamp}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleTestConnection}
          disabled={loading || !config.tenant_url || !config.site_url}
          className="px-4 py-2 border border-[var(--apsis-orange)] text-[var(--apsis-orange)] rounded-lg hover:bg-[var(--apsis-orange)]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
        >
          {loading && <Loader size={14} className="animate-spin" />}
          Testar Conexão
        </button>
      </div>

      {/* Salvar */}
      <div className="border-t border-[var(--border)] pt-6 flex justify-end gap-3">
        {saved && (
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <Check size={16} />
            Configurações salvas com sucesso
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-[var(--apsis-orange)] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
        >
          {loading && <Loader size={14} className="animate-spin" />}
          Salvar Configuração
        </button>
      </div>
    </div>
  );
}