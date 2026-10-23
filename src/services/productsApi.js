const API_URL = (import.meta.env?.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(path, { signal } = {}) {
  const response = await fetch(`${API_URL}${path}`, { signal });

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status} ao consultar a API.`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error('A API retornou uma resposta JSON inválida.');
  }
}

function validateProduct(product) {
  if (!product || product.id == null || typeof product.nome !== 'string' ||
      typeof product.preco !== 'number' || !Number.isFinite(product.preco)) {
    throw new Error('A API retornou um produto com dados inválidos.');
  }
  return product;
}

export async function getProducts({ signal } = {}) {
  const products = await request('/produtos', { signal });
  if (!Array.isArray(products)) {
    throw new Error('A API não retornou uma lista de produtos.');
  }
  return products.map(validateProduct);
}

export async function getProductById(id, { signal } = {}) {
  return validateProduct(await request(`/produtos/${encodeURIComponent(id)}`, { signal }));
}
