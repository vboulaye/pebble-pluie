// hack to allow testing with nodejs...
var ajax;
try {
  ajax = require('pebblejs/lib/ajax');
} catch (e) {
  ajax = _ajax;
}


function getRain(cityInseeCode, onSuccess, onError) {
  ajax({
    url: 'https://www.meteofrance.com/mf3-rpc-portlet/rest/pluie/' + cityInseeCode + '0',
    type: 'json',

  }, function (data) {
    console.log("pluie dans l heure " + data.lastUpdate);
    console.log("pluie dans l heure " + JSON.stringify(data));
    onSuccess(data);
  }, onError);
}

module.exports = getRain;