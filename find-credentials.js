const { hasCredentials, getCredetials, saveCredentials } = require('./store-utils');

module.exports = async (ctx) => {
  if ((await hasCredentials(ctx)))
    return getCredetials(ctx);

  try {
    await ctx.app.alert('Credenciais não encontradas!', 'Para continuar a requisição é necessário informar as credenciais recebidas da PinBank. São elas: CodigoCliente, CodigoCanal, KeyValue, UserName e RequestOrigin. Você só precisa informar apenas uma vez, salvaremos isto no seu computador.');

    const clientCode = await ctx.app.prompt('Informe o CodigoCliente', {
      cancelable: true,
      submitName: 'Próximo',
    });
    const channelCode = await ctx.app.prompt('Informe o CodigoCanal', {
      cancelable: true,
      submitName: 'Próximo',
    });
    const keyValue = await ctx.app.prompt('Informe a KeyValue', {
      cancelable: true,
      submitName: 'Próximo',
    });
    const userName = await ctx.app.prompt('Informe o UserName', {
      cancelable: true,
      submitName: 'Próximo',
    });
    const requestOrigin = await ctx.app.prompt('Informe o RequestOrigin', {
      cancelable: true,
      submitName: 'Salvar',
    });
    const credentials = { clientCode, channelCode, keyValue, userName, requestOrigin };
    await saveCredentials(ctx, credentials);
    return credentials;
  } catch (err) {}
};
