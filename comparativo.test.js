import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarComparativo, comparativoCsv } from './comparativo.js';
import { exemplo } from './dados.js';

test('aponta o marketplace com o menor preço', () => {
  const linhas = montarComparativo(exemplo());
  const camiseta = linhas.find((l) => l.produto.sku === 'CAM-01');
  assert.equal(camiseta.melhor, 'Amazon');
  assert.ok(Math.abs(camiseta.menor - 49.51) < 0.01);
});

test('produto com margem impossível fica sem canal', () => {
  const estado = exemplo();
  estado.produtos = [{ sku: 'X', nome: 'Teste', custo: 10, embalagem: 0, freteEnvio: 0, custoFixo: 0, margem: 0.9 }];
  const [linha] = montarComparativo(estado);
  assert.equal(linha.menor, null);
  assert.equal(linha.melhor, '');
});

test('CSV usa ponto e vírgula e vírgula decimal', () => {
  const csv = comparativoCsv(exemplo());
  const [cabecalho, primeira] = csv.split('\r\n');
  assert.ok(cabecalho.startsWith('"SKU";"Produto";"Mercado Livre Clássico"'));
  assert.ok(primeira.includes('"50,32"'));
  assert.ok(primeira.endsWith('"Amazon"'));
});
