const URL = require('url');
const axios = require('axios');
const qs = require('querystring');
const get = require('lodash.get');
const getCredentials = require('./find-credentials');

module.exports.setBody = (ctx, bodyObject) => {
  const oldBody = ctx.request.getBody();
  ctx.request.setBody({
    ...oldBody,
    text: JSON.stringify(bodyObject, null, 2),
  });
};

module.exports.getBody = (ctx) => {
  const requestBody = ctx.request.getBody();
  const parsedBodyText = JSON.parse(requestBody.text || '{}');
  return parsedBodyText;
}

module.exports.isPinbankRequest = (ctx) => {
  const parsedUrl = URL.parse(ctx.request.getUrl());
  return /pinbank\.com\.br$/.test(parsedUrl.host) && /Encrypted$/.test(parsedUrl.path);
}

module.exports.setHeader = (ctx, headerName, value) => {
  if (!ctx.request.hasHeader(headerName)) ctx.request.addHeader(headerName, value);
  else ctx.request.setHeader(headerName, value);
}

module.exports.findAccessToken = async (ctx) => {
  const accessToken = await ctx.store.getItem('pinbank_access_token');
  return accessToken;
}

module.exports.accessTokenExpired = async (ctx) => {
  const [expiresAt, accessToken] = await Promise.all([
    ctx.store.getItem('pinbank_token_expires_at'),
    ctx.store.getItem('pinbank_access_token')
  ]);
  return Date.now() > Number(expiresAt) || !accessToken;
}

module.exports.makeAuthorization = async (ctx) => {
  if (!(await this.accessTokenExpired(ctx)))
    return this.findAccessToken(ctx);

  const { userName: username, keyValue: password } = await getCredentials(ctx);
  const grant_type = 'password';
  const parsedUrl = URL.parse(ctx.request.getUrl());
  
  const requestTokenUrl = parsedUrl.protocol.concat('//')
    .concat(parsedUrl.host)
    .concat('/services/api/token');

  const params = qs.stringify({ username, password, grant_type });

  try {
    const { data: res } = await axios.post(requestTokenUrl, params);
    const accessToken = get(res, 'access_token', null);
    const expiresIn = get(res, 'expires_in', null);

    if (!accessToken)
      throw new Error('Token de acesso não disponível.');

    const tokenExpiresAt = Date.now() + Number(expiresIn) * 1000;
    await ctx.store.setItem('pinbank_access_token', accessToken);
    await ctx.store.setItem('pinbank_token_expires_at', tokenExpiresAt);

    return accessToken;
  } catch (err) {
    const message = get(err, 'err.response.data.Message', err.message);
    throw new Error(`Não foi possível realizar a autenticação na PinBank: ${message}`);
  }
}
