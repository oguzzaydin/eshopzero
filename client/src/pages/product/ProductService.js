import axClient from "../../configs/axios";

const DEFAULT_QUERY = "/api/v1/p/products";

class ProductService {
  
  getProducts = () => axClient.get(`${DEFAULT_QUERY}`);
  
}

export default ProductService;