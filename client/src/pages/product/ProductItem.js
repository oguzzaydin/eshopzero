import React, { useState } from "react";
import { Card, Button, Typography, Image } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Text } = Typography;

const ProductItem = ({ product }) => {
  let [quantity, setQuantity] = useState(0);

  const increment = () => {
    if (quantity >= product.availableStock) return;
    quantity++;
    setQuantity(quantity);
  };

  const discrement = () => {
    if (quantity === 0) return;
    quantity--;
    setQuantity(quantity);
  };

  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={<Image height={300} alt="example" src={product.pictureUrl} />}
    >
      <Meta title={product.name} description={product.description} />
      <br />
      <Text type="secondary">{product.price} TRY</Text> <br />
      <Text type="secondary">{product.availableStock} adet mevcut var. </Text>
      <br />
      <br />
      <PlusOutlined
        onClick={increment}
        style={{ fontSize: "20px", marginRight: "10px" }}
      />
      <Text type="primary" strong>
        {quantity}
      </Text>
      <MinusOutlined
        onClick={discrement}
        style={{ fontSize: "20px", marginLeft: "10px" }}
      />
      <br />
      <Button style={{ marginTop: "11px" }} block>
        Sepete Ekle
      </Button>
    </Card>
  );
};

export default ProductItem;
