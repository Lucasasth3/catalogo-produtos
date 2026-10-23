import assert from 'node:assert/strict';
import test from 'node:test';
import { getProducts, getProductById } from './productsApi.js';

test('lista produtos da API MongoDB e preserva campos ausentes como opcionais', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.equal(url, '/api/produtos');
    return new Response(JSON.stringify([{ id: 'abc', nome: 'Mouse', preco: 89.9 }]), { status: 200 });
  };
  try {
    assert.deepEqual(await getProducts(), [{ id: 'abc', nome: 'Mouse', preco: 89.9 }]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('consulta detalhes pelo ID e informa erros HTTP', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.equal(url, '/api/produtos/abc%20def');
    return new Response(null, { status: 404 });
  };
  try {
    await assert.rejects(getProductById('abc def'), /Erro HTTP 404/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
