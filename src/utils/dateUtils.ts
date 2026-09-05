/**
 * Brazilian date helpers for Vendi Patrocínio
 * Formats and parses DD/MM/AAAA strings and validates 18+ age requirement.
 */

export function formatBrazilianDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;
  const str = dateStr.trim();

  // Pattern DD/MM/AAAA
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (
        isNaN(day) || isNaN(month) || isNaN(year) ||
        day < 1 || day > 31 ||
        month < 1 || month > 12 ||
        year < 1910 || year > new Date().getFullYear()
      ) {
        return null;
      }
      const d = new Date(year, month - 1, day);
      if (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
        return d;
      }
    }
    return null;
  }

  // Pattern YYYY-MM-DD
  if (str.includes('-')) {
    const parts = str.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (
        isNaN(day) || isNaN(month) || isNaN(year) ||
        day < 1 || day > 31 ||
        month < 1 || month > 12 ||
        year < 1910 || year > new Date().getFullYear()
      ) {
        return null;
      }
      const d = new Date(year, month - 1, day);
      if (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
        return d;
      }
    }
  }

  const fallback = new Date(str);
  return isNaN(fallback.getTime()) ? null : fallback;
}

export function calculateAgeFromDate(dateInput: string | Date): {
  isValid: boolean;
  age: number;
  is18OrOlder: boolean;
  errorMessage?: string;
} {
  const birth = typeof dateInput === 'string' ? parseDateString(dateInput) : dateInput;
  if (!birth) {
    return {
      isValid: false,
      age: 0,
      is18OrOlder: false,
      errorMessage: 'Data incompleta ou inválida. Use o formato DD/MM/AAAA.'
    };
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  if (age < 0 || age > 120) {
    return {
      isValid: false,
      age,
      is18OrOlder: false,
      errorMessage: 'Ano de nascimento inválido.'
    };
  }

  return {
    isValid: true,
    age,
    is18OrOlder: age >= 18,
    errorMessage: age < 18 ? 'Apenas maiores de 18 anos podem se cadastrar.' : undefined
  };
}
