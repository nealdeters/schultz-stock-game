// API KEY: EJASM1XUMF7RGB4B

// BUDGET CONTROLLER
var playerController = (function(){
  
  var Player = function(id, firstName, lastName, ticker, startPrice){
    this.id = id;
    this.investedCapital = 5000;
    this.firstName = firstName;
    this.lastName = lastName;
    this.ticker = ticker;
    
    // have to hard code to avoid costs
    this.startPrice = startPrice;
    this.shares = (this.investedCapital/this.startPrice);
  }

  var data = {
    allPlayers: []
  }

  return {
    addPlayer: function(firstName, lastName, ticker, startPrice){
      var newPlayer, ID;
      
      // ID = last ID + 1
      // create new ID
      if(data.allPlayers.length > 0){
        ID = data.allPlayers[data.allPlayers.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // create new player
      newPlayer = new Player(ID, firstName, lastName, ticker, startPrice);

      // push it into our data object
      data.allPlayers.push(newPlayer);

      // return the new element
      return newPlayer;
    },

    getPlayers: function(){
      return data.allPlayers;
    },

    // testing: function(){
    //   console.log(data);
    // }
  }

})();

// UI CONTROLLER
var UIController = (function(){
  
  var DOMstrings = {
    listContainer: '.list-container',
    totalTitle: '.budget__value'
  }

  return {
    getDOMstrings: function(){
      return DOMstrings;
    }
  }

})();

// GLOBAL APP CONTROLLER
var controller = (function(playerCtrl, UICtrl){
  
  var playerSetup = function(){
    // Deters Family
    playerCtrl.addPlayer('Neal', 'Deters', 'CARA', 14.56);
    playerCtrl.addPlayer('Jeff', 'Deters', 'CRM', 135.55);
    playerCtrl.addPlayer('Scott', 'Deters', 'NFLX', 267.66);
    playerCtrl.addPlayer('Alex', 'Deters', 'GOOGL', 1054.68);
    playerCtrl.addPlayer('Caroline', 'Deters', 'VALE', 13.47);

    // Bob Schultz Family
    playerCtrl.addPlayer('Christo', 'Schultz', 'YETI', 16.17);
    playerCtrl.addPlayer('Emmie', 'Schultz', 'AMZN', 1539.13);

    // Jim Schultz Family
    playerCtrl.addPlayer('Jamie', 'Schultz', 'ACB', 5.24);
    playerCtrl.addPlayer('John', 'Schultz', 'CGC', 28.92);
    playerCtrl.addPlayer('Charlie', 'Schultz', 'CSIQ', 14.44);

    // Schmidt Family
    playerCtrl.addPlayer('Ryan', 'Schmidt', 'TWLO', 86.97);
    playerCtrl.addPlayer('Mark', 'Schmidt', 'CRON', 11.31);
    playerCtrl.addPlayer('Megan', 'Schmidt', 'MCRN', 12.16);
    playerCtrl.addPlayer('Michael', 'Schmidt', 'MS', 40.40);
    playerCtrl.addPlayer('Sarah', 'Schmidt', 'GOLD', 13.10);
    playerCtrl.addPlayer('Laura', 'Schmidt', 'MCRN', 12.16);

    // Jack Schultz Family
    playerCtrl.addPlayer('James', 'Schultz', 'AMD', 18.83);
    playerCtrl.addPlayer('Joseph', 'Schultz', 'DIS', 108.97);

    // Kaldas Family
    playerCtrl.addPlayer('Nardeen', 'Kaldas', 'ULTA', 247.97);
    playerCtrl.addPlayer('Michael', 'Kaldas', 'INTC', 47.08);

    // Tawdros Family
    playerCtrl.addPlayer('Jenny', 'Tawdros', 'MSFT', 101.12);
    playerCtrl.addPlayer('Joyce', 'Tawdros', 'AAL', 32.48);

    // Lacksen Family
    playerCtrl.addPlayer('Katherine', 'Lacksen', 'CRR', 3.74);
    playerCtrl.addPlayer('Elizabeth', 'Lacksen', 'PFE', 43.25);
    playerCtrl.addPlayer('Larry', 'Lacksen', 'ADBE', 224.57);
    playerCtrl.addPlayer('Will', 'Lacksen', 'AAPL', 157.92);
  }

  var urlCall = {
    deep: 'https://api.iextrading.com/1.0/deep?symbols='
  }

  var apiCall = function(ticker, url){
    return fetch(url 
      + ticker)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      return myJson;
    }).catch(function(error){
      console.log(error)
    });
  }

  var totalGainLoss = 0;

  var appendPlayerData = function(player){
    return apiCall(player.ticker, urlCall.deep).then(function(response){
      var value = (player.shares * response.lastSalePrice);
      var gainLoss = value - player.investedCapital;

      var obj = {
        fullName: player.firstName + ' ' + player.lastName,
        ticker: response.symbol,
        cost: player.startPrice.toFixed(2),
        shares: player.shares.toFixed(2),
        price: response.lastSalePrice.toFixed(2),
        value: value.toFixed(2),
        gainLoss: gainLoss.toFixed(2),
        percent: null
      }


      totalGainLoss += gainLoss;

      var list = document.querySelector(UICtrl.getDOMstrings().listContainer);
      
      for(var key in obj){
        // create the div with class
        var div = document.createElement('div');

        switch(key){
          case 'gainLoss':
            if(gainLoss > 0){
              div.className = 'list-item income__title gainLoss';
            } else {
              div.className = 'list-item expenses__title gainLoss';
            }

            div.textContent = obj[key];
            break;
          default:
            div.className = 'list-item';
            div.textContent = obj[key];
        }

        // append div to list
        list.appendChild(div);
      }
    })
  }

  var fetchPlayerData = function(){
    var players = playerCtrl.getPlayers();
    var promises = [];

    players.forEach(function(player){
      promises.push(appendPlayerData(player));
    })

    Promise.all(promises).then(function(values) {
      var totalTitle = document.querySelector(UICtrl.getDOMstrings().totalTitle);
      totalTitle.innerHTML = totalGainLoss.toFixed(2);
      if(totalGainLoss){
        totalTitle.classList = 'budget__value income__title';
      } else {
        totalTitle.classList = 'budget__value expenses__title';
      }
    });
  }

  // get first price open of the year
  // find numbers of shares (5000/first price)

  return {
    init: function(){
      playerSetup();
      fetchPlayerData();
    }
  }

})(playerController, UIController);

// initialize the budget app
controller.init();