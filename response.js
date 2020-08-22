const get = require('lodash.get');
const { setBody, isPinbankRequest, setHeader, getBody } = require('./response-utils');
const findCredentials = require('./find-credentials');
const Crypto = require('./crypto');

module.exports = async (ctx) => {
  if (!(await isPinbankRequest(ctx))) return;
  
  const credentials = await findCredentials(ctx);
  const crypto = new Crypto({ ctx, credentials });
  const body = getBody(ctx);
  const bodyEncrypted = get(body, 'Data.Json', null);

  if (!bodyEncrypted) return;
  
  setBody(ctx, { ...body, ...crypto.decrypt(bodyEncrypted) });
}