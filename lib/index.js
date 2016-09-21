'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Promise = require('bluebird');
var _ = require('lodash');
var request = require('superagent');

var _require = require('xml2js');

var parseString = _require.parseString;


function CjClient(apiKey) {
  if (!apiKey) throw Error('You must specify an API key.');

  this.CommissionDetail = getResponse.bind(this, apiKey, 'https://commission-detail.api.cj.com/v3/item-detail/', ['cj-api', 'item-details', 0, 'item']);
  this.Commissions = getResponse.bind(this, apiKey, 'https://commission-detail.api.cj.com/v3/commissions', ['cj-api', 'commissions', 0, 'commission'], '');
  this.Products = getResponse.bind(this, apiKey, 'https://product-search.api.cj.com/v2/product-search', ['cj-api', 'products', 0, 'product'], '');
}

function getResponse(apiKey, baseUrl, xmlPath, path) {
  var query = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

  return Promise.resolve().then(function () {
    var dashedQuery = Object.keys(query).reduce(function (a, c) {
      return Object.assign(a, _defineProperty({}, _.kebabCase(c), query[c]));
    }, {});
    return request.get(baseUrl + path).buffer().set('Authorization', apiKey).query(dashedQuery);
  }).then(function (res) {
    return Promise.promisify(parseString)(res.text);
  }).then(function (data) {
    return xmlPath.reduce(function (a, c) {
      return a[c];
    }, data).map(function (co) {
      return Object.keys(co).reduce(function (a, c) {
        return Object.assign(a, _defineProperty({}, _.camelCase(c), co[c][0]));
      }, {});
    });
  });
}

module.exports = CjClient;