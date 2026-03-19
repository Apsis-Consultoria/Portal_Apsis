import { useState } from 'react';
import ConversasList from '@/components/ConversasList';
import ChatArea from '@/components/ChatArea';

// Mock data
const mockConversas = [
  {
    id: 1,
    titulo: 'Auditoria Contábil 2025',
    descricao: 'Projeto - Auditoria completa das demonstrações contábeis',
    tipo: 'projeto',
    ultima_mensagem: 'Documentação foi atualizada',
    ultima_mensagem_em: '2026-03-19T10:30:00',
    nao_lidas: 2,
  },
  {
    id: 2,
    titulo: 'Dúvida sobre relatório',
    descricao: 'Solicitação - Entender apresentação dos resultados',
    tipo: 'solicitacao',
    ultima_mensagem: 'Temos a resposta pronta para você',
    ultima_mensagem_em: '2026-03-18T15:45:00',
    nao_lidas: 0,
  },
  {
    id: 3,
    titulo: 'Assunto geral',
    descricao: 'Conversa geral com a equipe',
    tipo: 'geral',
    ultima_mensagem: 'Qual é o melhor horário para a reunião?',
    ultima_mensagem_em: '2026-03-17T09:20:00',
    nao_lidas: 0,
  },
];

const mockMensagens = {
  1: [
    {
      id: 1,
      conversa_id: 1,
      remetente_email: 'marina@apsis.com',
      remetente_nome: 'Marina Silva',
      remetente_tipo: 'apsis',
      conteudo: 'Olá! Enviamos o cronograma da auditoria.',
      visibilidade: 'compartilhado',
      created_date: '2026-03-19T09:00:00',
      lida_por: ['joao@techcorp.com'],
      anexos: [{ nome: 'Cronograma_Auditoria.pdf', url: '#' }],
    },
    {
      id: 2,
      conversa_id: 1,
      remetente_email: 'joao@techcorp.com',
      remetente_nome: 'João Silva',
      remetente_tipo: 'cliente',
      conteudo: 'Perfeito! Quando começamos?',
      visibilidade: 'compartilhado',
      created_date: '2026-03-19T09:15:00',
      lida_por: ['marina@apsis.com'],
      anexos: [],
    },
    {
      id: 3,
      conversa_id: 1,
      remetente_email: 'marina@apsis.com',
      remetente_nome: 'Marina Silva',
      remetente_tipo: 'apsis',
      conteudo: 'Começamos na próxima segunda. Documentação foi atualizada',
      visibilidade: 'compartilhado',
      created_date: '2026-03-19T10:30:00',
      lida_por: [],
      anexos: [],
    },
  ],
  2: [
    {
      id: 1,
      conversa_id: 2,
      remetente_email: 'joao@techcorp.com',
      remetente_nome: 'João Silva',
      remetente_tipo: 'cliente',
      conteudo: 'Qual é a diferença entre receita bruta e receita líquida no relatório?',
      visibilidade: 'compartilhado',
      created_date: '2026-03-18T14:00:00',
      lida_por: ['carlos@apsis.com'],
      anexos: [],
    },
    {
      id: 2,
      conversa_id: 2,
      remetente_email: 'carlos@apsis.com',
      remetente_nome: 'Carlos Santos',
      remetente_tipo: 'apsis',
      conteudo:
        'Ótima pergunta! Receita bruta é o total sem deduções. Receita líquida desconta devoluções e impostos. Vou enviar um documento com exemplos.',
      visibilidade: 'compartilhado',
      created_date: '2026-03-18T15:45:00',
      lida_por: [],
      anexos: [{ nome: 'Diferenca_Receita.pdf', url: '#' }],
    },
  ],
  3: [
    {
      id: 1,
      conversa_id: 3,
      remetente_email: 'ana@apsis.com',
      remetente_nome: 'Ana Costa',
      remetente_tipo: 'apsis',
      conteudo: 'Qual é o melhor horário para a reunião? Segunda a quarta?',
      visibilidade: 'compartilhado',
      created_date: '2026-03-17T09:20:00',
      lida_por: [],
      anexos: [],
    },
  ],
};

export default function PortalClienteComunicacao() {
  const [selectedConversaId, setSelectedConversaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedConversa = mockConversas.find((c) => c.id === selectedConversaId);
  const messages = selectedConversaId ? mockMensagens[selectedConversaId] || [] : [];

  const handleSendMessage = (text) => {
    console.log('Mensagem enviada:', text);
    // Em produção, chamar API para salvar mensagem
  };

  const handleToggleVisibility = (messageId) => {
    console.log('Alternar visibilidade:', messageId);
  };

  return (
    <div className="space-y-6 h-full">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Comunicação</h1>
        <p className="text-[var(--text-secondary)]">Mantenha-se em contato com sua equipe APSIS</p>
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden flex flex-col md:flex-row h-[600px]">
        {/* Mobile: Lista em modal ou expandida */}
        <ConversasList
          conversas={mockConversas}
          selectedId={selectedConversaId}
          onSelectConversa={(conversa) => setSelectedConversaId(conversa.id)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Chat Area */}
        <ChatArea
          selectedConversation={selectedConversa}
          messages={messages}
          currentUserEmail="joao@techcorp.com"
          currentUserType="cliente"
          onSendMessage={handleSendMessage}
          onToggleVisibility={handleToggleVisibility}
        />
      </div>
    </div>
  );
}