import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Typography } from "antd";
import ProductItem from "./ProductItem";
import styled from "styled-components";
import ProductService from "./ProductService";

const { Title } = Typography;
const productService = new ProductService();

function Product() {
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setReady(true);
    const res = await productService.getProducts();
    setProducts(res.data);
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
    <ProductContainer>
      <Title level={2}>Products</Title>
      <Row>
        {products.map((product) => (
          <Col key={product.id} span={4} style={{ marginTop: "30px" }}>
            <ProductItem
              key={product.id}
              product={product}
            />
          </Col>
        ))}
      </Row>
    </ProductContainer>
  );
}

export default Product;

const ProductContainer = styled.div`
  margin-top: 30px;
`;
