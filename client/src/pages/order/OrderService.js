import axClient from "../../configs/axios";

const DEFAULT_QUERY = "api/v1/orders";

class OrderService {
  
  getOrders = () => axClient.get(`${DEFAULT_QUERY}`);
  createOrder = order => axClient.post(`api/v1/o/orders`, order)
}

export default OrderService;