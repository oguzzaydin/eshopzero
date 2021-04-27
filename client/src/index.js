import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./pages/account/AuthProvider";

import { Callback } from "./pages/account/Callback";
import { Logout } from "./pages/account/Logout";
import { LogoutCallback } from "./pages/account/LogoutCallback";
import { SilentRenew } from "./pages/account/SilentRenew";
import { Register } from "./pages/account/Register";
import { PrivateRoute } from "./PrivateRoute";
import Product from "./pages/product/ProductItem";
import ProductList from "./pages/product/ProductList";
import BaseLayout from "./pages/base/Layout";
import "antd/dist/antd.css"
import Basket from "./pages/basket/Basket";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
            <Route exact path="/signin-callback" component={Callback} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/logout/callback" component={LogoutCallback} />
            <Route exact path="/silentrenew" component={SilentRenew} />
          <BaseLayout>
            <PrivateRoute exact path="/" component={ProductList} />
            <PrivateRoute exact path="/basket" component={Basket} />
          </BaseLayout>
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
