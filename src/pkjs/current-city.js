// hack to allow testing with nodejs...
var ajax;
try {
  ajax = require('pebblejs/lib/ajax');
} catch (e) {
  ajax = _ajax;
}

function getCurrentCity(onSuccess, onError) {

// Request current position
  navigator.geolocation.getCurrentPosition(function (pos) {
    console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
    ajax({
        url: 'https://api-adresse.data.gouv.fr/reverse/?lat='+pos.coords.latitude+'&lon='+pos.coords.longitude,
        type: 'json',
      },
      function (data) {
        if (data.features
          && data.features[0]
          && data.features[0].properties) {
          const cityProperties = data.features[0].properties;
          const city = {
            name : cityProperties.city,
            context : cityProperties.context,
            inseeCode : cityProperties.citycode,
            postCode : cityProperties.postcode,
          };
          onSuccess(city);
        } else {
          onError("no data found for geoloc "+ JSON.stringify(pos.coords));s
        }

      }, onError);
  }, onError, {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  });

}

module.exports = getCurrentCity