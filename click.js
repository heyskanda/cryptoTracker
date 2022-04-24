var pointer = document.querySelector('[data-dropdown-content]');

document.querySelector('.dropdown').addEventListener('click', e => {
    pointer.style.pointerEvents = 'visible';
});

function codeOperation(currency) {  

    const HISTORICAL_DATA = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${currency}&tsym=USD&limit=6`;
    const MARKET_CAP = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${currency}&tsyms=USD`;
    const CURRENT_PRICE = `https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=USD`;

    /**
     * Returns json parsed response from API
     * 
     * @param {string} url String with URL
     * @returns json response
     */

    async function fetchAPIData(url){

        try{
            let response = await fetch(url);
            return await response.json();
        }

        catch(error){
            console.log(error);
        }

    }

    /**
     * Stores the opening price of ETH of the last 7 days
     * 
     * @returns array with price of ETH at different points
     */

    async function processHistoricalData(){

        let data = await fetchAPIData(HISTORICAL_DATA);
        let storeData = [];
        
        data.Data.Data.forEach(item => {
            storeData.push(item.open);
        });
        
        return storeData;

    }

    async function processCurrentPrice(){

        let price = await fetchAPIData(CURRENT_PRICE);
        
        document.getElementById('cryptoPrice').innerHTML = `$ ${price.USD}`;

        return;

    }

    processCurrentPrice();

    async function tradingViewChart(){

        let weeklyPrice = await processHistoricalData();

        var weeklyChange = document.getElementById('percentageChange');

        function calculateWeeklyChange(){

            var calculateChange = ((weeklyPrice[0] - weeklyPrice[weeklyPrice.length - 1]) * 100) / weeklyPrice[0];
            weeklyChange.innerHTML = Math.abs(calculateChange.toFixed(2)) + '%';

        }

        if(weeklyPrice[0] < weeklyPrice[weeklyPrice.length - 1]){
            weeklyChange.style.color = 'rgba(50, 205, 50, 0.7)';
        }

        else{
            weeklyChange.style.color = 'rgba(255, 0, 0, 1)';
        }

        calculateWeeklyChange();

        return;

    }

    tradingViewChart();

    async function calculateMarketCap(){

        let data = await fetchAPIData(MARKET_CAP);

        document.getElementById('marketCapValue').innerHTML = data.DISPLAY[currency].USD.MKTCAP;

    }

    calculateMarketCap();
        
}

window.addEventListener('load', e => {
    
    codeOperation('ETH');

});

document.getElementById('content').addEventListener('click', e => {

    var cryptoObject = {
        'BTC': 'bitcoin',
        'BNB': 'binance',
        'SOL': 'solana',
        'ADA': 'cardano',
        'DOT': 'polkadot',
        'FTM': 'fantom'
    };

    var mainDropdownSection = document.getElementById('ETH').innerHTML;
    
    Object.keys(cryptoObject).forEach(key => {

        if(e.target.matches(`#${key}`)){
            
            var childDropdownSection = document.getElementById(`${key}`).innerHTML;

            document.querySelector('.dropdownButton').innerHTML = childDropdownSection;
            document.getElementById(`${key}`).innerHTML = mainDropdownSection;
        
            codeOperation(`${key}`);
            
            document.getElementById('binance').href = `https://www.binance.com/en/trade/${key}_usdt`;
            document.getElementById('ftx').href = `https://ftx.com/en/trade/${key}/USDT`;
            document.getElementById('coinbase').href = `https://www.coinbase.com/price/${cryptoObject[key]}`;
            document.getElementById('kucoin').href = `https://www.kucoin.com/trade/${key}-USDT`;

        }
    });

});






































