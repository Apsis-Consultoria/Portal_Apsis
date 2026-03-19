import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';

const GRUPOS_PERMISSOES = {
  comercial: { label: 'Comercial', color: 'bg-blue-100 text-blue-700' },
  financeiro: { label: 'Financeiro', color: 'bg-green-100 text-green-700' },
  projetos: { label: 'Projetos', color: 'bg-purple-100 text-purple-700' },
  relatorios: { label: 'Relatórios', color: 'bg-orange-100 text-orange-700' },
  sistema: { label: 'Sistema', color: 'bg-red-100 text-red-700' },
  cliente: { label: 'Cliente', color: 'bg-cyan-100 text-cyan-700' },
  geral: { label: 'Geral', color: 'bg-gray-100 text-gray-700' }
};

const PERMISSOES_INICIAIS = [
  { label: 'Ajuda', grupo: 'geral' },
  { label: 'Área do Cliente', grupo: 'cliente' },
  { label: 'Configurações do Sistema', grupo: 'sistema' },
  { label: 'Contas', grupo: 'financeiro' },
  { label: 'Contatos', grupo: 'comercial' },
  { label: 'Editoração', grupo: 'geral' },
  { label: 'Finanças', grupo: 'financeiro' },
  { label: 'Global', grupo: 'geral' },
  { label: 'Projetos', grupo: 'projetos' },
  { label: 'Capital', grupo: 'geral' },
  { label: 'Relatórios', grupo: 'relatorios' },
  { label: 'Solicitações', grupo: 'geral' },
  { label: 'Tarefas', grupo: 'projetos' },
  { label: 'Vendas', grupo: 'comercial' }
];

export default function PerfisTab() {
  const [perfis, setPerfis] = useState([]);
  const [permissoes, setPermissoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '', permissoes: [] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [perfisRes, permissoesRes] = await Promise.all([
        base44.entities.Perfil.list(),
        base44.entities.PermissaoLabel.list()
      ]);
      setPerfis(perfisRes);
      setPermissoes(permissoesRes);

      if (permissoesRes.length === 0) {
        await initializePermissoes();
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const initializePermissoes = async () => {
    try {
      await base44.entities.PermissaoLabel.bulkCreate(PERMISSOES_INICIAIS);
      const res = await base44.entities.PermissaoLabel.list();
      setPermissoes(res);
    } catch (err) {
      console.error('Erro ao criar permissões iniciais:', err);
    }
  };

  const handleOpenModal = (perfil = null) => {
    if (perfil) {
      setEditingPerfil(perfil);
      setFormData({ nome: perfil.nome, descricao: perfil.descricao, permissoes: perfil.permissoes || [] });
    } else {
      setEditingPerfil(null);
      setFormData({ nome: '', descricao: '', permissoes: [] });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) return;

    try {
      if (editingPerfil) {
        await base44.entities.Perfil.update(editingPerfil.id, {
          nome: formData.nome,
          descricao: formData.descricao,
          permissoes: formData.permissoes
        });
      } else {
        await base44.entities.Perfil.create({
          nome: formData.nome,
          descricao: formData.descricao,
          status: 'ativo',
          permissoes: formData.permissoes
        });
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
    }
  };

  const handleToggleStatus = async (perfil) => {
    try {
      await base44.entities.Perfil.update(perfil.id, {
        status: perfil.status === 'ativo' ? 'inativo' : 'ativo'
      });
      loadData();
    } catch (err) {
      console.error('Erro ao alterar status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja deletar este perfil?')) {
      try {
        await base44.entities.Perfil.delete(id);
        loadData();
      } catch (err) {
        console.error('Erro ao deletar perfil:', err);
      }
    }
  };

  const togglePermissao = (permissaoId) => {
    setFormData(prev => ({
      ...prev,
      permissoes: prev.permissoes.includes(permissaoId)
        ? prev.permissoes.filter(p => p !== permissaoId)
        : [...prev.permissoes, permissaoId]
    }));
  };

  if (isLoading) {
    return <div className="text-center py-8 text-[var(--text-secondary)]">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Gerenciar Perfis</h2>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={16} />
          Novo Perfil
        </Button>
      </div>

      {/* Grid de Perfis */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {perfis.map(perfil => (
          <div key={perfil.id} className="border border-[var(--border)] rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--text-primary)]">{perfil.nome}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{perfil.descricao}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${perfil.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {perfil.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            {/* Permissões */}
            <div className="mb-3">
              <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                Permissões ({perfil.permissoes?.length || 0})
              </p>
              <div className="flex flex-wrap gap-1">
                {perfil.permissoes?.slice(0, 3).map(permId => {
                  const perm = permissoes.find(p => p.id === permId);
                  return perm ? (
                    <span key={permId} className={`px-2 py-0.5 rounded text-xs ${GRUPOS_PERMISSOES[perm.grupo]?.color || 'bg-gray-100 text-gray-700'}`}>
                      {perm.label}
                    </span>
                  ) : null;
                })}
                {(perfil.permissoes?.length || 0) > 3 && (
                  <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                    +{(perfil.permissoes?.length || 0) - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleOpenModal(perfil)} className="flex-1 gap-1">
                <Edit2 size={14} />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus(perfil)}
                className="gap-1"
              >
                {perfil.status === 'ativo' ? <EyeOff size={14} /> : <Eye size={14} />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(perfil.id)} className="text-red-600 hover:text-red-700">
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {editingPerfil ? 'Editar Perfil' : 'Novo Perfil'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)]"
                  placeholder="Ex: Gerente Comercial"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--apsis-orange)] resize-none"
                  placeholder="Descrição do perfil"
                  rows="3"
                />
              </div>

              {/* Permissões por Grupo */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[var(--text-primary)]">Permissões</label>
                {Object.entries(GRUPOS_PERMISSOES).map(([grupo, { label }]) => {
                  const permGrupo = permissoes.filter(p => p.grupo === grupo);
                  return (
                    <div key={grupo} className="bg-[var(--surface-2)] rounded p-3">
                      <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">{label}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {permGrupo.map(perm => (
                          <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.permissoes.includes(perm.id)}
                              onChange={() => togglePermissao(perm.id)}
                              className="rounded"
                            />
                            <span className="text-xs text-[var(--text-primary)]">{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-[var(--border)]">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar Perfil</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}