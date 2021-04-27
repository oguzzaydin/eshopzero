import React from "react";
import styled from "styled-components";
import { Layout, Typography, Row, Col, Badge, Avatar } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { Header, Content, Footer } = Layout;

function BaseLayout({ children, history }) {
  const user = JSON.parse(localStorage.getItem("user"));

  console.log(history);
  return (
    <Layout className="layout">
      <Header style={{ background: "#fff" }}>
        <Row>
          <Col span={8}>
            <Link to="/">
              <Typography>
                <Title level={1}>eShopZero</Title>
              </Typography>
            </Link>
          </Col>
          <Col span={4} offset={12}>
            <Row>
              <Col span={6} style={{ marginTop: "10px" }}>
                <Badge count={5}>
                  <Link to="/basket">
                    <ShoppingCartOutlined style={{ fontSize: "35px" }} />
                  </Link>
                </Badge>
              </Col>
              <Col span={18}>
                <Avatar size={40} icon={<UserOutlined />} />
                <Text style={{ marginLeft: "5px" }}>
                  {user && user.profile.name}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <ContentWrapper>{children}</ContentWrapper>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        eShopZero 2021 Created by Oğuzhan Aydın
      </Footer>
    </Layout>
  );
}

export default BaseLayout;

const ContentWrapper = styled.div`
  min-height: 280px;
  padding: 24px;
  margin: 20px 20px 24px 50px;
  background: #fff;
`;

// .site-layout-content {
//     min-height: 280px;
//     padding: 24px;
//     background: #fff;
//   }
//   #components-layout-demo-top .logo {
//     float: left;
//     width: 120px;
//     height: 31px;
//     margin: 16px 24px 16px 0;
//     background: rgba(255, 255, 255, 0.3);
//   }
//   .ant-row-rtl #components-layout-demo-top .logo {
//     float: right;
//     margin: 16px 0 16px 24px;
//   }
