module.exports.hasCredentials = (ctx) => {
  return ctx.store.hasItem('pinbank_credentials');
}

module.exports.getCredetials = async (ctx) => {
  const credentials = await ctx.store.getItem('pinbank_credentials');
  return JSON.parse(credentials || '{}');
}

module.exports.saveCredentials = async (ctx, credentials) => {
  await ctx.store.setItem('pinbank_credentials', JSON.stringify(credentials));
}