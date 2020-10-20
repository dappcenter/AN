var tronWeb;
var currentAddr;
var pyropressContract;

window.onload = function() {
    if (!window.tronWeb) {
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider('https://api.trongrid.io');
        const solidityNode = new HttpProvider('https://api.trongrid.io');
        const eventServer = 'https://api.trongrid.io/';

        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer,);
        window.tronWeb = tronWeb;
    }
    once();
};

async function once() {
    tronWeb = window.tronWeb;
    pyropressContract = await tronWeb.contract().at("TS8foCJND6bxXfHbgZdGWMsaKrDHsJUum2");
    userdbContract = await tronWeb.contract().at("TDYMu6JZWqyp4gZpAz28UEcYg3bJVEV4fC");

    currentAddr = tronWeb.defaultAddress['base58'];
    console.log(currentAddr);
          
    setTimeout(function() {}, 2000);
    setInterval(function() {usernameLoop();}, 2000);
}

function usernameLoop() {
    getLoggedInUsername();
}

function getLoggedInUsername() {
    currentAddr = tronWeb.defaultAddress['base58'];
    userdbContract.getNameByAddress(currentAddr).call().then(result => {
        console.log(result)
        var loggedInUser = result.name.toString();
        
        if (loggedInUser == "") {
            $('.arcTag').text("Welcome, Player!")
        } else {
            $('.arcTag').text("Welcome, " + result.name + "!")
        }
        document.getElementsByClassName("arcTag").className = "text-white";
    }).catch((err) => {
        console.log(err)
    });
}

function compoundDividends() {
    pyropressContract.compoundDividends().send().then(result => {
        console.log(result)
        $('#tx-readout').text(result)
        document.getElementById("tx-readout").className = "text-white";
    }).catch((err) => {
        console.log(err)
    });
}