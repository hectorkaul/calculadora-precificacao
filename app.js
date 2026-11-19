import { carregar, salvar, exemplo } from './dados.js';
import { tabelaEditavel, CAMPOS_TAXA, CAMPOS_PRODUTO, NOVA_TAXA, NOVO_PRODUTO } from './cadastro.js';
import { desenharSimulador } from './simulador.js';
import { numero } from './formato.js';

let estado = carregar();
const $ = (id) => document.getElementById(id);

function desenharTudo() {
  $('imposto').value = +(estado.config.imposto * 100).toFixed(2);
  $('margem-minima').value = +(estado.config.margemMinima * 100).toFixed(2);
  tabelaEditavel($('taxas'), estado.taxas, CAMPOS_TAXA, mudou, { rotulo: '+ Marketplace', criar: NOVA_TAXA });
  tabelaEditavel($('produtos'), estado.produtos, CAMPOS_PRODUTO, mudou, { rotulo: '+ Produto', criar: NOVO_PRODUTO });
  desenharResultados();
}

function desenharResultados() {
  desenharSimulador($('simulador'), $('produto'), estado);
}

function mudou(redesenharTudo) {
  salvar(estado);
  if (redesenharTudo) desenharTudo();
  else desenharResultados();
}

$('produto').addEventListener('change', () => desenharSimulador($('simulador'), $('produto'), estado));

for (const [id, chave] of [['imposto', 'imposto'], ['margem-minima', 'margemMinima']]) {
  $(id).addEventListener('change', (e) => {
    estado.config[chave] = numero(e.target.value) / 100;
    mudou(false);
  });
}

$('restaurar').addEventListener('click', () => {
  if (confirm('Voltar para os valores de exemplo? As suas taxas e os seus produtos serão apagados.')) {
    estado = exemplo();
    mudou(true);
  }
});

desenharTudo();
