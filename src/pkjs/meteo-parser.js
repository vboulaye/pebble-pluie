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
    //console.log("pluie dans l heure " + JSON.stringify(data));
    if (!data.lastUpdate) {
      data.lastUpdate = 'non couvert';
    } else {
      data.lastUpdate = data.lastUpdate.replace('h', ':');
      // echeance gives the start time of the forecast
      if (data.echeance) {
        data.lastUpdate = data.echeance.substr(8, 2) + ':' + data.echeance.substr(10, 2);
      }
    }
    onSuccess(data);
  }, onError);
}

module.exports = getRain;