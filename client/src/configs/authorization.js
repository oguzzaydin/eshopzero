import { getOrigin } from './origins';

const EShopZeroIdConfig = {
  authoryUrl: 'http://localhost:5201',
  clientId: 'client',
  redirectUrl: `${getOrigin()}`,
  postRedirectUrl: `http://localhost:4000`,
  responseType:'id_token token',
  scope: 'openid profile gateway order product'
};

export default EShopZeroIdConfig;
