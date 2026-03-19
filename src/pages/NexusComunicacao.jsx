import { useState } from 'react';
import ConversasList from '@/components/ConversasList';
import ChatArea from '@/components/ChatArea';

// Mock data - mesma estrutura
const mockConversas = [
  {
    id: 1,
    titulo: 'Auditoria Contábil 2025',
    descricao: 'Projeto - Auditoria completa das demonstrações contábeis',
    tipo: 'projeto',
    ultima_mensagem: 'Documentação foi atualizada',
    ultima_mensagem_em: '2026-03-19T10:30:00',
    nao_lidas: 0,
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
  {
    id: 4,
    titulo: 'Consultoria Tributária',
    descricao: 'Projeto - Planejamento fiscal para 2026',
    tipo: 'projeto',
    ultima_mensagem: 'Reunião de alinhamento marcada para quinta',
    ultima_mensagem_em: '2026-03-16T14:10:00',
    nao_lidas: 0,
  },
];

const mockMensagens = {
  1: [
    {
      id: 1,
      conversa_id: 1,
      remetente_email: 'marina@apsis.com',
      remetente_nome: 'Marina Silva (Você)',
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
      remetente_nome: 'João Silva (Cliente)',
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
      remetente_nome: 'Marina Silva (Você)',
      remetente_tipo: 'apsis',
      conteudo: 'Internamente, ela pediu para ajustar o cronograma.',
      visibilidade: 'interno',
      created_date: '2026-03-19T09:45:00',
      lida_por: [],
      anexos: [],
    },
    {
      id: 4,
      conversa_id: 1,
      remetente_email: 'marina@apsis.com',
      remetente_nome: 'Marina Silva (Você)',
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
      remetente_nome: 'João Silva (Cliente)',
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
      remetente_nome: 'Ana Costa (Você)',
      remetente_tipo: 'apsis',
      conteudo: 'Qual é o melhor horário para a reunião? Segunda a quarta?',
      visibilidade: 'compartilhado',
      created_date: '2026-03-17T09:20:00',
      lida_por: [],
      anexos: [],
    },
  ],
  4: [
    {
      id: 1,
      conversa_id: 4,
      remetente_email: 'patricia@apsis.com',
      remetente_nome: 'Patricia Silva',
      remetente_tipo: 'apsis',
      conteudo: 'Reunião de alinhamento marcada para quinta às 10h',
      visibilidade: 'compartilhado',
      created_date: '2026-03-16T14:10:00',
      lida_por: [],
      anexos: [],
    },
  ],
};

export default function NexusComunicacao() {
  const [selectedConversaId, setSelectedConversaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedConversa = mockConversas.find((c) => c.id === selectedConversaId);
  const messages = selectedConversaId ? mockMensagens[selectedConversaId] || [] : [];

  const handleSendMessage = (text) => {
    console.log('Mensagem enviada:', text);
  };

  const handleToggleVisibility = (messageId) => {
    console.log('Alternar visibilidade:', messageId);
  };

  return (
    <div className="space-y-6 h-full">
      <div className="bg-gradient-to-r from-[var(--apsis-green)] to-[var(--apsis-green-light)] text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Communication Center</h1>
        <p className="text-white/80 text-sm">Gerencie comunicações com clientes, com visibilidade e auditoria completa.</p>
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden flex flex-col md:flex-row h-[600px]">
        <ConversasList
          conversas={mockConversas}
          selectedId={selectedConversaId}
          onSelectConversa={(conversa) => setSelectedConversaId(conversa.id)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <ChatArea
          selectedConversation={selectedConversa}
          messages={messages}
          currentUserEmail="marina@apsis.com"
          currentUserType="apsis"
          onSendMessage={handleSendMessage}
          onToggleVisibility={handleToggleVisibility}
        />
      </div>
    </div>
  );
}