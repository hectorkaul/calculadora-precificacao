const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const porcentagem = new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const brl = (valor) => (valor === null || !Number.isFinite(valor) ? '—' : moeda.format(valor));
export const pct = (valor) => (valor === null || !Number.isFinite(valor) ? '—' : porcentagem.format(valor));

// Aceita "12,5" ou "12.5". Campo vazio ou inválido vira 0.
export function numero(texto) {
  const n = parseFloat(String(texto).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}
