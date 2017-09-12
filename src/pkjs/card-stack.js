const UI = require('pebblejs/ui');

const buildCardMeteoWindow = require('./card-meteo-window-builder.js');

function mod(a, n) {
  return ((a % n) + n) % n;
}

function setupListeners(stack) {
  const self = stack;
  var card = self.card;
  card.on('click', 'up', function (e) {
    var cardIndex = mod(stack.cardIndex - 1, self.cards.length);
    self.show(cardIndex);
  });
  card.on('click', 'down', function (e) {
    var cardIndex = mod(stack.cardIndex + 1, self.cards.length);
    self.show(cardIndex);
  });
  card.on('click', 'select', function (e) {
    var cardIndex = self.cardIndex;
    const infoMeteo = self.cards[cardIndex];
    infoMeteo.rain.lastUpdate = '--:--';
    self.card.refreshWindow(infoMeteo.city, infoMeteo.rain);
    infoMeteo.refresh(function (rain) {
      self.show(cardIndex);
    }, function (err) {
    });
  });
  self.cardIndex = 0;
}


function CardStack() {
  this.cards = [];
  this.card = buildCardMeteoWindow();

  this.card.show();
}


CardStack.prototype.show = function (cardIndex) {
  const self = this;
  console.log('showing ' + cardIndex);
  self.cardIndex = cardIndex;
  const infoMeteo = self.cards[cardIndex];
  this.card.refreshWindow(infoMeteo.city, infoMeteo.rain);
};

CardStack.prototype.register = function (metaCard, doShow) {
  const self = this;
  if (!metaCard.refresh) {
    throw new Error("the card to register in the stack must have a refresh method" + JSON.stringify(metaCard));
  }

  const id = metaCard.getId();
  const matchingCard = self.cards.filter(function (existingCard) {
    return id === existingCard.getId();
  });
  if (matchingCard.length > 0) {
    console.log('the card ' + id + ' is already defined');
    return;
  }

  const cardIndex = self.cards.length;
  metaCard.cardIndex = cardIndex;
  self.cards.push(metaCard);

  metaCard.refresh(function (rain) {
    if (cardIndex === 0) {
      self.show(cardIndex);
      setupListeners(self);
    }
  });


};

function deg2rad(deg) {
  return deg * Math.PI / 180;
}

CardStack.prototype.showClosest = function (coords) {
  const self = this;
  if (coords) {
    const src = {lat: deg2rad(coords.latitude), lon: deg2rad(coords.longitude)};
    var closestIndex;
    var closestDistance = 100000000000;
    self.cards.forEach(function (card, idx) {
      if (card.city.coords) {
        const dest = {lat: deg2rad(card.city.coords.latitude), lon: deg2rad(card.city.coords.longitude)};
        const dist = 6367445 * Math.acos(Math.sin(src.lat) * Math.sin(dest.lat) + Math.cos(src.lat) * Math.cos(dest.lat) * Math.cos(src.lon - dest.lon))
        console.log('src ' + JSON.stringify(coords))
        console.log('dest ' + JSON.stringify(card.city.coords))
        console.log(card.city.name +' dist ' + dist);

        if (dist < closestDistance) {
          closestDistance = dist;
          closestIndex = idx;
        }
      }

    });
    if (closestIndex) {
      console.log('showing closest city : ' + closestIndex);
      self.show(closestIndex)
    }
  }
}

module.exports = CardStack;