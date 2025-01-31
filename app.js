// URLS
const urlCall = {
  deep: 'https://api.iextrading.com/1.0/deep?symbols=',
  last: 'https://api.iextrading.com/1.0/tops/last?symbols=',
  yahooFinance: 'https://finance.yahoo.com/quote/'
}

// LIST CONTROLLER
const listController = (function(){

  const self = this
  
  const data = {
    allPlayers: [],
    totalGainLoss: 0
  }
  
  const Player = function(id, firstName, lastName, ticker, startPrice){
    const self = this
    const investedCapital = 5000
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.rank = null
    this.percentChange = null
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
    return this.firstName + ' ' + this.lastName
  }

  Player.prototype.setGainLoss = function(value){
    this.stock.gainLoss = (value - this.stock.cost)
    return this.gainLoss
  }

  Player.prototype.setValue = function(price){
    this.stock.value = (this.stock.shares * price)
    return this.stock.value
  }

  Player.prototype.setPercentChange = function(){
    const change = this.stock.price - this.stock.startPrice
    const percent = change/this.stock.startPrice
    this.percentChange = percent * 100
  }

  Player.prototype.setStockPrice = function(price){
    this.stock.price = price
  }

  const getGainLoss = function(value, cost){
    return (value - cost)
  }

  const calculateTotalGainLoss = function(){
    data.allPlayers.forEach(function(player){
      const gainLoss = parseInt(getGainLoss(player.stock.value, player.stock.cost))
      data.totalGainLoss += gainLoss
    })
  }

  return {
    addPlayer: function(firstName, lastName, ticker, startPrice){
      let newPlayer, ID
      
      // ID = last ID + 1
      // create new ID
      if(data.allPlayers.length > 0){
        ID = data.allPlayers[data.allPlayers.length - 1].id + 1
      } else {
        ID = 0
      }

      // create new player
      newPlayer = new Player(ID, firstName, lastName, ticker, startPrice)

      // push it into our data object
      data.allPlayers.push(newPlayer)

      // return the new element
      return newPlayer
    },

    calculateRankings: function(){
      // change sort function
      data.allPlayers.sort(function(a, b){
          return b.stock.value - a.stock.value
      })

      let rank = 1
      for (let i = 0; i < data.allPlayers.length; i++) {
        // increase rank only if current stock.value less than previous
        if (i > 0 && data.allPlayers[i].stock.value < data.allPlayers[i - 1].stock.value) {
          rank++
        }
          data.allPlayers[i].rank = rank
      }
    },

    clearTotalGainLoss: function(){
      data.totalGainLoss = 0
    },

    getTotalGainLoss: function(){
      calculateTotalGainLoss()
      return data.totalGainLoss.toFixed(2)
    },

    getPlayers: function(){
      return data.allPlayers
    }
  }

})()

// UI CONTROLLER
const UIController = (function(){
  
  const DOMstrings = {
    totalTitle: '.header__value',
    tableBody: '.table-body'
  }

  return {
    getDOMstrings: function(){
      return DOMstrings
    },

    appendList: function(players){
      players.forEach(function(player){
        const obj = {
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

        const list = document.querySelector(DOMstrings.tableBody)
        const row = document.createElement('tr')

        for(let key in obj){
          // create the div with class
          let element

          switch(key){
            case 'gainLoss':
              element = document.createElement('td')
              if(obj[key] > 0){
                element.className = 'list-item positive__title ' + key
              } else {
                element.className = 'list-item negative__title ' + key
              }

              element.textContent = obj[key]
              break

            case 'ticker':
              element = document.createElement('td')
              element.className = 'list-item ' + key

              const a = document.createElement('a')
              a.setAttribute('target', '_blank')
              a.setAttribute('href', urlCall.yahooFinance + obj[key])
              a.textContent = obj[key]

              element.appendChild(a)
              break

            default:
              element = document.createElement('td')
              element.className = 'list-item ' + key
              element.textContent = obj[key]
          }

          // append div to list
          row.appendChild(element)
        }

        list.appendChild(row)
      })
    },

    clearList: function(){
      const list = document.querySelector(DOMstrings.tableBody)
      while (list.hasChildNodes()) {
          list.removeChild(list.lastChild)
      }
    }
  }

})()

// GLOBAL APP CONTROLLER
const controller = (function(listCtrl, UICtrl){
  
  const playerSetup = function(){
    // grabbed historial data from start of year from link below
    // https://finance.yahoo.com/quote/CRM/history?period1=1548828000&period2=1548828000&interval=1d&filter=history&frequency=1d

    // Deters Family
    listCtrl.addPlayer('Neal', 'Deters', 'PLUG', 69.56)
    listCtrl.addPlayer('Jeff', 'Deters', 'VGT', 367.95)
    listCtrl.addPlayer('Scott', 'Deters', 'BABA', 264.20)
    // listCtrl.addPlayer('Alex', 'Deters', 'CSCO', 45.97)
    // listCtrl.addPlayer('Caroline', 'Deters', 'DIS', 138.30)

    // Bob Schultz Family
    // listCtrl.addPlayer('Christo', 'Schultz', 'SDC', 13.39)
    listCtrl.addPlayer('Emmie', 'Schultz', 'BMBL', 67.31)

    // Jim Schultz Family
    listCtrl.addPlayer('Jamie', 'Schultz', 'XM', 52.57)
    // listCtrl.addPlayer('John', 'Schultz', 'DXC', 31.89)
    // listCtrl.addPlayer('Charlie', 'Schultz', 'YELP', 32.60)

    // Schmidt Family
    // listCtrl.addPlayer('Ryan', 'Schmidt', 'AFTPY', 88.75) // having troubles finding this in api
    listCtrl.addPlayer('Mark', 'Schmidt', 'PYPL', 259.85)
    listCtrl.addPlayer('Megan', 'Schmidt', 'RVLV', 42.54)
    listCtrl.addPlayer('Michael', 'Schmidt', 'OXY', 29.90)
    listCtrl.addPlayer('Sarah', 'Schmidt', 'SHOP', 1149.44)
    // listCtrl.addPlayer('Laura', 'Schmidt', 'AGYP', 0.39) // having troubles finding this in api

    // Jack Schultz Family
    // listCtrl.addPlayer('James', 'Schultz', 'AMD', 47.00)
    // listCtrl.addPlayer('Joseph', 'Schultz', 'MSFT', 170.23)

    // Kaldas Family
    // listCtrl.addPlayer('Nardeen', 'Kaldas', '-', null)
    // listCtrl.addPlayer('Michael', 'Kaldas', '-', null)

    // Tawdros Family
    // listCtrl.addPlayer('Jenny', 'Tawdros', '-', null)
    // listCtrl.addPlayer('Joyce', 'Tawdros', '-', null)

    // Lacksen Family
    // listCtrl.addPlayer('Katherine', 'Lacksen', 'CLF', 7.02)
    listCtrl.addPlayer('Elizabeth', 'Lacksen', 'EPD', 22.92)
    // listCtrl.addPlayer('Larry', 'Lacksen', '-', null)
    listCtrl.addPlayer('Will', 'Lacksen', 'TSLA', 889.49)

    fetchPlayerData()
  }

  const apiCall = function(ticker, url){
    return fetch(url 
      + ticker)
    .then(function(response) {
      return response.json()
    })
    .then(function(myJson) {
      return myJson
    }).catch(function(error){
      console.log(error)
    })
  }

  const getPlayerData = function(player){
    return apiCall(player.stock.ticker, urlCall.last).then(function(response){
      player.setStockPrice(response[0].price)
      player.setValue(response[0].price)
      player.setGainLoss(player.stock.value)
      player.setPercentChange()
    })
  }

  const fetchPlayerData = function(){
    // clear any previous list
    UICtrl.clearList()
    listCtrl.clearTotalGainLoss()

    const players = listCtrl.getPlayers()
    const promises = []

    players.forEach(function(player){
      promises.push(getPlayerData(player))
    })

    Promise.all(promises).then(function(values) {
      listCtrl.calculateRankings()
      UICtrl.appendList(listCtrl.getPlayers())

      const totalTitle = document.querySelector(UICtrl.getDOMstrings().totalTitle)
      const totalGainLoss = listCtrl.getTotalGainLoss()
      if(totalGainLoss > 0){
        totalTitle.innerHTML = '+ ' + totalGainLoss
        totalTitle.classList = 'header__value positive__title'
      } else {
        totalTitle.innerHTML = totalGainLoss
        totalTitle.classList = 'header__value negative__title'
      }

      setTimeout(function() {
        fetchPlayerData()
      }, 60000)
    })
  }

  // get first price open of the year
  // find numbers of shares (5000/first price)

  return {
    init: function(){
      playerSetup()
    }
  }

})(listController, UIController)

// initialize the budget app
controller.init()