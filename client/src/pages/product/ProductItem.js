import React, { useContext, useState } from "react";
import { Card, Button, Typography, Image, message } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { BasketContext } from "../basket/BasketContext";

const { Meta } = Card;
const { Text } = Typography;

const ProductItem = ({ product }) => {
  const [quantity, setQuantity] = useState(0);
  const { basket, updateBasket } = useContext(BasketContext);

  const increment = () => {
    if (quantity >= product.availableStock) {
      message.info("Stok bulunmamaktadır.");
      return;
    }
    setQuantity((prev) => ++prev);
  };

  const discrement = () => {
    if (quantity === 0) {
      return;
    }
    setQuantity((prev) => --prev);
  };

  const addBasket = (product) => {
    if (basket.some((item) => item.productId == product.id)) {
      message.warning(`${product.name} zaten sepete eklendi.`);
      return;
    }
    const newItem = {
      product: product,
      productId: product.id,
      quantity: quantity === 0 ? 1 : quantity,
    };
    let newBasket = [...basket, newItem];
    updateBasket(newBasket);
    message.success(`${product.name} sepete başarıyla eklendi`);
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
      <Button
        style={{ marginTop: "11px" }}
        block
        onClick={() => addBasket(product)}
      >
        Sepete Ekle
      </Button>
    </Card>
  );
};

export default ProductItem;
