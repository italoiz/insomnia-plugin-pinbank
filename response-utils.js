const URL = require('url');

module.exports.setBody = (ctx, bodyObject) => {
  ctx.response.setBody(Buffer.from(JSON.stringify(bodyObject, null, 2)));
};

module.exports.getBody = (ctx) => {
  const requestBody = ctx.response.getBody();
  
  if (typeof requestBody === 'string')
    return JSON.parse(requestBody || '{}') || {};

  if (requestBody instanceof Buffer)
    return JSON.parse(requestBody.toString('utf8') || '{}') || {};

  return requestBody;
}

module.exports.isPinbankRequest = async (ctx) => {
  const requestId = await ctx.store.getItem('pinbank_request_id');
  return requestId === ctx.response.getRequestId();
}

module.exports.setHeader = (ctx, headerName, value) => {
  if (!ctx.response.hasHeader(headerName)) ctx.response.addHeader(headerName, value);
  else ctx.response.setHeader(headerName, value);
}