import * as React from "react";
import { AuthConsumer } from "./AuthProvider";

export const Callback = () => (
  <AuthConsumer>
    {({ signinRedirectCallback }) => {
      signinRedirectCallback();
      return <span>loading</span>;
    }}
  </AuthConsumer>
);
