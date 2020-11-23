const axios = require("axios");
const express = require('express');
const router = express.Router();


const ENV_KEY = process.env.SPREEDLY_ENV_KEY || 'NOT SET'
const GATEWAY_KEY = process.env.SPREEDLY_GATEWAY_KEY || 'NOT SET'
const SCA_PROVIDER_KEY = process.env.SCA_PROVIDER_KEY || 'NOT SET'
const REDIRECT_URL = process.env.REDIRECT_URL || 'http://to-be-set.ngrok.io'
const CALLBACK_URL = process.env.CALLBACK_URL || 'http://to-be-set.ngrok.io'
const BASIC_AUTH_CREDS = process.env.BASIC_AUTH_CREDS || '<base 64 encoded credentials>'
const CORE_URL = process.env.CORE_URL || 'http://core.spreedly.com'
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080'

/* GET home page. IFrame-based example */
router.get('/', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Credentials', 'true');

  console.debug(`Accept Header is ${req.get('Accept')}`)

  res.render('index.html', {
    SPREEDLY_GATEWAY_KEY: GATEWAY_KEY,
    SPREEDLY_ENV_KEY: ENV_KEY,
    SCA_PROVIDER_KEY: SCA_PROVIDER_KEY,
    BASIC_AUTH_CREDS: BASIC_AUTH_CREDS,
    REDIRECT_URL: REDIRECT_URL,
    CALLBACK_URL: CALLBACK_URL,
    CORE_URL: CORE_URL,
    BASE_URL: BASE_URL,
    HEADER_ACCEPT: req.get('Accept')
  });
});

/* GET Express-based example page. */
router.get('/express', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Credentials', 'true');

  console.debug(`Accept Header is ${req.get('Accept')}`)

  res.render('express.html', {
    SPREEDLY_GATEWAY_KEY: GATEWAY_KEY,
    SPREEDLY_ENV_KEY: ENV_KEY,
    SCA_PROVIDER_KEY: SCA_PROVIDER_KEY,
    BASIC_AUTH_CREDS: BASIC_AUTH_CREDS,
    REDIRECT_URL: REDIRECT_URL,
    CALLBACK_URL: CALLBACK_URL,
    CORE_URL: CORE_URL,
    HEADER_ACCEPT: req.get('Accept')
  });
});

/* Performs a call to Spreedly API 
 * @see {@link https://docs.spreedly.com/reference/api/v1/#purchase}
*/
router.post('/attempt-purchase', function (req, res, next) {
  var purchaseUrl = `${CORE_URL}/v1/gateways/${GATEWAY_KEY}/purchase.json`
  console.debug(`Attempting purchase at ${purchaseUrl} with auth ${BASIC_AUTH_CREDS}`)


  var frontendTx = req.body.transaction
  console.debug(`frontendTx received = ${JSON.stringify(frontendTx)}`)

  var txObject = {
    transaction: {
      amount: frontendTx.amount,
      currency_code: frontendTx.currency,
      payment_method_token: frontendTx.token,
      browser_info: frontendTx.browserData,
      redirect_url: REDIRECT_URL,
      callback_url: CALLBACK_URL,
      sca_provider_key: `${SCA_PROVIDER_KEY}`
    }
  }

  console.debug(`Tx request to Spreedly API: ${JSON.stringify(txObject)} `)

  axios.post(purchaseUrl, txObject,
    {
      headers: {
        'Authorization': `BASIC ${BASIC_AUTH_CREDS}`,
        'Content-Type': 'application/json'
      }
    }
  ).then(coreResponse => {
    data = coreResponse.data
    console.debug(`Data received is ${JSON.stringify(data)}`)

    // return frontend ONLY the data we need there.
    res.json({
      token: data.transaction.token,
      state: data.transaction.state
    })
  })
    .catch((e) => {
        console.debug(`Error accessing ${purchaseUrl}. Details: ${e}`)
        res.json({
          token: frontendTx.token,
          state: "error"
        })
      }
    );

});


router.get('/redirect', function (req, response, next) {
  try {

    // poor man's URL parser to obtain token.
    transactionToken = req.url.split("=")[1]
    coreUrl = `${CORE_URL}/v1/transactions/${transactionToken}.json`;

    console.debug(`CoreURL is ${coreUrl}, auth is ${BASIC_AUTH_CREDS}, transactionToken is ${transactionToken}`)

    axios.get(coreUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${BASIC_AUTH_CREDS}`,
        'Content-Type': 'application/json'
      }
    }).then(coreResponse => {
      data = coreResponse.data;
      console.debug(coreResponse);
      console.debug(data);

      if (data.transaction.succeeded) {
        response.render('success.html', {
          transactionMessage: data.transaction.message,
          transactionToken: data.transaction.token
        })
      }
      else {
        response.render('failure.html')
      }

    })

  } catch (error) {
    console.log(error)
  }

});



router.get('/callback', function (req, res, next) {
  console.debug("Callback received", req)
});

module.exports = router;
