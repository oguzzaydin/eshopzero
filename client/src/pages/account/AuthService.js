/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
import { Log, UserManager } from 'oidc-client';
import EShopZeroIdConfig from "../../configs/authorization";

class AuthService {
  constructor() {
    const settings = {
      authority: EShopZeroIdConfig.authoryUrl,
      client_id: EShopZeroIdConfig.clientId,
      redirect_uri: `${EShopZeroIdConfig.redirectUrl}/signin-callback`,
      silent_redirect_uri: `${EShopZeroIdConfig.redirectUrl}/silent-renew`,
      post_logout_redirect_uri: `${EShopZeroIdConfig.postRedirectUrl}`,
      response_type: EShopZeroIdConfig.responseType,
      scope: EShopZeroIdConfig.scope,
    };

    this.userManager = new UserManager(settings);
    Log.logger = console;
    Log.level = Log.INFO;
  }

  sub() {
    const token = JSON.parse(localStorage.getItem("user"));
    return token && jwt_decode(token.access_token).sub;
  }
  getToken(type = "Bearer") {
    const token = JSON.parse(localStorage.getItem("user"));
    return token && `${type} ${token.access_token}`;
  }
  login() {
    return this.userManager.signinRedirect();
  }

  getUser() {
    return this.userManager.getUser();
  }
  redirectLogin() {
    if (window.location.pathname !== "/login") window.location.href = "/login";
  }

  renewToken() {
    return this.userManager.signinSilent();
  }

  logout() {
    this.userManager.signoutRedirect().then(() => {
      localStorage.clear();
      this.userManager.clearStaleState();
    });
  }

  signinRedirectCallback = () => {
    return this.userManager
      .signinRedirectCallback()
      .then((user) => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        window.location = "/"
      })
      .catch(function (e) {
        console.error(e);
      });
  };

  getUser = async () => {
    const user = await this.userManager.getUser();
    if (!user) {
      return await this.userManager.signinRedirectCallback();
    }
    return user;
  };

  parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  };

  signinRedirect = () => {
    localStorage.setItem("redirectUri", window.location.pathname);
    this.userManager.signinRedirect();
  };


  isAuthenticated = () => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    return !!user && !!user.access_token;
  };

  signinSilent = () => {
    this.userManager
      .signinSilent()
      .then((user) => {
        console.log("signed in", user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  signinSilentCallback = () => {
    this.userManager.signinSilentCallback();
  };

  createSigninRequest = () => {
    return this.userManager.createSigninRequest();
  };

  signoutRedirectCallback = () => {
    this.userManager.signoutRedirectCallback().then(() => {
      localStorage.clear();
      window.location.replace(process.env.REACT_APP_PUBLIC_URL);
    });
    this.userManager.clearStaleState();
  };
}
export default AuthService;
