import React from "react";
import { List, Avatar } from "antd";

function BasketItem({item}) {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        }
        title={<a href="https://ant.design">{item.title}</a>}
        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
      />
    </List.Item>
  );
}

export default BasketItem;
