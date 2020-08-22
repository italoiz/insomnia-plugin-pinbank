# Insomnia Plugin PinBank

## Installation

Access the Application / Preferences menu and then select the Plugins tab, enter the plugin name `insomnia-plugin-pinbank` and click Install Plugin.

## How it's works!

On the first request to PinBank url, the plugin ask for your credentials provided by PinBank. The credentials is stored on the insomnia data to next requests.

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