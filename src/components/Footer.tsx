import React from 'react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MessageCircle, MapPin, Heart, HelpCircle, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setIsSafetyModalOpen, setSelectedCategory, categories } = useApp();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16 pb-20 md:pb-8">
      {/* City Highlight Banner */}
      <div className="bg-orange-500 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
              O maior portal de desapego e compras de Patrocínio - MG
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 mt-0.5">
              Conectando moradores, produtores de café, comerciantes e prestadores de serviços.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold">
              100% Gratuito
            </span>
            <span className="bg-white text-[#F95700] px-3 py-1 rounded-full text-xs font-black">
              Sem Comissões
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Info */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-xs text-gray-500 leading-relaxed">
              O Vendi Patrocínio foi criado para facilitar a compra, venda e troca de produtos e serviços locais na cidade de Patrocínio - MG. Negocie de forma rápida e segura direto pelo WhatsApp!
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-[#F95700]" />
              <span>Patrocínio, Minas Gerais - Brasil</span>
            </div>
          </div>

          {/* Col 2: Categorias Populares */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Categorias Populares
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(c.id);
                      setActiveView('home');
                    }}
                    className="hover:text-[#F95700] transition-colors"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Segurança & Confiança */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Segurança e Ajuda
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <button
                  onClick={() => setIsSafetyModalOpen(true)}
                  className="hover:text-[#F95700] flex items-center gap-1 font-medium text-emerald-700"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Dicas contra golpes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSafetyModalOpen(true)}
                  className="hover:text-[#F95700]"
                >
                  Produtos proibidos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSafetyModalOpen(true)}
                  className="hover:text-[#F95700]"
                >
                  Pontos de encontro seguros
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="hover:text-[#F95700] text-gray-400"
                >
                  Painel de Moderação
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Institucional & Contato */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Institucional
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <span className="hover:text-[#F95700] cursor-pointer">Termos de Uso</span>
              </li>
              <li>
                <span className="hover:text-[#F95700] cursor-pointer">Política de Privacidade</span>
              </li>
              <li>
                <span className="hover:text-[#F95700] cursor-pointer">Regras para Anúncios</span>
              </li>
              <li>
                <a
                  href="https://wa.me/5534999990000?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20o%20suporte%20do%20Vendi%20Patroc%C3%ADnio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 flex items-center gap-1 font-medium text-emerald-600"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Contato e Suporte WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
          <p>© {new Date().getFullYear()} Vendi Patrocínio. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com carinho para a Capital do Café • Patrocínio - MG
          </p>
        </div>
      </div>
    </footer>
  );
};
