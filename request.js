const { setBody, isPinbankRequest, setHeader, getBody, makeAuthorization } = require('./request-utils');
const findCredentials = require('./find-credentials');
const Crypto = require('./crypto');

module.exports = async (ctx) => {
  if (!isPinbankRequest(ctx)) return;
  
  const credentials = await findCredentials(ctx);
  const crypto = new Crypto({ ctx, credentials });
  const body = getBody(ctx);
  const accessToken = await makeAuthorization(ctx);

  /**
   * Set credentials headers.
   */
  setHeader(ctx, 'UserName', credentials.userName);
  setHeader(ctx, 'RequestOrigin', credentials.requestOrigin);
  setHeader(ctx, 'Authorization', `Bearer ${accessToken}`);

  /**
   * save request id
   */
  await ctx.store.setItem('pinbank_request_id', ctx.request.getId());

  /**
   * Extract the `CodigoCanal` and `CodigoCliente` from credentials to append in body request.
   */
  const { channelCode: CodigoCanal, clientCode: CodigoCliente } = credentials;
  const Json = crypto.encrypt({
    Data: { ...body, CodigoCanal, CodigoCliente }
  });
  setBody(ctx, { Data: { Json } });
};