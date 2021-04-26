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
import Product from "./pages/product/Product";
import Login from "./pages/account/Login";
import ProductList from "./pages/product/ProductList";



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/signin-callback" component={Callback} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/logout/callback" component={LogoutCallback}/>
          <Route exact path="/:lng(en|es|de|fr|pt|it)/register/:form?" component={Register} />
          <Route exact path="/silentrenew" component={SilentRenew} />
          <PrivateRoute path="/products" component={Product} />
          <PrivateRoute path="/" component={ProductList} />

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
