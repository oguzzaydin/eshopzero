import React from "react";
import { List, Typography, Button } from "antd";
import BasketItem from "./BasketItem";

const { Title } = Typography;

const Basket = () => {
  return (
    <>
      <Title level={2}>Basket ({12})</Title>

      <List
        itemLayout="horizontal"
        dataSource={[{ title: "test" }, { title: "test" }, { title: "test" }]}
        renderItem={(item) => <BasketItem item={item} />}
      />

      <Button type="primary">Sepeti Onayla</Button>
    </>
  );
};

export default Basket;
