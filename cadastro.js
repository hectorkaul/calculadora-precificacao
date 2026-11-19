import { numero } from './formato.js';

// [chave, título da coluna, tipo]. Tipo 'pct' aparece em % na tela e é guardado como fração.
export const CAMPOS_TAXA = [
  ['nome', 'Marketplace', 'texto'],
  ['comissao', 'Comissão (%)', 'pct'],
  ['taxaFixaAbaixo', 'Taxa fixa abaixo do limite (R$)', 'num'],
  ['limite', 'Limite da faixa (R$)', 'num'],
  ['taxaFixaAcima', 'Taxa fixa a partir do limite (R$)', 'num'],
  ['freteAcima', 'Frete pago por você a partir do limite (R$)', 'num'],
  ['antecipacao', 'Antecipação (%)', 'pct'],
];

export const CAMPOS_PRODUTO = [
  ['sku', 'SKU', 'texto'],
  ['nome', 'Produto', 'texto'],
  ['custo', 'Custo (R$)', 'num'],
  ['embalagem', 'Embalagem (R$)', 'num'],
  ['freteEnvio', 'Frete até o envio (R$)', 'num'],
  ['custoFixo', 'Custos fixos por venda (R$)', 'num'],
  ['margem', 'Margem desejada (%)', 'pct'],
];

export const NOVA_TAXA = () => ({ nome: 'Novo marketplace', comissao: 0, taxaFixaAbaixo: 0, limite: 0, taxaFixaAcima: 0, freteAcima: 0, antecipacao: 0 });
export const NOVO_PRODUTO = () => ({ sku: '', nome: 'Novo produto', custo: 0, embalagem: 0, freteEnvio: 0, custoFixo: 0, margem: 0.2 });

function paraTela(valor, tipo) {
  return tipo === 'pct' ? +(valor * 100).toFixed(2) : valor;
}

function daTela(texto, tipo) {
  if (tipo === 'texto') return texto.trim();
  const n = numero(texto);
  return tipo === 'pct' ? n / 100 : n;
}

// Desenha uma tabela em que cada célula é um campo editável.
// aoMudar(true) pede para redesenhar tudo (linha incluída ou removida).
export function tabelaEditavel(container, linhas, campos, aoMudar, novaLinha) {
  container.replaceChildren();
  const tabela = document.createElement('table');
  const cabecalho = tabela.createTHead().insertRow();
  for (const [, titulo] of campos) {
    const th = document.createElement('th');
    th.textContent = titulo;
    cabecalho.appendChild(th);
  }
  cabecalho.appendChild(document.createElement('th'));

  const corpo = tabela.createTBody();
  linhas.forEach((linha, i) => {
    const tr = corpo.insertRow();
    for (const [chave, titulo, tipo] of campos) {
      const input = document.createElement('input');
      input.type = tipo === 'texto' ? 'text' : 'number';
      if (tipo !== 'texto') {
        input.step = 'any';
        input.min = '0';
        input.inputMode = 'decimal';
      }
      input.value = paraTela(linha[chave], tipo);
      input.setAttribute('aria-label', `${titulo}, linha ${i + 1}`);
      input.addEventListener('change', () => {
        linha[chave] = daTela(input.value, tipo);
        aoMudar(false);
      });
      tr.insertCell().appendChild(input);
    }
    const remover = document.createElement('button');
    remover.type = 'button';
    remover.className = 'remover';
    remover.textContent = 'Remover';
    remover.addEventListener('click', () => {
      linhas.splice(i, 1);
      aoMudar(true);
    });
    tr.insertCell().appendChild(remover);
  });
  container.appendChild(tabela);

  const incluir = document.createElement('button');
  incluir.type = 'button';
  incluir.className = 'secundario';
  incluir.textContent = novaLinha.rotulo;
  incluir.addEventListener('click', () => {
    linhas.push(novaLinha.criar());
    aoMudar(true);
  });
  container.appendChild(incluir);
}
