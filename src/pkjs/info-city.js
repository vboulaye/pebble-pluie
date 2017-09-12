// hack to allow testing with nodejs...
var ajax;
try {
  ajax = require('pebblejs/lib/ajax');
} catch (e) {
  ajax = _ajax;
}

function getCityInfo(city, onSuccess, onError) {

  console.log('city= ' + city);
  ajax({
      url: 'https://api-adresse.data.gouv.fr/search/?type=municipality&q=' + city,
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
          postCode: cityProperties.postcode,
        };
        if (data.features[0].geometry && data.features[0].geometry.coordinates) {
          city.coords = {
            latitude: data.features[0].geometry.coordinates[1],
            longitude: data.features[0].geometry.coordinates[0],
          }
        }
        onSuccess(city);
      } else {
        onError("no data found for query " + city);
      }

    }, onError);


}

module.exports = getCityInfo;