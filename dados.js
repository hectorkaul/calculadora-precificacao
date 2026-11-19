// Valores de EXEMPLO para a calculadora funcionar de primeira.
// Não são as taxas oficiais: cada vendedor troca pelas taxas da própria conta.
const TAXAS_EXEMPLO = [
  { nome: 'Mercado Livre Clássico', comissao: 0.12, taxaFixaAbaixo: 6.5, limite: 79, taxaFixaAcima: 0, freteAcima: 22, antecipacao: 0 },
  { nome: 'Mercado Livre Premium', comissao: 0.17, taxaFixaAbaixo: 6.5, limite: 79, taxaFixaAcima: 0, freteAcima: 22, antecipacao: 0 },
  { nome: 'Shopee', comissao: 0.2, taxaFixaAbaixo: 4, limite: 0, taxaFixaAcima: 4, freteAcima: 0, antecipacao: 0 },
  { nome: 'Amazon', comissao: 0.13, taxaFixaAbaixo: 5.5, limite: 79, taxaFixaAcima: 0, freteAcima: 18, antecipacao: 0 },
  { nome: 'Magalu', comissao: 0.16, taxaFixaAbaixo: 5, limite: 79, taxaFixaAcima: 0, freteAcima: 15, antecipacao: 0 },
];

const PRODUTOS_EXEMPLO = [
  { sku: 'CAM-01', nome: 'Camiseta básica de algodão', custo: 22, embalagem: 1.5, freteEnvio: 0, custoFixo: 1.2, margem: 0.2 },
  { sku: 'GAR-01', nome: 'Garrafa térmica 500 ml', custo: 38, embalagem: 2.5, freteEnvio: 0, custoFixo: 1.2, margem: 0.2 },
  { sku: 'FON-01', nome: 'Fone de ouvido bluetooth', custo: 55, embalagem: 2, freteEnvio: 0, custoFixo: 1.2, margem: 0.25 },
  { sku: 'CAP-01', nome: 'Capinha de celular', custo: 6, embalagem: 0.8, freteEnvio: 0, custoFixo: 1.2, margem: 0.3 },
  { sku: 'LUM-01', nome: 'Luminária LED de mesa', custo: 72, embalagem: 4, freteEnvio: 0, custoFixo: 1.2, margem: 0.2 },
];

const CONFIG_EXEMPLO = { imposto: 0.06, margemMinima: 0.1 };

const CHAVE = 'calculadora-precificacao:v1';

export function exemplo() {
  return structuredClone({ config: CONFIG_EXEMPLO, taxas: TAXAS_EXEMPLO, produtos: PRODUTOS_EXEMPLO });
}

// Os dados ficam só no navegador de quem usa (localStorage).
export function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo && salvo.config && Array.isArray(salvo.taxas) && Array.isArray(salvo.produtos)) return salvo;
  } catch {
    // navegador sem localStorage ou dado corrompido: começa pelo exemplo
  }
  return exemplo();
}

export function salvar(estado) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    // sem localStorage a calculadora continua funcionando, só não guarda
  }
}
