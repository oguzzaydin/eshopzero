import React, { useContext } from "react";
import { List, Typography, Button, message } from "antd";
import BasketItem from "./BasketItem";
import { BasketContext } from "./BasketContext";
import OrderService from "../order/OrderService";

const { Title } = Typography;

const orderService = new OrderService();

const Basket = () => {
  const { basket, count } = useContext(BasketContext);

  const createOrder = () => {
    orderService
      .createOrder({items:[...basket]})
      .then(() => message.success(`Sipariş başarıyla oluşturuldu.`))
      .catch((error) => message.error(error.title));
  };

  return (
    <>
      <Title level={2}>Basket {count > 0 && `(${count})`} </Title>
       

      <List
        itemLayout="horizontal"
        dataSource={basket}
        renderItem={(item) => <BasketItem item={item} />}
      />
      <br />
      <br />

      {count > 0 && <Button type="primary" onClick={createOrder}>Sepeti Onayla</Button>}
    </>
  );
};

export default Basket;
