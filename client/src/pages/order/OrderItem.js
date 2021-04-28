import React from "react";
import { List, Avatar } from "antd";

function OrderItem({item}) {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={item.product.pictureUrl} />}
        title={<a href="https://ant.design">{item.product.name}</a>}
        description={item.product.description}
      />
      <div>
        
      </div>
    </List.Item>
  );
}

export default OrderItem;
