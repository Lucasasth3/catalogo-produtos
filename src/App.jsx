import { useEffect, useState } from 'react';
import Header from './Components/Header';
import ProductSearch from './Components/ProductSearch';
import ProductList from './Components/ProductList';
import { getProducts } from './services/productsApi';
import './App.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError('');

      try {
        const data = await getProducts({ signal: controller.signal });
        if (!Array.isArray(data)) {
          throw new Error('A API não retornou uma lista de produtos.');
        }
        setProducts(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.nome.toLocaleLowerCase('pt-BR').includes(
      search.toLocaleLowerCase('pt-BR')
    )
  );

  return (
    <main className="container">
      <Header />
      <ProductSearch value={search} onSearchChange={setSearch} />
      {loading && <p role="status">Carregando produtos...</p>}
      {error && <p role="alert" className="error">{error}</p>}
      {!loading && !error && (
        <>
          <p>{filteredProducts.length} produto(s) encontrado(s).</p>
          <ProductList products={filteredProducts} />
        </>
      )}
    </main>
  );
function closeDetails() {
  setSelectedId(null);
  setSelectedProduct(null);
  setDetailsError('');
  setDetailsLoading(false);
}
}