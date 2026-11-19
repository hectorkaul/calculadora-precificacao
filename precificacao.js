// Regras de precificação: preço de venda em cada marketplace a partir dos custos.
// Percentuais são guardados como fração (0.12 = 12%).

export function custoTotal(produto) {
  return produto.custo + produto.embalagem + produto.freteEnvio + produto.custoFixo;
}

// Comissão, antecipação e imposto incidem sobre o preço de venda.
function percentualSobrePreco(taxa, imposto) {
  return taxa.comissao + taxa.antecipacao + imposto;
}

// Taxas fixas e frete que o vendedor paga em uma venda com esse preço.
export function taxasFixas(preco, taxa) {
  if (taxa.limite > 0 && preco >= taxa.limite) {
    return taxa.taxaFixaAcima + taxa.freteAcima;
  }
  return taxa.taxaFixaAbaixo;
}

// Preço que garante a margem pedida:
//   preço = (custos + taxas fixas) / (1 - comissão - antecipação - imposto - margem)
// Quando o marketplace muda a regra a partir de um preço (ex.: frete por conta
// do vendedor acima de R$ 79), a taxa depende do preço e o preço depende da taxa.
// Por isso calculo nas duas faixas e fico com a que fecha a conta.
// Retorna null quando a margem é impossível (os percentuais passam de 100%).
export function precoSugerido(produto, taxa, imposto, margem = produto.margem) {
  const divisor = 1 - percentualSobrePreco(taxa, imposto) - margem;
  if (divisor <= 0) return null;

  const custo = custoTotal(produto);
  const precoFaixa1 = (custo + taxa.taxaFixaAbaixo) / divisor;
  if (!(taxa.limite > 0) || precoFaixa1 < taxa.limite) return precoFaixa1;

  const precoFaixa2 = (custo + taxa.taxaFixaAcima + taxa.freteAcima) / divisor;
  return Math.max(precoFaixa2, taxa.limite);
}

// Preço mínimo para não ter prejuízo: a mesma conta com margem zero.
export function precoMinimo(produto, taxa, imposto) {
  return precoSugerido(produto, taxa, imposto, 0);
}

// Arredonda para cima até o próximo preço terminado em ,90.
export function finalNoventa(preco) {
  const inteiro = Math.ceil(preco);
  const candidato = inteiro - 0.1;
  return candidato >= preco - 1e-9 ? centavos(candidato) : centavos(inteiro + 0.9);
}

// Quanto sobra de uma venda com esse preço.
export function resultado(preco, produto, taxa, imposto) {
  const descontos = preco * percentualSobrePreco(taxa, imposto);
  const fixas = taxasFixas(preco, taxa);
  const lucro = preco - descontos - fixas - custoTotal(produto);
  return {
    preco,
    descontos: centavos(descontos),
    fixas,
    lucro: centavos(lucro),
    margem: preco > 0 ? lucro / preco : 0,
  };
}

function centavos(valor) {
  return Math.round(valor * 100) / 100;
}
