import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./pages/account/AuthProvider";
import { Callback } from "./pages/account/Callback";
import { Logout } from "./pages/account/Logout";
import { LogoutCallback } from "./pages/account/LogoutCallback";
import { SilentRenew } from "./pages/account/SilentRenew";
import { PrivateRoute } from "./PrivateRoute";
import Product from "./pages/product/Product";
import BaseLayout from "./pages/base/Layout";
import Basket from "./pages/basket/Basket";
import { BasketProvider } from "./pages/basket/BasketContext";
import Order from "./pages/order/Order";

import "antd/dist/antd.css";

function App() {
  return (
    <AuthProvider>
      <BasketProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path="/signin-callback" component={Callback} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/logout/callback" component={LogoutCallback} />
            <Route exact path="/silentrenew" component={SilentRenew} />
            <BaseLayout>
              <PrivateRoute exact path="/" component={Product} />
              <PrivateRoute exact path="/basket" component={Basket} />
              <PrivateRoute exact path="/order" component={Order} />
            </BaseLayout>
          </Switch>
        </BrowserRouter>
      </BasketProvider>
    </AuthProvider>
  );
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
