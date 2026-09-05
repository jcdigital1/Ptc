import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Gamepad2,
  Car,
  Home,
  Armchair,
  Shirt,
  Sparkles,
  Wrench,
  Briefcase,
  Tractor,
  Dog,
  Layers,
  ChevronRight
} from 'lucide-react';

export const CategoryIconMap: Record<string, React.ElementType> = {
  Smartphone,
  Gamepad2,
  Car,
  Home,
  Armchair,
  Shirt,
  Sparkles,
  Wrench,
  Briefcase,
  Tractor,
  Dog,
  Layers,
};

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, setActiveView } = useApp();

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <span>Categorias em Patrocínio</span>
        </h2>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-xs font-semibold text-[#F95700] hover:underline"
          >
            Limpar filtro
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Categories Container */}
      <div className="flex items-start gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {/* "Todos" pill */}
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all cursor-pointer w-20 sm:w-22 text-center group ${
            selectedCategory === null
              ? 'bg-orange-50 ring-2 ring-[#F95700]'
              : 'bg-white hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              selectedCategory === null
                ? 'bg-[#F95700] text-white shadow-md shadow-orange-500/20'
                : 'bg-gray-100 text-gray-700 group-hover:bg-orange-100 group-hover:text-[#F95700]'
            }`}
          >
            <Layers className="w-6 h-6" />
          </div>
          <span
            className={`text-[11px] font-semibold leading-tight line-clamp-2 ${
              selectedCategory === null ? 'text-[#F95700] font-bold' : 'text-gray-700'
            }`}
          >
            Todos
          </span>
        </button>

        {categories.map((cat) => {
          const IconComponent = CategoryIconMap[cat.iconName] || Layers;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all cursor-pointer w-20 sm:w-24 text-center group ${
                isSelected
                  ? 'bg-orange-50 ring-2 ring-[#F95700]'
                  : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#F95700] text-white shadow-md shadow-orange-500/20'
                    : 'bg-orange-50 text-gray-700 group-hover:bg-[#F95700] group-hover:text-white'
                }`}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              <span
                className={`text-[11px] font-semibold leading-tight line-clamp-2 ${
                  isSelected ? 'text-[#F95700] font-bold' : 'text-gray-700'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
