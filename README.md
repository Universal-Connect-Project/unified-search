# Introduction 
Provides a universal institution search and multi-provider mapping service

# Getting Started
- `npm ci`
- `npm run dev`
- `http://localhost:8082/api/*`

By default, the service has only one dependency: 
- Ensure the index data source url as `DATABASEURL` in [config.js](./src/server/config.js), this is Optional:
  The existing config value points to a UCP-hosted data source, which is publicly accessible. Although it is rapidly updated, you might want to pull and cache your own version.
- The server will load the index from the url at start up, then check the `version.json` periodically, and update the index if there is a new version.
- If a new version is published for the specific env, it takes ~30s for the instance to discover it and update the index.  

In addition:
- If you'd like to use the `preference` feature with which you can use the API to upload and query your preference, config the `S3Bucket` value in `config.js` and grant the app the necessary permissions.
- Otherwise, update [defaultPreference.js](./src/server/defaultPreference.js) with your preference. 
- The default provider is configured through a shortcut `LocalDefaultProvider` in `config.js`, which overwrites `defaultPreference.js`
