import React, { useContext } from "react";
import styled from "styled-components";
import {
  Layout,
  Typography,
  Row,
  Col,
  Badge,
  Avatar,
  Button,
  Dropdown,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BasketContext } from "../basket/BasketContext";
import ProfileMenu from "./ProfileMenu";

const { Title, Text } = Typography;
const { Header, Content, Footer } = Layout;

function BaseLayout({ children }) {
  const { count } = useContext(BasketContext);

  const user = JSON.parse(localStorage.getItem("user"));

  console.log(count);
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
                <Badge count={count}>
                  <Link to="/basket">
                    <ShoppingCartOutlined style={{ fontSize: "35px" }} />
                  </Link>
                </Badge>
              </Col>
              <Col span={18}>
                <Avatar size={40} icon={<UserOutlined />} />

                <ProfileDropdown
                  overlay={ProfileMenu({
                    // onSettingClick: settings,
                    // onLogoutClick: logout,
                  })}
                  trigger={["click"]}
                >
                  <Button style={{ color: "black" }}>
                    {user && user.profile.name} <DownOutlined />
                  </Button>
                </ProfileDropdown>
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <ContentWrapper>{children}</ContentWrapper>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        eShopZero @2021 Created by Oğuzhan Aydın
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

const ProfileDropdown = styled(Dropdown)`
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  color: gray;
  &:hover,
  &:focus,
  &:active {
    color: unset;
  }
  margin-right: 20px;
  text-transform: capitalize;
`;
