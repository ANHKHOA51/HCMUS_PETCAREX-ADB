import ProductList from "../../features/product/components/ProductList";

const ProductPage = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Our Products
        </h1>
        <p className="text-gray-500 mt-2">Browse our high-quality veterinary products and medicines</p>
      </div>
      <ProductList />
    </div>
  );
};

export default ProductPage;
