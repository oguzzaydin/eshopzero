import axClient from "../../configs/axios";

const DEFAULT_QUERY = "api/v1/orders";

class OrderService {
  
  getOrders = () => axClient.get(`${DEFAULT_QUERY}`);
  createOrder = order => axClient.post(`${DEFAULT_QUERY}`, order)
}

export default OrderService;