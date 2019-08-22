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

    clearTotalGainLoss: function(){
      data.totalGainLoss = 0;
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
    totalTitle: '.header__value',
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
                element.className = 'list-item positive__title ' + key;
              } else {
                element.className = 'list-item negative__title ' + key;
              }

              element.textContent = obj[key];
              break;

            case 'ticker':
              element = document.createElement('td');
              element.className = 'list-item ' + key;

              var a = document.createElement('a');
              a.setAttribute('target', '_blank');
              a.setAttribute('href', urlCall.yahooFinance + obj[key]);
              a.textContent = obj[key];

              element.appendChild(a);
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
    },

    clearList: function(){
      var list = document.querySelector(DOMstrings.tableBody);
      while (list.hasChildNodes()) {
          list.removeChild(list.lastChild);
      }
    }
  }

})();

// GLOBAL APP CONTROLLER
var controller = (function(listCtrl, UICtrl){
  
  var playerSetup = function(){
    // grabbed historial data from start of year from link below
    // https://www.marketwatch.com/investing/stock/CARA/historical?siteid=mktw&date=&x=18&y=16

    // Deters Family
    listCtrl.addPlayer('Neal', 'Deters', 'CARA', 13.01);
    listCtrl.addPlayer('Jeff', 'Deters', 'CRM', 133.40);
    listCtrl.addPlayer('Scott', 'Deters', 'NFLX', 259.28);
    listCtrl.addPlayer('Alex', 'Deters', 'GOOGL', 1027.20);
    listCtrl.addPlayer('Caroline', 'Deters', 'VALE', 12.94);

    // Bob Schultz Family
    listCtrl.addPlayer('Christo', 'Schultz', 'YETI', 14.73);
    listCtrl.addPlayer('Emmie', 'Schultz', 'AMZN', 1465.20);

    // Jim Schultz Family
    listCtrl.addPlayer('Jamie', 'Schultz', 'ACB', 4.89);
    listCtrl.addPlayer('John', 'Schultz', 'CGC', 26.52);
    listCtrl.addPlayer('Charlie', 'Schultz', 'CSIQ', 14.05);

    // Schmidt Family
    listCtrl.addPlayer('Ryan', 'Schmidt', 'TWLO', 87.45);
    listCtrl.addPlayer('Mark', 'Schmidt', 'CRON', 10.25);
    listCtrl.addPlayer('Megan', 'Schmidt', 'WFC', 45.53);
    listCtrl.addPlayer('Michael', 'Schmidt', 'MS', 39.02);
    listCtrl.addPlayer('Sarah', 'Schmidt', 'GOLD', 13.64);
    listCtrl.addPlayer('Laura', 'Schmidt', 'MCRN', 11.70);

    // Jack Schultz Family
    listCtrl.addPlayer('James', 'Schultz', 'AMD', 18.01);
    listCtrl.addPlayer('Joseph', 'Schultz', 'DIS', 108.10);

    // Kaldas Family
    listCtrl.addPlayer('Nardeen', 'Kaldas', 'ULTA', 239.96);
    listCtrl.addPlayer('Michael', 'Kaldas', 'INTC', 45.96);

    // Tawdros Family
    listCtrl.addPlayer('Jenny', 'Tawdros', 'MSFT', 99.55);
    listCtrl.addPlayer('Joyce', 'Tawdros', 'AAL', 31.46);

    // Lacksen Family
    listCtrl.addPlayer('Katherine', 'Lacksen', 'CRR', 3.38);
    listCtrl.addPlayer('Elizabeth', 'Lacksen', 'PFE', 43.12);
    listCtrl.addPlayer('Larry', 'Lacksen', 'ADBE', 219.91);
    listCtrl.addPlayer('Will', 'Lacksen', 'AAPL', 154.89);

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
    // clear any previous list
    UICtrl.clearList();
    listCtrl.clearTotalGainLoss()

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
      if(totalGainLoss > 0){
        totalTitle.innerHTML = '+ ' + totalGainLoss;
        totalTitle.classList = 'header__value positive__title';
      } else {
        totalTitle.innerHTML = totalGainLoss;
        totalTitle.classList = 'header__value negative__title';
      }

      setTimeout(function() {
        fetchPlayerData();
      }, 60000)
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