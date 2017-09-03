function CardStack(splashScreen) {
  this.cards = [];
  splashScreen.show();
  this.currentCard = splashScreen;
}


function mod(a, n) {
  return ((a % n) + n) % n;
}

function setupListeners(stack, cardHolder) {
  var card = cardHolder.card;
  card.on('click', 'up', function (e) {
    var cardIndex = mod(cardHolder.cardIndex - 1, stack.cards.length);
    stack.show(cardIndex);
  });
  card.on('click', 'down', function (e) {
    var cardIndex = mod(cardHolder.cardIndex + 1, stack.cards.length);
    stack.show(cardIndex);
  });
  card.on('click', 'select', function (e) {
    cardHolder.refresh();
  });
}

CardStack.prototype.show = function (cardIndex) {
  console.log('showing ' + cardIndex)
  var newCurrentCard = this.cards[cardIndex];
  if (newCurrentCard) {
    newCurrentCard.show();
    if (this.currentCard) {
      console.log('hiding ' + this.currentCard.cardIndex)
      if (this.currentCard.hide) {
        console.log('hiding the card')
        this.currentCard.hide();
      } else if (this.currentCard.card.hide) {
        console.log('hiding the card.card')
        this.currentCard.card.hide();
      }
    }
    this.currentCard = newCurrentCard;
  }
};

CardStack.prototype.register = function (metaCard, doShow) {
  const self = this;
  if (!metaCard.card) {
    throw new Error("the card to register in the stack must have a ui card instance" + JSON.stringify(metaCard));
  }
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

  metaCard.cardIndex = self.cards.length;
  self.cards.push(metaCard);

  setupListeners(self, metaCard);

  if (doShow) {
    metaCard.refresh(function () {
      self.show(metaCard.cardIndex);
    });
  } else {
    metaCard.refresh(function () {
      if (!self.currentCard) {
        self.show(metaCard.cardIndex);
      }
    });
  }
};

module.exports = CardStack;