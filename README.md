# Insomnia Plugin PinBank

## Installation

Access the Application / Preferences menu and then select the Plugins tab, enter the plugin name `insomnia-plugin-pinbank` and click Install Plugin.

## How it's works!

You should create a environment variable called `pinbank_credentials` or `pinbankCredentials` with follow object:

```json
{
  "clientCode": 0,
  "channelCode": 0,
  "keyValue": "string",
  "userName": "string",
  "requestOrigin": 0
}
```

To make the request for PinBank with JSON object, follow the sample:

To request like this:
```json
{
  "Data": {
    "CodigoCanal": 0,
    "CodigoCliente": 0,
    "NossoNumero": "string"
  }
}
```

Create a JSON like this:
```json
{
  "NossoNumero": "string"
}
```

> Note: The `CodigoCanal` and `CodigoCliente` are put automatically in the request from your stored credentials (see [installation step](#Installation)).

## License

MIT © [Italo Izaac](https://github.com/italoiz)