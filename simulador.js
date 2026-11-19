import { precoSugerido, precoMinimo, finalNoventa, resultado } from './precificacao.js';
import { brl, pct, numero } from './formato.js';

const COLUNAS = ['Marketplace', 'Preço sugerido', 'Preço final ,90', 'Faixa', 'Lucro', 'Margem',
  'Preço mínimo', 'Seu preço', 'Lucro com seu preço', 'Margem com seu preço'];

function preencherProdutos(seletor, produtos) {
  const escolhido = seletor.value;
  seletor.replaceChildren(...produtos.map((p, i) => new Option(p.sku ? `${p.sku} · ${p.nome}` : p.nome, String(i))));
  if (escolhido !== '' && Number(escolhido) < produtos.length) seletor.value = escolhido;
}

function descreverFaixa(preco, taxa) {
  if (!(taxa.limite > 0)) return 'única';
  return preco >= taxa.limite ? `a partir de ${brl(taxa.limite)}` : `abaixo de ${brl(taxa.limite)}`;
}

export function desenharSimulador(container, seletor, estado) {
  preencherProdutos(seletor, estado.produtos);
  const produto = estado.produtos[Number(seletor.value)];
  container.replaceChildren();
  if (!produto) {
    container.textContent = 'Cadastre um produto para simular.';
    return;
  }

  const { imposto, margemMinima } = estado.config;
  const tabela = document.createElement('table');
  tabela.className = 'resultado';
  const cabecalho = tabela.createTHead().insertRow();
  for (const titulo of COLUNAS) {
    const th = document.createElement('th');
    th.textContent = titulo;
    cabecalho.appendChild(th);
  }

  const corpo = tabela.createTBody();
  for (const taxa of estado.taxas) {
    const tr = corpo.insertRow();
    tr.insertCell().textContent = taxa.nome;

    const sugerido = precoSugerido(produto, taxa, imposto);
    if (sugerido === null) {
      const td = tr.insertCell();
      td.colSpan = COLUNAS.length - 1;
      td.className = 'alerta';
      td.textContent = 'Margem impossível: comissão, imposto e margem somam 100% ou mais.';
      continue;
    }

    const final = finalNoventa(sugerido);
    const r = resultado(final, produto, taxa, imposto);
    const valores = [brl(sugerido), brl(final), descreverFaixa(final, taxa), brl(r.lucro), pct(r.margem),
      brl(precoMinimo(produto, taxa, imposto))];
    valores.forEach((texto, k) => {
      const td = tr.insertCell();
      td.textContent = texto;
      if (k === 1) td.className = 'destaque';
    });

    // "Seu preço": testa um valor e mostra quanto sobra.
    const campo = document.createElement('input');
    campo.type = 'number';
    campo.step = '0.01';
    campo.min = '0';
    campo.inputMode = 'decimal';
    campo.placeholder = final.toFixed(2).replace('.', ',');
    campo.setAttribute('aria-label', `Seu preço no ${taxa.nome}`);
    tr.insertCell().appendChild(campo);
    const tdLucro = tr.insertCell();
    const tdMargem = tr.insertCell();

    campo.addEventListener('input', () => {
      const preco = numero(campo.value);
      if (preco <= 0) {
        tdLucro.textContent = '';
        tdMargem.textContent = '';
        tdMargem.className = '';
        return;
      }
      const teste = resultado(preco, produto, taxa, imposto);
      tdLucro.textContent = brl(teste.lucro);
      tdMargem.textContent = pct(teste.margem);
      tdMargem.className = teste.margem < margemMinima ? 'alerta' : 'ok';
    });
  }
  container.appendChild(tabela);
}
