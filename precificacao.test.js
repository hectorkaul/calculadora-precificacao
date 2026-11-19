import { test } from 'node:test';
import assert from 'node:assert/strict';
import { custoTotal, taxasFixas, precoSugerido, precoMinimo, finalNoventa, resultado } from './precificacao.js';

const imposto = 0.06;

const camiseta = { sku: 'CAM-01', nome: 'Camiseta', custo: 22, embalagem: 1.5, freteEnvio: 0, custoFixo: 1.2, margem: 0.2 };
const garrafa = { sku: 'GAR-01', nome: 'Garrafa térmica', custo: 38, embalagem: 2.5, freteEnvio: 0, custoFixo: 1.2, margem: 0.2 };

const mlClassico = { nome: 'ML Clássico', comissao: 0.12, taxaFixaAbaixo: 6.5, limite: 79, taxaFixaAcima: 0, freteAcima: 22, antecipacao: 0 };
const mlPremium = { ...mlClassico, nome: 'ML Premium', comissao: 0.17 };
const shopee = { nome: 'Shopee', comissao: 0.2, taxaFixaAbaixo: 4, limite: 0, taxaFixaAcima: 4, freteAcima: 0, antecipacao: 0 };

const perto = (atual, esperado) => assert.ok(Math.abs(atual - esperado) < 0.01, `${atual} deveria ser ${esperado}`);

test('soma os custos do produto', () => {
  perto(custoTotal(camiseta), 24.7);
});

test('taxa fixa muda a partir do limite da faixa', () => {
  assert.equal(taxasFixas(78.9, mlClassico), 6.5);
  assert.equal(taxasFixas(79, mlClassico), 22);
});

test('preço sugerido na primeira faixa', () => {
  // (24,70 + 6,50) / (1 - 0,12 - 0,06 - 0,20)
  perto(precoSugerido(camiseta, mlClassico, imposto), 50.32);
});

test('quando passa do limite, usa a segunda faixa', () => {
  // Na faixa 1 daria R$ 84,56, acima de R$ 79. Então o frete entra na conta.
  perto(precoSugerido(garrafa, mlPremium, imposto), 111.75);
});

test('marketplace sem faixa usa só a taxa fixa', () => {
  perto(precoSugerido(camiseta, shopee, imposto), 53.15);
});

test('margem impossível devolve null', () => {
  const caro = { ...shopee, comissao: 0.5 };
  assert.equal(precoSugerido({ ...camiseta, margem: 0.5 }, caro, imposto), null);
});

test('preço mínimo é a conta com margem zero', () => {
  perto(precoMinimo(camiseta, mlClassico, imposto), 38.05);
});

test('arredonda para o próximo ,90', () => {
  assert.equal(finalNoventa(50.32), 50.9);
  assert.equal(finalNoventa(49.95), 50.9);
  assert.equal(finalNoventa(49.9), 49.9);
});

test('lucro e margem com o preço final', () => {
  const r = resultado(50.9, camiseta, mlClassico, imposto);
  perto(r.lucro, 10.54);
  perto(r.margem, 0.207);
});
