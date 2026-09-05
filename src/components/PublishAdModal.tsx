import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdCondition } from '../types';
import { compressImage } from '../utils/imageUtils';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Smartphone,
  Sparkles,
  HelpCircle,
  Phone,
  ShieldCheck,
  MapPin
} from 'lucide-react';

const PRESET_SAMPLE_PHOTOS = [
  { label: 'Smartphone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80' },
  { label: 'Videogame / Console', url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80' },
  { label: 'Veículo / Carro', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80' },
  { label: 'Casa / Imóvel', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80' },
  { label: 'Móveis / Sofá', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80' },
  { label: 'Agro / Maquinário', url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80' },
];

export const PublishAdModal: React.FC = () => {
  const {
    isPublishModalOpen,
    setIsPublishModalOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    categories,
    currentUser,
    neighborhoods,
    createAd,
    showToast,
    openAdDetail
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [priceType, setPriceType] = useState<'fixed' | 'negotiable' | 'free'>('fixed');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'eletronicos');
  const [condition, setCondition] = useState<AdCondition>('usado');
  const [neighborhood, setNeighborhood] = useState(currentUser?.neighborhood || 'Centro');
  const [acceptsOffers, setAcceptsOffers] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoInputUrl, setPhotoInputUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync default neighborhood when currentUser changes
  useEffect(() => {
    if (currentUser?.neighborhood) {
      setNeighborhood(currentUser.neighborhood);
    }
  }, [currentUser]);

  if (!isPublishModalOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - photos.length;
    if (remainingSlots <= 0) {
      showToast('O limite máximo é de 10 fotos.', 'error');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];

    showToast('Otimizando fotos para envio...', 'info');
    for (const file of filesToProcess) {
      try {
        const compressed = await compressImage(file, 900, 900, 0.82);
        setPhotos((prev) => (prev.length < 10 ? [...prev, compressed] : prev));
      } catch (err) {
        console.error('Failed to compress ad photo:', err);
      }
    }
  };

  const handleAddSamplePhoto = (url: string) => {
    if (photos.length >= 10) {
      showToast('Você já atingiu o limite de 10 fotos.', 'error');
      return;
    }
    setPhotos((prev) => [...prev, url]);
  };

  const handleAddPhotoByUrl = () => {
    if (!photoInputUrl.trim()) return;
    if (photos.length >= 10) {
      showToast('Limite de 10 fotos atingido.', 'error');
      return;
    }
    setPhotos((prev) => [...prev, photoInputUrl.trim()]);
    setPhotoInputUrl('');
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showToast('Faça login para publicar um anúncio.', 'error');
      return;
    }

    if (!currentUser.avatarUrl || currentUser.avatarUrl.trim() === '') {
      showToast('Você precisa adicionar uma foto de perfil antes de anunciar!', 'error');
      setIsPublishModalOpen(false);
      setAuthModalMode('set_photo');
      setIsAuthModalOpen(true);
      return;
    }

    if (!title.trim()) {
      showToast('Por favor, informe o título do anúncio.', 'error');
      return;
    }

    if (!description.trim()) {
      showToast('Por favor, adicione uma descrição detalhada.', 'error');
      return;
    }

    const sellerWhatsapp = currentUser.whatsapp || '';
    if (!sellerWhatsapp) {
      showToast('Número de WhatsApp não encontrado no perfil do usuário.', 'error');
      return;
    }

    // Determine final photos (fallback to pleasant placeholder if empty)
    const rawPhotos = photos.length > 0
      ? photos
      : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'];

    setIsSubmitting(true);

    // Ensure all images are safely compressed to prevent payload size issues
    const finalPhotos: string[] = [];
    for (const p of rawPhotos) {
      if (p.startsWith('data:image/') && p.length > 80000) {
        try {
          const compressed = await compressImage(p, 750, 750, 0.75);
          finalPhotos.push(compressed);
        } catch {
          finalPhotos.push(p);
        }
      } else {
        finalPhotos.push(p);
      }
    }

    const numericPrice = priceType === 'free' ? 0 : parseFloat(price.replace(/\D/g, '')) || 0;

    try {
      const newAd = await createAd({
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
        priceType,
        categoryId,
        condition,
        neighborhood,
        city: 'Patrocínio - MG',
        whatsapp: sellerWhatsapp,
        photos: finalPhotos,
        acceptsOffers,
        isFeatured: false,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        sellerAvatar: currentUser.avatarUrl,
        sellerJoinedDate: currentUser.joinedDate || 'Hoje'
      });

      setIsSubmitting(false);

      if (newAd) {
        setIsPublishModalOpen(false);
        // Reset form
        setTitle('');
        setDescription('');
        setPrice('');
        setPhotos([]);
        openAdDetail(newAd);
      }
    } catch (err) {
      console.error('Error submitting ad:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4">
      <div className="relative bg-white w-full max-w-2xl min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[96vh]">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Publicar Anúncio Grátis
            </h2>
            <p className="text-xs text-gray-500">
              Negocie direto no WhatsApp com moradores de Patrocínio - MG
            </p>
          </div>
          <button
            onClick={() => setIsPublishModalOpen(false)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Section: Photos (Up to 10) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#F95700]" />
                Fotos do produto ({photos.length}/10)
              </label>
              <span className="text-xs text-gray-400">Até 10 fotografias</span>
            </div>

            {/* Photo Preview Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                      Capa
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {photos.length < 10 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#F95700] hover:bg-orange-50/50 flex flex-col items-center justify-center cursor-pointer transition-all p-2 text-center text-gray-500 hover:text-[#F95700]">
                  <Upload className="w-5 h-5 mb-1 text-gray-400 group-hover:text-[#F95700]" />
                  <span className="text-[11px] font-semibold leading-tight">Enviar foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Sample photo presets for quick testing */}
            <div className="bg-orange-50/70 border border-orange-100 rounded-xl p-3 text-xs">
              <span className="font-semibold text-orange-950 block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#F95700]" />
                Ou selecione fotos de exemplo para teste rápido:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SAMPLE_PHOTOS.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddSamplePhoto(sample.url)}
                    className="bg-white hover:bg-orange-100 text-gray-700 hover:text-orange-900 border border-orange-200 px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    + {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Título do anúncio *
              </label>
              <input
                type="text"
                required
                maxLength={90}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: iPhone 13 128GB, Gol 2014 Completo, Sofá Retrátil..."
                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:outline-none focus:border-[#F95700] text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Categoria *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:outline-none focus:border-[#F95700] text-sm text-gray-900 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Estado do produto *
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['novo', 'usado', 'seminovo', 'nao_aplica'] as AdCondition[]).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setCondition(cond)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold capitalize transition-all ${
                      condition === cond
                        ? 'bg-[#F95700] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cond === 'nao_aplica' ? 'N/A' : cond}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Price & Offers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Preço (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                  R$
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  disabled={priceType === 'free'}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={priceType === 'free' ? 'Grátis' : '0,00'}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:outline-none focus:border-[#F95700] text-sm font-bold text-gray-900"
                />
              </div>

              {/* Price Type Toggles */}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setPriceType('fixed')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                    priceType === 'fixed'
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Preço Fixo
                </button>
                <button
                  type="button"
                  onClick={() => setPriceType('negotiable')}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                    priceType === 'negotiable'
                      ? 'bg-[#F95700] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  A Combinar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPriceType('free');
                    setPrice('0');
                  }}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                    priceType === 'free'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Grátis / Doação
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Bairro ou região em Patrocínio *
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:outline-none focus:border-[#F95700] text-sm text-gray-900 font-medium"
              >
                {neighborhoods
                  .filter((n) => n.active)
                  .map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.type})
                    </option>
                  ))}
              </select>
              <p className="text-[11px] text-gray-400 mt-1">
                Preenchido com o bairro do seu perfil. Você pode alterar caso o produto esteja em outro local de Patrocínio.
              </p>
            </div>
          </div>

          {/* Section: WhatsApp & Offers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                    WhatsApp Oficial Vinculado
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3 text-[#25D366]" />
                    Automático
                  </span>
                </div>
                <p className="text-base font-black text-gray-900 font-mono tracking-wide">
                  {currentUser?.whatsapp || '(34) 99999-9999'}
                </p>
              </div>
              <p className="text-[11px] text-emerald-800/80 mt-1.5 leading-snug">
                Você não precisa digitar seu WhatsApp. O botão "Chamar no WhatsApp" direcionará os compradores para este contato cadastrado.
              </p>
            </div>

            <div className="flex items-center">
              <label className="relative flex items-start gap-2.5 cursor-pointer select-none bg-gray-50 hover:bg-gray-100 p-3.5 rounded-2xl border border-gray-200 w-full h-full">
                <input
                  type="checkbox"
                  checked={acceptsOffers}
                  onChange={(e) => setAcceptsOffers(e.target.checked)}
                  className="mt-0.5 rounded text-[#F95700] focus:ring-orange-500 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-bold text-gray-800 block">
                    Aceitar contrapropostas
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Sinaliza no anúncio que você está aberto a negociar o valor com os compradores.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section: Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Descrição completa do produto ou serviço *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhes como tempo de uso, motivo da venda, o que acompanha, local de entrega sugerido (ex: Centro de Patrocínio)..."
              className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:outline-none focus:border-[#F95700] text-sm text-gray-900"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F95700] hover:bg-[#E04E00] active:scale-98 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-base transition-all cursor-pointer"
            >
              <Check className="w-5 h-5" />
              <span>{isSubmitting ? 'Publicando...' : 'Publicar anúncio agora'}</span>
            </button>
            <p className="text-[11px] text-gray-400 text-center mt-2">
              Ao publicar, você concorda com as regras e termos do Vendi Patrocínio.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
