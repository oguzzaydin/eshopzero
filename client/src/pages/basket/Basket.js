import React, { useContext, useEffect, useState } from "react";
import { List, Typography, Button, message, Result } from "antd";
import BasketItem from "./BasketItem";
import { BasketContext } from "./BasketContext";
import OrderService from "../order/OrderService";
import { createSocketConnection } from "../../configs/web-socket";

const { Title } = Typography;

const orderService = new OrderService();

const Basket = ({history}) => {
  const connection = createSocketConnection();
  const [ready, setReady] = useState(true);
  const [error, setError] = useState(null);
  const { basket, count, updateBasket, resetCount } = useContext(BasketContext);

  useEffect(() => {
    connection.start().then(() => console.log("connected"));
    connection.on("ProductStockChanged", (result) => {
      console.log(result);
      setReady(true);
      message.success(`Sipariş başarıyla oluşturuldu.`);
      updateBasket([]);
      resetCount();

      connection.on("ProductStockChangedError", (error) => {
        setReady(true);
        message.error(error);
        setError(error);
        updateBasket([]);
        resetCount();
      });
    });
  }, []);

  const createOrder = () => {
    orderService
      .createOrder({ items: [...basket] })
      .then(() => setReady(false))
      .catch((error) => message.error(error.title));
  };

  return !ready ? (
    <Result
      status="success"
      title="Successfully Purchased Cloud Server ECS!"
      subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
      extra={[
        <Button type="primary" key="console" onClick={() => history.push("/")}>
          Go Products
        </Button>
      ]}
    />
  ) : (
    <>
      <Title level={2}>Basket {count > 0 && `(${count})`} </Title>

      <List
        itemLayout="horizontal"
        dataSource={basket}
        renderItem={(item) => <BasketItem item={item} />}
      />
      <br />
      <br />

      {count > 0 && (
        <Button type="primary" onClick={createOrder}>
          Sepeti Onayla
        </Button>
      )}
    </>
  );
};

export default Basket;
