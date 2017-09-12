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
        url: 'https://api-adresse.data.gouv.fr/reverse/?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude,
        type: 'json',
      },
      function (data) {
        if (data.features
          && data.features[0]
          && data.features[0].properties) {
          const cityProperties = data.features[0].properties;
          const city = {
            name: cityProperties.city,
            context: cityProperties.context,
            inseeCode: cityProperties.citycode,
            lat: cityProperties.postcode,
            lon: cityProperties.postcode,
          };
          if (data.features[0].geometry && data.features[0].geometry.coordinates) {
            city.coords = {
              latitude: data.features[0].geometry.coordinates[1],
              longitude: data.features[0].geometry.coordinates[0],
            }
          }
          onSuccess(city, pos.coords);
        } else {
          onError("no data found for geoloc " + JSON.stringify(pos.coords));
          s
        }

      }, onError);
  }, onError, {
    enableHighAccuracy: false,
    maximumAge: 10000,
    timeout: 10000
  });

}

module.exports = getCurrentCity;