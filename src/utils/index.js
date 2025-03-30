function parseDate(dateString) {
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Os meses em JavaScript são baseados em zero
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateString); // Tenta criar uma data diretamente se o formato não for dd/mm/yyyy
}

export function formatMonthDayYear(date, currentDate = new Date()) {
  const milestoneDate = parseDate(date);
  if (isNaN(milestoneDate)) {
    return 'Invalid date';
  }
  const diffTime = Math.abs(milestoneDate - currentDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);

  const remainingMonths = diffMonths % 12;
  const remainingDays = diffDays % 30;

  let result = `${remainingDays} dias`;
  if (diffMonths > 0) {
    result = `${remainingMonths} meses e ` + result;
  }
  if (diffYears > 0) {
    result = `${diffYears} anos, ` + result;
  }

  return result;
}

export function getMonth(date) {
  return new Date(date)?.toLocaleString('pt-BR', { month: 'long' });
}

export function getYear(date) {
  return new Date(date).getFullYear()
}

export function getColorPrimary() {
  const root = document.documentElement
  const colorPrimary = getComputedStyle(root).getPropertyValue('--primary-color').trim()
  return colorPrimary
}

export function formatDate(date) {
  if (!date) return ""

  const dt = new Date(date)
  if (isNaN(dt)) return ""

  return dt.toLocaleDateString("pt-BR")
}