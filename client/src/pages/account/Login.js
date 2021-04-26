import React from "react";
import AuthService from "./AuthService";
import { useState } from "react";

const Login = () => {
  const [ready, setReady] = useState(true);
  const login = () => {
    setReady(false)
     new AuthService().login();
  }
  return <button type="submit"  onClick={login} disabled={!ready}> {ready ? "Oturum Aç": "Lütfen bekleyin ..."}</button>;
};

export default Login;
