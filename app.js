// TODO
// move api calls to list controller
// function for data fetch - collect all data in player object under stock
// function for totalGainLoss
// sort list by top gain
// switch to table or include grid row definition
// make page responsive with mobile call and media queries to remove rows
// define header and body at vh values for perfect fit
// use tops calls instead of deep...only really need the price

// LIST CONTROLLER
var listController = (function(){
  
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
    }
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
var controller = (function(listCtrl, UICtrl){
  
  var playerSetup = function(){
    // Deters Family
    listCtrl.addPlayer('Neal', 'Deters', 'CARA', 14.56);
    listCtrl.addPlayer('Jeff', 'Deters', 'CRM', 135.55);
    listCtrl.addPlayer('Scott', 'Deters', 'NFLX', 267.66);
    listCtrl.addPlayer('Alex', 'Deters', 'GOOGL', 1054.68);
    listCtrl.addPlayer('Caroline', 'Deters', 'VALE', 13.47);

    // Bob Schultz Family
    listCtrl.addPlayer('Christo', 'Schultz', 'YETI', 16.17);
    listCtrl.addPlayer('Emmie', 'Schultz', 'AMZN', 1539.13);

    // Jim Schultz Family
    listCtrl.addPlayer('Jamie', 'Schultz', 'ACB', 5.24);
    listCtrl.addPlayer('John', 'Schultz', 'CGC', 28.92);
    listCtrl.addPlayer('Charlie', 'Schultz', 'CSIQ', 14.44);

    // Schmidt Family
    listCtrl.addPlayer('Ryan', 'Schmidt', 'TWLO', 86.97);
    listCtrl.addPlayer('Mark', 'Schmidt', 'CRON', 11.31);
    listCtrl.addPlayer('Megan', 'Schmidt', 'MCRN', 12.16);
    listCtrl.addPlayer('Michael', 'Schmidt', 'MS', 40.40);
    listCtrl.addPlayer('Sarah', 'Schmidt', 'GOLD', 13.10);
    listCtrl.addPlayer('Laura', 'Schmidt', 'MCRN', 12.16);

    // Jack Schultz Family
    listCtrl.addPlayer('James', 'Schultz', 'AMD', 18.83);
    listCtrl.addPlayer('Joseph', 'Schultz', 'DIS', 108.97);

    // Kaldas Family
    listCtrl.addPlayer('Nardeen', 'Kaldas', 'ULTA', 247.97);
    listCtrl.addPlayer('Michael', 'Kaldas', 'INTC', 47.08);

    // Tawdros Family
    listCtrl.addPlayer('Jenny', 'Tawdros', 'MSFT', 101.12);
    listCtrl.addPlayer('Joyce', 'Tawdros', 'AAL', 32.48);

    // Lacksen Family
    listCtrl.addPlayer('Katherine', 'Lacksen', 'CRR', 3.74);
    listCtrl.addPlayer('Elizabeth', 'Lacksen', 'PFE', 43.25);
    listCtrl.addPlayer('Larry', 'Lacksen', 'ADBE', 224.57);
    listCtrl.addPlayer('Will', 'Lacksen', 'AAPL', 157.92);
  }

  var urlCall = {
    deep: 'https://api.iextrading.com/1.0/deep?symbols=',
    last: 'https://api.iextrading.com/1.0/tops/last?symbols='
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
    return apiCall(player.ticker, urlCall.last).then(function(response){
      var value = (player.shares * response[0].price);
      var gainLoss = value - player.investedCapital;

      var obj = {
        fullName: player.firstName + ' ' + player.lastName,
        ticker: response[0].symbol,
        cost: player.startPrice.toFixed(2),
        shares: player.shares.toFixed(2),
        price: response[0].price.toFixed(2),
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
    var players = listCtrl.getPlayers();
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

})(listController, UIController);

// initialize the budget app
controller.init();