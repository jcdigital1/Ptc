import React from 'react';
import { useApp } from '../context/AppContext';
import { CategoryIconMap } from './CategoryBar';
import { Layers, ArrowLeft, ArrowRight } from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { categories, setSelectedCategory, setActiveView, ads } = useApp();

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveView('home');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <button
        onClick={() => setActiveView('home')}
        className="text-xs font-semibold text-gray-500 hover:text-[#F95700] flex items-center gap-1 mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a Loja
      </button>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Todas as Categorias
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Encontre exatamente o que você procura na cidade de Patrocínio - MG
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const IconComp = CategoryIconMap[cat.iconName] || Layers;
          const count = ads.filter((a) => a.categoryId === cat.id && a.status === 'active').length;

          return (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#F95700] group-hover:bg-[#F95700] group-hover:text-white flex items-center justify-center transition-colors">
                  <IconComp className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-[#F95700] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {count} {count === 1 ? 'anúncio ativo' : 'anúncios ativos'}
                  </span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-orange-50 flex items-center justify-center text-gray-400 group-hover:text-[#F95700] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
