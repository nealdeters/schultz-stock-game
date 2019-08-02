// TODO
// value
// price
// gainLoss

// all set as strings when should be numbers

// URLS
var urlCall = {
  deep: 'https://api.iextrading.com/1.0/deep?symbols=',
  last: 'https://api.iextrading.com/1.0/tops/last?symbols=',
  yahooFinance: 'https://finance.yahoo.com/quote/'
}

// LIST CONTROLLER
var listController = (function(){

  var self = this;
  
  var data = {
    allPlayers: [],
    totalGainLoss: 0
  }
  
  var Player = function(id, firstName, lastName, ticker, startPrice){
    var self = this;
    var investedCapital = 5000;
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.rank = null;
    this.percentChange = null;
    this.stock = {
      ticker: ticker,
      startPrice: startPrice,
      value: null,
      cost: investedCapital,
      shares: (investedCapital/startPrice),
      gainLoss: null,
      price: null
    }
  }

  Player.prototype.getFullName = function(){
    return this.firstName + ' ' + this.lastName;
  };

  Player.prototype.setGainLoss = function(value){
    this.stock.gainLoss = (value - this.stock.cost);
    return this.gainLoss;
  };

  Player.prototype.setValue = function(price){
    this.stock.value = (this.stock.shares * price);
    return this.stock.value;
  };

  Player.prototype.setPercentChange = function(){
    var change = this.stock.price - this.stock.startPrice;
    var percent = change/this.stock.startPrice;
    this.percentChange = percent * 100;
  }

  Player.prototype.setStockPrice = function(price){
    this.stock.price = price;
  }

  var getGainLoss = function(value, cost){
    // console.log(typeof value)
    // console.log(typeof cost)
    return (value - cost);
  }

  var calculateTotalGainLoss = function(){
    data.allPlayers.forEach(function(player){
      var gainLoss = parseInt(getGainLoss(player.stock.value, player.stock.cost));
      data.totalGainLoss += gainLoss;
    })
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

    calculateRankings: function(){
      // change sort function
      data.allPlayers.sort(function(a, b){
          return b.stock.value - a.stock.value;
      });

      var rank = 1;
      for (var i = 0; i < data.allPlayers.length; i++) {
        // increase rank only if current stock.value less than previous
        if (i > 0 && data.allPlayers[i].stock.value < data.allPlayers[i - 1].stock.value) {
          rank++;
        }
          data.allPlayers[i].rank = rank;
      }
    },

    getTotalGainLoss: function(){
      calculateTotalGainLoss();
      return data.totalGainLoss.toFixed(2);
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
    totalTitle: '.budget__value',
    tableBody: '.table-body'
  }

  return {
    getDOMstrings: function(){
      return DOMstrings;
    },

    appendList: function(players){
      players.forEach(function(player){
        var obj = {
          rank: player.rank,
          fullName: player.getFullName(),
          ticker: player.stock.ticker,
          shares: player.stock.shares.toFixed(2),
          cost: player.stock.startPrice.toFixed(2),
          price: player.stock.price.toFixed(2),
          value: player.stock.value.toFixed(2),
          gainLoss: player.stock.gainLoss.toFixed(2),
          percent: player.percentChange.toFixed(2) + '%'
        }

        var list = document.querySelector(DOMstrings.tableBody);
        var row = document.createElement('tr');

        for(var key in obj){
          // create the div with class
          var element;

          switch(key){
            case 'gainLoss':
              element = document.createElement('td');
              if(obj[key] > 0){
                element.className = 'list-item income__title gainLoss ' + key;
              } else {
                element.className = 'list-item expenses__title gainLoss ' + key;
              }

              element.textContent = obj[key];
              break;

            case 'ticker':
              element = document.createElement('td');
              element.setAttribute('target', '_blank');
              element.setAttribute('href', urlCall.yahooFinance + obj[key]);
              element.className = 'list-item ' + key;
              element.textContent = obj[key];
              break;

            default:
              element = document.createElement('td');
              element.className = 'list-item ' + key;
              element.textContent = obj[key];
          }

          // append div to list
          row.appendChild(element)
        }

        list.appendChild(row)
      })
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

    fetchPlayerData();
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

  var getPlayerData = function(player){
    return apiCall(player.stock.ticker, urlCall.last).then(function(response){
      player.setStockPrice(response[0].price);
      player.setValue(response[0].price);
      player.setGainLoss(player.stock.value);
      player.setPercentChange();
    })
  }

  var fetchPlayerData = function(){
    var players = listCtrl.getPlayers();
    var promises = [];

    players.forEach(function(player){
      promises.push(getPlayerData(player));
    })

    Promise.all(promises).then(function(values) {
      listCtrl.calculateRankings();
      UICtrl.appendList(listCtrl.getPlayers());

      var totalTitle = document.querySelector(UICtrl.getDOMstrings().totalTitle);
      var totalGainLoss = listCtrl.getTotalGainLoss();
      totalTitle.innerHTML = totalGainLoss;
      if(totalGainLoss > 0){
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
    }
  }

})(listController, UIController);

// initialize the budget app
controller.init();