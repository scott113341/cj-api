const Promise = require('bluebird');
const _ = require('lodash');
const request = require('superagent');
const { parseString } = require('xml2js');

function CjClient (apiKey) {
  if (!apiKey) throw Error('You must specify an API key.');

  this.CommissionDetail = getResponse.bind(this, apiKey, 'https://commission-detail.api.cj.com/v3/item-detail/', ['cj-api', 'item-details', 0, 'item']);
  this.Commissions = getResponse.bind(this, apiKey, 'https://commission-detail.api.cj.com/v3/commissions', ['cj-api', 'commissions', 0, 'commission'], '');
  this.Products = getResponse.bind(this, apiKey, 'https://product-search.api.cj.com/v2/product-search', ['cj-api', 'products', 0, 'product'], '');
}

function getResponse (apiKey, baseUrl, xmlPath, path, query={}) {
  return Promise.resolve()
    .then(() => {
      const dashedQuery = Object.keys(query).reduce((a, c) => Object.assign(a, { [_.kebabCase(c)]: query[c] }), {});
      return request
        .get(baseUrl + path)
        .buffer()
        .set('Authorization', apiKey)
        .query(dashedQuery);
    })
    .then(res => Promise.promisify(parseString)(res.text))
    .then(data => {
      return xmlPath
        .reduce((a, c) => a[c], data)
        .map(co => Object.keys(co).reduce((a, c) => Object.assign(a, { [_.camelCase(c)]: co[c][0] }), {}));
    });
}

module.exports = CjClient;
