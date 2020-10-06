# Donate Bot Node API
A Donate Bot API client for Node.JS

## Installation
```bash
npm i donatebot-node-api --save
```

## Documentation
[Click here to read the documentation for this API client.](https://developers.donatebot.io/api-libraries/wrappers-node.js)

## Usage

```javascript
var DonateBotAPI =  require('donatebot-node-api');

var api = new DonateBotAPI({
	serverID:  "Your Discord Server ID",
	apiKey:  "Your Donate Bot API Key retrieved from the panel"
});

api.getNewDonations().then(donations =>  {
	console.log(donations);
}).catch(err =>  {
	console.log(err);
});
```
