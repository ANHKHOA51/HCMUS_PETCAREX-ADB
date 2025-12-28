import ProductList from "../../features/product/components/ProductList";

const ProductPage = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Sản phẩm của chúng tôi
        </h1>
        <p className="text-gray-500 mt-2">Duyệt qua các sản phẩm thú y và thuốc chất lượng cao của chúng tôi</p>
      </div>
      <ProductList />
    </div>
  );
};

export default ProductPage;
