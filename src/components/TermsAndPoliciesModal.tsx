import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  FileText,
  ShieldCheck,
  AlertOctagon,
  Ban,
  CheckCircle2,
  Lock,
  UserX,
  Send,
  HelpCircle,
  ExternalLink,
  MapPin,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export type TermsTab =
  | 'terms'
  | 'privacy'
  | 'ad_rules'
  | 'prohibited_items'
  | 'safety_tips'
  | 'how_to_report'
  | 'account_deletion';

interface Props {
  initialTab?: TermsTab;
}

export const TermsAndPoliciesModal: React.FC<Props> = () => {
  const {
    isTermsModalOpen,
    closeTermsModal,
    termsModalTab,
    setTermsModalTab,
    currentUser,
    submitAccountDeletionRequest,
    showToast
  } = useApp();

  const [deletionReason, setDeletionReason] = useState('');
  const [confirmDeletionCheck, setConfirmDeletionCheck] = useState(false);
  const [isSubmittingDeletion, setIsSubmittingDeletion] = useState(false);

  if (!isTermsModalOpen) return null;

  const handleDeletionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Faça login para solicitar a exclusão de dados da sua conta.', 'info');
      return;
    }
    if (!confirmDeletionCheck) {
      showToast('Por favor, marque a caixa confirmando a solicitação de exclusão.', 'error');
      return;
    }
    setIsSubmittingDeletion(true);
    submitAccountDeletionRequest(deletionReason.trim());
    setIsSubmittingDeletion(false);
    setDeletionReason('');
    setConfirmDeletionCheck(false);
  };

  const navItems: { id: TermsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'terms', label: 'Termos de Uso', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacy', label: 'Política de Privacidade (LGPD)', icon: <Lock className="w-4 h-4" /> },
    { id: 'ad_rules', label: 'Regras de Publicação', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'prohibited_items', label: 'Produtos e Serviços Proibidos', icon: <Ban className="w-4 h-4" /> },
    { id: 'safety_tips', label: 'Dicas de Segurança', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'how_to_report', label: 'Como Denunciar', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'account_deletion', label: 'Solicitar Exclusão da Conta', icon: <UserX className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white w-full max-w-4xl min-h-[550px] max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
        {/* Top Header */}
        <div className="bg-orange-50/80 border-b border-orange-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F95700] text-white flex items-center justify-center font-black shadow-xs">
              V
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Central Legal, Privacidade e Segurança
              </h2>
              <p className="text-xs text-orange-950/70">
                Vendi Patrocínio • Normas de uso, LGPD e diretrizes da comunidade local
              </p>
            </div>
          </div>
          <button
            onClick={closeTermsModal}
            className="p-2 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-800 shadow-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Sidebar Navigation + Main Panel */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-64 bg-gray-50/80 border-b md:border-b-0 md:border-r border-gray-200 p-3 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1.5 flex-shrink-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTermsModalTab(item.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap md:whitespace-normal cursor-pointer ${
                  termsModalTab === item.id
                    ? 'bg-[#F95700] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-[#F95700]'
                }`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                <ChevronRight
                  className={`w-3.5 h-3.5 hidden md:block ${
                    termsModalTab === item.id ? 'opacity-100 text-white' : 'opacity-0'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Main Body Content Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 text-gray-700 text-xs sm:text-sm leading-relaxed space-y-4">
            {/* 1. TERMOS DE USO */}
            {termsModalTab === 'terms' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <div className="inline-block bg-orange-100 text-[#F95700] text-[10px] font-black uppercase px-2 py-0.5 rounded mb-1">
                    Versão Atual: 2.1 • Atualizado para Patrocínio - MG
                  </div>
                  <h3 className="text-xl font-black text-gray-900">Termos e Condições de Uso</h3>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 font-medium">
                  <p className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-[#F95700]" />
                    Aviso Importante sobre a Natureza da Plataforma:
                  </p>
                  O <strong>Vendi Patrocínio</strong> funciona estritamente como uma plataforma intermediadora de classificados digitais e divulgação para a cidade de Patrocínio - MG. A plataforma aproxima compradores e vendedores para negociação direta no WhatsApp ou pessoalmente, não realizando vendas, não recebendo pagamentos e não efetuando entregas.
                </div>

                <h4 className="font-bold text-gray-900 text-sm">1. Objeto e Funcionamento</h4>
                <p>
                  O Vendi Patrocínio disponibiliza espaço virtual gratuito para que pessoas físicas e jurídicas residentes ou atuantes no município de Patrocínio e seus distritos (Silvano, Salitre de Minas, São João da Serra Negra, etc.) possam divulgar produtos e serviços.
                </p>

                <h4 className="font-bold text-gray-900 text-sm">2. Isenção de Responsabilidade sobre Transações</h4>
                <p>
                  O Vendi Patrocínio <strong>não é proprietário</strong> dos produtos ou serviços anunciados, não guarda a posse dos itens e não intervém na definição de preços, qualidade, prazos ou formas de pagamento. A responsabilidade por qualquer negociação, vício oculto, entrega, garantia legal ou pagamento recai integral e exclusivamente sobre os usuários contratantes.
                </p>

                <h4 className="font-bold text-gray-900 text-sm">3. Cadastro, Idade Mínima e Exclusividade de Nome de Usuário</h4>
                <p>
                  O cadastro na plataforma é restrito a indivíduos com <strong>18 (dezoito) anos completos ou mais</strong>. É obrigatório fornecer informações verdadeiras e escolher um nome de usuário único iniciado pelo caractere "@". Nomes falsos, ofensivos ou que induzam a erro sobre a identidade de terceiros serão banidos sumariamente.
                </p>

                <h4 className="font-bold text-gray-900 text-sm">4. Moderação e Remoção de Conteúdo</h4>
                <p>
                  A equipe de moderação do Vendi Patrocínio reserva-se o direito de remover qualquer anúncio, suspender ou excluir contas que violem as regras da comunidade, cometam fraudes, publiquem spam ou comercializem itens proibidos por lei.
                </p>

                <h4 className="font-bold text-gray-900 text-sm">5. Foro e Legislação Aplicável</h4>
                <p>
                  Estes Termos são regidos pelas leis da República Federativa do Brasil, em especial o Marco Civil da Internet (Lei nº 12.965/14) e o Código de Defesa do Consumidor, elegendo-se o Foro da Comarca de Patrocínio - MG para dirimir quaisquer litígios.
                </p>
              </div>
            )}

            {/* 2. POLÍTICA DE PRIVACIDADE (LGPD) */}
            {termsModalTab === 'privacy' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <div className="inline-block bg-blue-100 text-blue-700 text-[10px] font-black uppercase px-2 py-0.5 rounded mb-1">
                    Conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018)
                  </div>
                  <h3 className="text-xl font-black text-gray-900">Política de Privacidade de Dados</h3>
                </div>

                <p>
                  O <strong>Vendi Patrocínio</strong> preza pela segurança, privacidade e transparência no tratamento dos dados pessoais de todos os usuários da nossa cidade.
                </p>

                <h4 className="font-bold text-gray-900 text-sm">1. Dados Pessoais Coletados</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                  <li><strong>Dados de identificação e contato:</strong> Nome completo, nome de usuário exclusivo (@), foto de perfil, e-mail e número de WhatsApp.</li>
                  <li><strong>Localização aproximada:</strong> Bairro em Patrocínio - MG (endereço residencial exato nunca é solicitado nem divulgado).</li>
                  <li><strong>Verificação de idade:</strong> Data de nascimento para garantia de maioridade legal (18+).</li>
                  <li><strong>Registro de aceite legal:</strong> Data/hora exata do aceite, endereço IP e versões das políticas aceitas para fins de cumprimento de obrigação legal.</li>
                </ul>

                <h4 className="font-bold text-gray-900 text-sm">2. O que Nunca é Exibido Publicamente</h4>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                  <strong>Proteção ativa de privacidade:</strong> Seu e-mail, senha, data de nascimento, documentos e endereço completo <em>jamais</em> são expostos nos anúncios ou no perfil público. Apenas o seu nome de exibição, @nome_de_usuario, bairro e WhatsApp de negociação são compartilhados para viabilizar o contato comercial.
                </div>

                <h4 className="font-bold text-gray-900 text-sm">3. Finalidade do Tratamento de Dados</h4>
                <p>
                  Os dados são utilizados estritamente para autenticação, exibição de anúncios, prevenção a fraudes/contas falsas e comunicação entre vendedores e compradores interessados.
                </p>

                <h4 className="font-bold text-gray-900 text-sm">4. Seus Direitos sob a LGPD (Artigo 18)</h4>
                <p>
                  Você pode a qualquer momento consultar seus dados, solicitar correções, revogar consentimentos e solicitar a <strong>exclusão total de sua conta e dos dados pessoais</strong> através da aba própria nesta central ou pelo e-mail oficial de atendimento.
                </p>
              </div>
            )}

            {/* 3. REGRAS DE PUBLICAÇÃO */}
            {termsModalTab === 'ad_rules' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-xl font-black text-gray-900">Regras Oficiais para Publicação de Anúncios</h3>
                  <p className="text-xs text-gray-500">Diretrizes para anúncios aprovados com rapidez</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    <h5 className="font-bold text-gray-900 mb-1">1. Fotos Reais do Produto</h5>
                    <p className="text-gray-600">Publique fotos nítidas do produto em seu estado atual. Evite fotos genéricas de catálogo que possam enganar o comprador sobre marcas de uso.</p>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    <h5 className="font-bold text-gray-900 mb-1">2. Preço Real e Transparente</h5>
                    <p className="text-gray-600">É proibido colocar preços simbólicos como "R$ 1" ou "R$ 0" quando o produto tiver valor real. Use a opção "Valor a combinar" caso esteja aberto a propostas.</p>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    <h5 className="font-bold text-gray-900 mb-1">3. Proibição de Anúncios Duplicados (Spam)</h5>
                    <p className="text-gray-600">Não publique repetidas vezes o mesmo item para forçar visibilidade. Anúncios duplicados são automaticamente detectados e excluídos pelo sistema.</p>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    <h5 className="font-bold text-gray-900 mb-1">4. Limite Diário de Publicações</h5>
                    <p className="text-gray-600">Para manter o marketplace equilibrado e evitar bombardeamento por robôs, contas comuns possuem limite de segurança de até 5 anúncios por dia.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PRODUTOS E SERVIÇOS PROIBIDOS */}
            {termsModalTab === 'prohibited_items' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-xl font-black text-red-600 flex items-center gap-2">
                    <Ban className="w-5 h-5" />
                    Produtos e Serviços Estritamente Proibidos
                  </h3>
                  <p className="text-xs text-gray-500">Itens que geram exclusão imediata do anúncio e bloqueio do anunciante</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-200">
                    <strong className="text-red-900 block mb-1">❌ Armas e Munições</strong>
                    <span className="text-red-800">Armas de fogo, réplicas, airsoft sem registro, facas táticas, munições e explosivos.</span>
                  </div>
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-200">
                    <strong className="text-red-900 block mb-1">❌ Remédios e Drogas</strong>
                    <span className="text-red-800">Medicamentos sob prescrição, esteroides anabolizantes, substâncias entorpecentes ou cigarros eletrônicos (vapes).</span>
                  </div>
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-200">
                    <strong className="text-red-900 block mb-1">❌ Animais Silvestres</strong>
                    <span className="text-red-800">Espécies da fauna silvestre brasileira sem licença do IBAMA ou órgãos ambientais.</span>
                  </div>
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-200">
                    <strong className="text-red-900 block mb-1">❌ Pirataria e Réplicas</strong>
                    <span className="text-red-800">Produtos falsificados, listas de IPTV pirata, contas de streaming hackeadas e softwares crackeados.</span>
                  </div>
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-200">
                    <strong className="text-red-900 block mb-1">❌ Esquemas e Promessas Financeiras</strong>
                    <span className="text-red-800">Pirâmides financeiras, jogos de azar ilegais, empréstimos fraudulentos ou promessas de enriquecimento rápido.</span>
                  </div>
                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-200">
                    <strong className="text-red-900 block mb-1">❌ Conteúdo Adulto / Explícito</strong>
                    <span className="text-red-800">Serviços de acompanhantes, pornografia ou material que viole a dignidade sexual.</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. DICAS DE SEGURANÇA */}
            {termsModalTab === 'safety_tips' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-xl font-black text-emerald-700 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Dicas de Segurança em Patrocínio - MG
                  </h3>
                  <p className="text-xs text-gray-500">Como negociar sem cair em armadilhas e golpes</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-orange-50 border-l-4 border-[#F95700] p-3.5 rounded-r-xl">
                    <strong className="text-orange-950 block text-sm mb-1">1. Regra de Ouro: NUNCA faça pagamentos antecipados</strong>
                    <p className="text-orange-900">Desconfie imediatamente de pedidos de "sinal", "taxa de entrega pelo Uber" ou adiantamento por PIX para segurar um produto. No Vendi Patrocínio, só pague quando estiver com o produto em mãos.</p>
                  </div>

                  <div className="bg-gray-50 border-l-4 border-emerald-500 p-3.5 rounded-r-xl">
                    <strong className="text-gray-900 block text-sm mb-1">2. Pontos de Encontro Recomendados</strong>
                    <p className="text-gray-600">Marque de se encontrar em locais públicos e movimentados de Patrocínio, como a <strong>Praça Santa Luzia</strong>, <strong>Praça Honorato Borges</strong>, agências bancárias ou no estacionamento de supermercados (Bernardão, Bahamas, etc.).</p>
                  </div>

                  <div className="bg-gray-50 border-l-4 border-blue-500 p-3.5 rounded-r-xl">
                    <strong className="text-gray-900 block text-sm mb-1">3. Teste o Produto Pessoalmente</strong>
                    <p className="text-gray-600">Para eletrônicos e celulares, verifique a saúde da bateria, se o aparelho não está bloqueado no iCloud ou Google, e faça ligações de teste.</p>
                  </div>

                  <div className="bg-gray-50 border-l-4 border-purple-500 p-3.5 rounded-r-xl">
                    <strong className="text-gray-900 block text-sm mb-1">4. Verifique o Perfil do Vendedor</strong>
                    <p className="text-gray-600">Consulte o perfil do vendedor no Vendi Patrocínio para conferir a data de entrada, o selo de WhatsApp Verificado e os itens que ele já vendeu.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. COMO DENUNCIAR */}
            {termsModalTab === 'how_to_report' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-xl font-black text-gray-900">Como Denunciar um Anúncio ou Perfil</h3>
                  <p className="text-xs text-gray-500">Nosso time de moderação atua ativamente para manter a cidade segura</p>
                </div>

                <p className="text-xs text-gray-600">
                  Se você identificar uma tentativa de golpe, produto proibido ou comportamento suspeito:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#F95700] text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <strong className="text-gray-900 block">Denunciar um Anúncio</strong>
                      Abra o anúncio e clique no botão <em>"Denunciar anúncio"</em> no rodapé da descrição. Escolha o motivo e descreva o ocorrido.
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#F95700] text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <strong className="text-gray-900 block">Denunciar um Perfil de Vendedor</strong>
                      No perfil público do vendedor (@usuario), clique em <em>"Denunciar usuário"</em>.
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#F95700] text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">
                      3
                    </div>
                    <div>
                      <strong className="text-gray-900 block">Análise e Medidas Administrativas</strong>
                      Nossa equipe revisa a denúncia no Painel de Moderação, podendo remover o anúncio, suspender a conta ou incluir o número em lista de bloqueio.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SOLICITAÇÃO DE EXCLUSÃO DA CONTA (LGPD) */}
            {termsModalTab === 'account_deletion' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <div className="inline-block bg-red-100 text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded mb-1">
                    Direito de Exclusão e Eliminação de Dados (Art. 18, VI da LGPD)
                  </div>
                  <h3 className="text-xl font-black text-gray-900">Solicitação de Exclusão da Conta e Dados Pessoais</h3>
                  <p className="text-xs text-gray-500">
                    Você tem o direito de solicitar a exclusão definitiva da sua conta e de todos os seus anúncios do Vendi Patrocínio
                  </p>
                </div>

                {currentUser ? (
                  <form onSubmit={handleDeletionSubmit} className="space-y-4 bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200">
                    <div className="text-xs bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                      <div className="font-bold text-gray-900">Dados da conta conectada:</div>
                      <div>Nome: <span className="font-semibold text-gray-800">{currentUser.name}</span> ({currentUser.username})</div>
                      <div>E-mail: <span className="font-semibold text-gray-800">{currentUser.email}</span></div>
                      <div>WhatsApp: <span className="font-semibold text-gray-800">{currentUser.whatsapp}</span></div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Motivo da solicitação de exclusão (Opcional):
                      </label>
                      <textarea
                        rows={3}
                        value={deletionReason}
                        onChange={(e) => setDeletionReason(e.target.value)}
                        placeholder="Conte-nos o motivo pelo qual deseja excluir sua conta e desativar seus anúncios..."
                        className="w-full p-3 bg-white rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={confirmDeletionCheck}
                        onChange={(e) => setConfirmDeletionCheck(e.target.checked)}
                        className="mt-0.5 rounded text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span className="text-xs text-gray-700 leading-tight">
                        Estou ciente de que a exclusão da conta resultará na <strong>remoção de todos os meus anúncios ativos</strong>, histórico e dados de perfil de acordo com a LGPD.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmittingDeletion}
                      className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <UserX className="w-4 h-4" />
                      <span>{isSubmittingDeletion ? 'Processando...' : 'Confirmar e Enviar Pedido de Exclusão'}</span>
                    </button>
                  </form>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl text-center space-y-3">
                    <UserX className="w-10 h-10 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-600 max-w-md mx-auto">
                      Para solicitar a exclusão dos dados de uma conta específica, conecte-se à conta ou entre em contato direto pelo canal de privacidade:
                    </p>
                    <div className="text-xs font-bold text-gray-800">
                      privacidade@vendipatrocinio.com.br
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0 text-xs text-gray-500">
          <span>Vendi Patrocínio • Transparência e Segurança Local</span>
          <button
            onClick={closeTermsModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
