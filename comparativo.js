import { precoSugerido } from './precificacao.js';
import { brl } from './formato.js';

// Para cada produto: o preço sugerido em cada marketplace e o canal mais barato.
export function montarComparativo(estado) {
  const { imposto } = estado.config;
  return estado.produtos.map((produto) => {
    const precos = estado.taxas.map((taxa) => precoSugerido(produto, taxa, imposto));
    const validos = precos.filter((p) => p !== null);
    const menor = validos.length ? Math.min(...validos) : null;
    const melhor = menor === null ? '' : estado.taxas[precos.indexOf(menor)].nome;
    return { produto, precos, menor, melhor };
  });
}

export function desenharComparativo(container, estado) {
  container.replaceChildren();
  const tabela = document.createElement('table');
  tabela.className = 'resultado';
  const cabecalho = tabela.createTHead().insertRow();
  for (const titulo of ['Produto', ...estado.taxas.map((t) => t.nome), 'Melhor canal']) {
    const th = document.createElement('th');
    th.textContent = titulo;
    cabecalho.appendChild(th);
  }
  const corpo = tabela.createTBody();
  for (const linha of montarComparativo(estado)) {
    const tr = corpo.insertRow();
    tr.insertCell().textContent = linha.produto.nome;
    for (const preco of linha.precos) {
      const td = tr.insertCell();
      td.textContent = brl(preco);
      if (preco !== null && preco === linha.menor) td.className = 'melhor';
    }
    tr.insertCell().textContent = linha.melhor;
  }
  container.appendChild(tabela);
}

// CSV com ponto e vírgula e vírgula decimal, para abrir direto no Excel em português.
export function comparativoCsv(estado) {
  const aspas = (texto) => `"${String(texto).replace(/"/g, '""')}"`;
  const valor = (n) => (n === null ? '' : n.toFixed(2).replace('.', ','));
  const cabecalho = ['SKU', 'Produto', ...estado.taxas.map((t) => t.nome), 'Menor preço', 'Melhor canal'];
  const linhas = montarComparativo(estado).map((l) =>
    [l.produto.sku, l.produto.nome, ...l.precos.map(valor), valor(l.menor), l.melhor].map(aspas).join(';'));
  return [cabecalho.map(aspas).join(';'), ...linhas].join('\r\n');
}
