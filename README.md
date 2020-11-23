# Spreedly 3DS Reference Implementation.

This is a companion app to the instructions found in [our Web Integration Guide](http://docs.spreedly.com/guides/spreedly-3dsecure2-web/).

While this is _a way_ to integrate Spreedly 3DS in a very basic HTML+JS app, it's only meant to illustrate the concepts described in our guide. 

Your app probably uses a framework or file structure that greatly differs from this (e.g. Angular, React, Vue); the "touch points" between your backend and frontend, and encapsulations of our event handling will look VERY different once you complete them.

# Frontend
All front end logic is exposed via `views/index.html` and `views/express.html`. 

Here's a quick run-down of the `js` files you'll find:

- `your-code.js` illustrates the end result of all the steps in our guide
- `spreedly-debug-utils.js` enables the 3DS1 fallback scenario
- `spreedly-iframe-boilerplate.js` contains mostly UI-glue for the IFrame-based example.

# Backend

The backend was generated with `npx express-generator` and further customized to serve `mustache`-based templates.

All scaffolding is provided by `/app.js` which loads the `index` and `express` routes, which in turn contain the corresponding frontend views.

# Running the app

You can obtain the Gateway and Environment Key from your "Spreedly Environments" page once you log in to Spreedly.com.

To start the `NodeJS` backend, replace the necessary values and run the following command and load [http://localhost:8080](http://localhost:8080/) or if you use Ngrok, `http://your-server.ngrok.io/`.

```bash
# replace these values with your own
# you can generate the creds using `echo -n username:password | base64`
#
# see https://docs.spreedly.com/reference/api/v1/#using-the-api

SPREEDLY_GATEWAY_KEY=XXXXXXXXXXXXXXXXXX \
SPREEDLY_ENV_KEY=XXXXXXXXXXXXXXXXXX \
REDIRECT_URL=http://your-server.ngrok.io/redirect \
CALLBACK_URL=http://your-server.ngrok.io/callback \
BASIC_AUTH_CREDS="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
SCA_PROVIDER_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \
BASE_URL=http://your-server.ngrok.io \
CORE_URL=http://core.spreedly.com \
    yarn start
```

Alternatively, copy the file `start-server-sample.sh` as `start-server.sh` and customize it.


Note: Gitignore is configured to ignore the file `start-server.sh` and  protect your secrets from inadvertently be uploaded.

# Tips & Tricks

## CORS

If you need to prevent CORS from breaking calls from your localhost to your `*.spreedly.com` URLs you will need to disable CORS. In Chrome you can install an extension such as [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino/related?hl=en), and in Safari you can use the built-in option to do so.


## NGROK

1. Create a new domain in [Ngrok Dashboard](https://dashboard.ngrok.com/), ie: `your-server.ngrok.io`
2. Modify the start script (or command line options)
3. Open in Chrome just the same

