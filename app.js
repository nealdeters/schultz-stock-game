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
    // https://finance.yahoo.com/quote/CRM/history?period1=1548828000&period2=1548828000&interval=1d&filter=history&frequency=1d

    // Deters Family
    listCtrl.addPlayer('Neal', 'Deters', 'CARA', 14.68);
    listCtrl.addPlayer('Jeff', 'Deters', 'CRM', 147.19);
    listCtrl.addPlayer('Scott', 'Deters', 'NFLX', 332.75);
    listCtrl.addPlayer('Alex', 'Deters', 'GOOGL', 1077.36);
    listCtrl.addPlayer('Caroline', 'Deters', 'VALE', 12.46);

    // Bob Schultz Family
    listCtrl.addPlayer('Christo', 'Schultz', 'YETI', 17.31);
    listCtrl.addPlayer('Emmie', 'Schultz', 'AMZN', 1623.00);

    // Jim Schultz Family
    listCtrl.addPlayer('Jamie', 'Schultz', 'ACB', 6.96);
    listCtrl.addPlayer('John', 'Schultz', 'CGC', 47.51);
    listCtrl.addPlayer('Charlie', 'Schultz', 'CSIQ', 20.72);

    // Schmidt Family
    listCtrl.addPlayer('Ryan', 'Schmidt', 'TWLO', 101.08);
    listCtrl.addPlayer('Mark', 'Schmidt', 'CRON', 18.14);
    listCtrl.addPlayer('Megan', 'Schmidt', 'WFC', 49.84);
    listCtrl.addPlayer('Michael', 'Schmidt', 'MS', 42.35);
    listCtrl.addPlayer('Sarah', 'Schmidt', 'GOLD', 12.89);
    listCtrl.addPlayer('Laura', 'Schmidt', 'MCRN', 13.57);

    // Jack Schultz Family
    listCtrl.addPlayer('James', 'Schultz', 'AMD', 21.49);
    listCtrl.addPlayer('Joseph', 'Schultz', 'DIS', 110.30);

    // Kaldas Family
    listCtrl.addPlayer('Nardeen', 'Kaldas', 'ULTA', 290.28);
    listCtrl.addPlayer('Michael', 'Kaldas', 'INTC', 46.68);

    // Tawdros Family
    listCtrl.addPlayer('Jenny', 'Tawdros', 'MSFT', 104.62);
    listCtrl.addPlayer('Joyce', 'Tawdros', 'AAL', 36.43);

    // Lacksen Family
    listCtrl.addPlayer('Katherine', 'Lacksen', 'CRR', 4.34);
    listCtrl.addPlayer('Elizabeth', 'Lacksen', 'PFE', 40.77);
    listCtrl.addPlayer('Larry', 'Lacksen', 'ADBE', 240.16);
    listCtrl.addPlayer('Will', 'Lacksen', 'AAPL', 163.25);

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