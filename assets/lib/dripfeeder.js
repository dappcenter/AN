var contractAddress = "TFWJv27iwgsksn6Jq2ZmSyUiEEJ9qrWLjk"; // NEW CONTRACT DailyRoi
// var contractAddress = "TP5G3LNE41681w12qWHdNonCtXY73g8E8H"; // OLD C3T CONTRACT. Blecch!

var userdbAddress="TDYMu6JZWqyp4gZpAz28UEcYg3bJVEV4fC"; // User DB
var dripFeederContract;
var userTokenBalance;
var account;
var prev_account;
async function loadTronWeb() {
    if (typeof(window.tronWeb) === "undefined") {
        setTimeout(loadTronWeb, 1000)
    } else {
        dripFeederContract = await tronWeb.contract().at(contractAddress);
        userdbContract = await tronWeb.contract().at(userdbAddress);
        setTimeout(function() {startLoop()}, 1000)
        setInterval(function() {main();}, 2000);
    }
}

function main() {
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

window.addEventListener("load", function() {
    loadTronWeb();
    
    $(".invest-button").click(function() {
        var _0x45f9x7 = tronWeb.toSun($(".invest-input").val());
        dripFeederContract.buy(getCookie("masternode").split(";")[0]).send({
            callValue: _0x45f9x7
        }).then((_0x45f9x9) => {
            $(".invest-input").val(0)
        }).catch((_0x45f9x8) => {
            console.log(_0x45f9x8)
        })
    });
    
    $(".withdraw-button").click(function() {
        dripFeederContract.withdraw().send().then((_0x45f9x9) => {}).catch((_0x45f9x8) => {
            console.log(_0x45f9x8)
        })
    })
    
    
});

function startLoop() {
    refreshData();
    setTimeout(startLoop, 3000)
}

function refreshData() {updateUserInformation()}

function updateUserInformation() {
    dripFeederContract.checkInvestments(tronWeb.defaultAddress.base58).call().then((result) => {
        var userEarnRate = sunToDisplay(parseInt(result / 30)).toFixed(2);
        var userInvestments = sunToDisplay(parseInt(result));
        $("#your-invest").html(userInvestments)
        $("#your-earn-rate").html(userEarnRate)
    }).catch((err) => {
        console.log(err)
    });
    
    dripFeederContract.getDividends(tronWeb.defaultAddress.base58).call().then((_0x45f9x9) => {
        var _0x45f9xe = sunToDisplay(parseInt(_0x45f9x9));
        $("#your-dividends").html(_0x45f9xe)
    }).catch((_0x45f9x8) => {
        console.log(_0x45f9x8)
    });
    
    dripFeederContract.getBalance(tronWeb.defaultAddress.base58).call().then((_0x45f9x9) => {
        var _0x45f9xe = sunToDisplay(parseInt(_0x45f9x9));
        $("#your-balance").html(_0x45f9xe)
    }).catch((_0x45f9x8) => {
        console.log(_0x45f9x8)
    });

    $("#reflink").val("https://arcadium.network/daily.html?masternode=" + tronWeb.defaultAddress.base58)
}

function checkwallet() {
    var _0x45f9x10 = $("#thewallet").val();
    if (_0x45f9x10.length == 34) {
        for (i = 1; i <= 4; i++) {
            $(".f" + i).show()
        };
        account = _0x45f9x10;
        localStorage.setItem("wallet", account)
    } else {
        account = 0
    }
}

function sunToDisplay(_0x45f9x12) {
    return formatTrxValue(tronWeb.fromSun(_0x45f9x12))
}

function formatTrxValue(_0x45f9x14) {
    return parseFloat(parseFloat(_0x45f9x14).toFixed(6))
}

function getQueryVariable(_0x45f9x16) {
    var _0x45f9x17 = window.location.search.substring(1);
    var _0x45f9x18 = _0x45f9x17.split("&");
    for (var _0x45f9x19 = 0; _0x45f9x19 < _0x45f9x18.length; _0x45f9x19++) {
        var _0x45f9x1a = _0x45f9x18[_0x45f9x19].split("=");
        if (_0x45f9x1a[0] == _0x45f9x16) {
            return _0x45f9x1a[1]
        }
    };
    return (false)
}

function translateQuantity(_0x45f9x1c, _0x45f9x1d) {
    _0x45f9x1c = Number(_0x45f9x1c);
    finalquantity = _0x45f9x1c;
    modifier = "";
    if (_0x45f9x1d == undefined) {_0x45f9x1d = 0};
    if (_0x45f9x1c < 1000000) {_0x45f9x1d = 0};
    if (_0x45f9x1c > 1000000) {
        modifier = M;
        finalquantity = _0x45f9x1c / 1000000
    };
    if (_0x45f9x1c > 1000000000) {
        modifier = B;
        finalquantity = _0x45f9x1c / 1000000000
    };
    if (_0x45f9x1c > 1000000000000) {
        modifier = T;
        finalquantity = _0x45f9x1c / 1000000000000
    };
    if (_0x45f9x1d == 0) {finalquantity = Math.floor(finalquantity)};
    return finalquantity.toFixed(_0x45f9x1d) + modifier
}

function showAlert(_0x45f9x1f, _0x45f9x20) {
    if (tronWeb.defaultAddress.base58) {
        console.log(info);
    } else {
        swal({
            title: M,
            text: _0x45f9x20,
            type: info,
            allowOutsideClick: true
        })
    }
}