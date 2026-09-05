/**
 * WhatsApp helpers for Vendi Patrocínio
 * Pattern required: https://wa.me/55DDDNÚMERO?text=MENSAGEM
 * Message required: "Olá! Vi seu anúncio de [TÍTULO DO PRODUTO] no Vendi Patrocínio. Ainda está disponível?"
 */

export function buildWhatsAppLink(phone: string, adTitle: string): string {
  // Strip spaces, parentheses, dashes, plus signs
  let clean = (phone || '').replace(/\D/g, '');
  if (!clean) return '#';

  // Ensure country code 55
  if (!clean.startsWith('55')) {
    clean = `55${clean}`;
  }

  const message = `Olá! Vi seu anúncio “${adTitle.trim()}” no Vendi Patrocínio e gostaria de saber se ainda está disponível.`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function formatDisplayPhone(phone: string): string {
  if (!phone) return '';
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('55') && clean.length > 11) {
    clean = clean.slice(2);
  }
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  return phone;
}

export function formatBrazilianInputPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function validateBrazilianMobile(value: string): { valid: boolean; error?: string; cleanDigits?: string } {
  const clean = value.replace(/\D/g, '');
  if (clean.length !== 11) {
    return { valid: false, error: 'O número deve conter o DDD (2 dígitos) seguido de 9 dígitos.' };
  }
  const ddd = parseInt(clean.slice(0, 2), 10);
  if (ddd < 11 || ddd > 99) {
    return { valid: false, error: 'DDD brasileiro inválido.' };
  }
  if (clean.charAt(2) !== '9') {
    return { valid: false, error: 'O número de celular deve iniciar com o dígito 9 após o DDD.' };
  }
  return { valid: true, cleanDigits: clean };
}
