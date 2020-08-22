module.exports.isValidCredentials = async (ctx) => {
  const credentials = ctx.request.getEnvironmentVariable('pinbankCredentials') || ctx.request.getEnvironmentVariable('pinbank_credentials');
  const keys = ['clientCode', 'channelCode', 'keyValue', 'userName', 'requestOrigin'];
  const validKeys = [];

  Object.entries(credentials || {}).forEach(([keyName, value]) => {
    if (typeof value !== 'undefined' && !!value) validKeys.push(keyName);
  });

  if (keys.length !== validKeys.length) {
    await ctx.app.alert('Credenciais inválidas.', 'Crie uma chave nas suas variaveis ambientes com o nome de "pinbankCredentials" ou "pinbank_credentials" com as chaves: clientCode, channelCode, keyValue, userName, requestOrigin.');
    return false;
  }

  return true;
}

module.exports.getCredentials = async (ctx) => {
  return ctx.request.getEnvironmentVariable('pinbankCredentials') || ctx.request.getEnvironmentVariable('pinbank_credentials');
}

module.exports = async (ctx) => {
  if ((await this.isValidCredentials(ctx)))
    return this.getCredentials(ctx);

  throw new Error('Você precisa criar as variaveis de ambiente corretamente.');
};
