import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Typography } from "antd";
import styled from "styled-components";

import OrderService from "./OrderService";
import OrderItem from "./OrderItem";

const { Title } = Typography;
const orderService = new OrderService();

function Order() {
  const [orders, setOrders] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    setReady(true);
    const res = await orderService.getOrders();
    setOrders(res.data);
    setReady(false);
  };

  return ready ? (
    <Spin
      size="large"
      style={{
        position: "absolute",
        bottom: "50%",
        left: "50%",
        zIndex: "9999999",
      }}
    />
  ) : (
    <>
      <Title level={2}>My Orders</Title>
      {orders.map((order) => (
        <>
          <Row>
            <Title level={3}>
              #{order.id} - {order.mailAddress}
            </Title>
          </Row>
          {order.orderItems.map((item) => (
            <OrderContainer>
              <OrderItem item={item} />
            </OrderContainer>
          ))}

          <br />
          <br />
          <br />
        </>
      ))}
    </>
  );
}

export default Order;

const OrderContainer = styled.div`
  border: 1px solid rgb(240 242 245);
  padding: 5px;
  margin-bottom: 10px;
`;
