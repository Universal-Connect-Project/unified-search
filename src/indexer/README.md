# Search data indexing tool set

This folder contains the scripts needed to fetch-link-merge-index the financial institution list from multiple providers

## the indexing process:
- Working in `tools` folder
- this `indexer/config.js` isn't required by the API service. DO NOT provide credentials to the API config, use a `.env` file here under `tools` folder
- Fetch data from providers' API, `ts-node <provider>Data.js`
  this will generate provider institution list in csv file into the `institutionDataPath` in [config.js](./config.js)
- Manually managed institution mappings between providers is assumed to be available in the `institutionDataPath`, the schema assumed is in [merge.js](./tools/merge.js)
- With data ready, `node merge.js` will read the lists and mappings then merge them into a `main.csv` file, 
  the merge process uses the specific order in the code to read from providers and map it to the final list 
- With `main.csv` ready, use `node buildIndex.js` to generate `index.txt` which is the machine used index.

## Publishing the data
- Upload the built index`main.csv` and `index.txt` file to an http accessible url, with a `version.json` as metadata:
```json
  {
    "$env": "$version"
  }
```
- The search API will look for a `verson.json` in the `DATABASE_URL` in [server/config.js](../server/config.js), then use the `Env` value to find the version number, then load `$version.csv` which is the `main.csv` uploaded
- the API will load the `version.txt` and use too, if it can't find it. it wll call `buildIndex` to make index from the `csv` file

## Add a new provider
- Name the provider and add to the `providers` array at the top of [merge.js](./tools/merge.js)
- Add a corresponding `processProvider` call near the bottom of `merge.js`
- The order of the provider added is important, so that it can leverage the manual mappings and chain-map the same institutions across all the providers data
- It should handle the new provider and generate the data and mappings to `main.csv`, otherwise, debug.


