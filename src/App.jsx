import { useEffect, useState } from 'react';
import Header from './Components/Header';
import ProductSearch from './Components/ProductSearch';
import ProductList from './Components/ProductList';
import ProductDetails from './Components/ProductDetails';
import { getProducts, getProductById } from './services/productsApi';
import './App.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError('');
      try {
        setProducts(await getProducts({ signal: controller.signal }));
      } catch (err) {
        if (!controller.signal.aborted) setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (selectedId === null) return;
    const controller = new AbortController();

    async function loadDetails() {
      setDetailsLoading(true);
      setDetailsError('');
      setSelectedProduct(null);
      try {
        setSelectedProduct(await getProductById(selectedId, { signal: controller.signal }));
      } catch (err) {
        if (!controller.signal.aborted) setDetailsError(err.message);
      } finally {
        if (!controller.signal.aborted) setDetailsLoading(false);
      }
    }

    loadDetails();
    return () => controller.abort();
  }, [selectedId]);

  function viewDetails(id) {
    setSelectedProduct(null);
    setDetailsError('');
    setDetailsLoading(true);
    setSelectedId(id);
  }

  function closeDetails() {
    setSelectedId(null);
    setSelectedProduct(null);
    setDetailsError('');
    setDetailsLoading(false);
  }

  const filteredProducts = products.filter((product) =>
    product.nome.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))
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
          <ProductList products={filteredProducts} onViewDetails={viewDetails} />
        </>
      )}
      {selectedId !== null && (
        <ProductDetails
          product={selectedProduct}
          loading={detailsLoading}
          error={detailsError}
          onClose={closeDetails}
        />
      )}
    </main>
  );
}
