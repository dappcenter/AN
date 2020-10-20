var contractAddress="TE9pXX8vtJ6z3EFardwcd2eeeFBB4SaTHT"; // Current HourGlass
var userdbAddress="TDYMu6JZWqyp4gZpAz28UEcYg3bJVEV4fC"; // User DB
var p3TronContract;
var userTokenBalance;
var account;
var prev_account;

async function loadTronWeb(){
    if( typeof (window.tronWeb)=== 'undefined'){
        setTimeout(loadTronWeb,1000)
    } else {
        p3TronContract = await tronWeb.contract().at(contractAddress);
        userdbContract = await tronWeb.contract().at(userdbAddress);
        setTimeout(function(){startLoop()},1000)
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

window.addEventListener("load",function() {
    loadTronWeb();
    
    // buy input
    $(".buy-input").change(function(){
        var txValue=$(this).val();
        p3TronContract.calculateTokensReceived(tronWeb.toSun(txValue)).call().then((result)=>{
            var buyAmount=parseInt(result)/ (Math.pow(10,18));
            $('.token-input-buy').val(formatTrxValue(buyAmount))
        }).catch((error)=>{console.log(error)})
    });
    
    // sell input
    $(".sell-input").change(function(){
        var _sellInput=$(this).val();
        _sellInput= tronWeb.toHex((_sellInput* (Math.pow(10,18))));
        p3TronContract.calculateTronReceived(_sellInput).call().then((result)=>{
            var sellAmount=sunToDisplay(parseInt(result));
            $(".token-input-sell").val(sellAmount)
        }).catch((error)=>{console.log(error)})
    });
    
    // buy token button
    $(".buy-token-button").click(function(){
        var buyTotal=tronWeb.toSun($(".buy-input").val());
        p3TronContract.buy(getCookie("masternode").split(";")[0]).send({
            callValue:buyTotal
        }).then((result)=>{
            $(".buy-input").val(0);
            $(".buy-input").trigger("change")
        }).catch((error)=>{console.log(error)})
    });
    
    // sell-token-btn.click
    $(".sell-token-button").click(function(){
        var sellTotal=$(".sell-input").val();
        sellTotal= tronWeb.toHex((sellTotal * (Math.pow(10,18))));
        p3TronContract.sell(sellTotal).send().then((result)=>{
            $(".sell-input").val(0);
            $(".token-input-sell").val("0.00000000")
        }).catch((error)=>{console.log(error)})
    });
    
    // sell-token-btn.click
    $(".transfer-token-button").click(function(){
        var transferTotal=$(".transfer-input").val();
        var recipientAddr=$(".recipient-input").val();
        transferTotal= tronWeb.toHex((transferTotal * (Math.pow(10,18))));
        p3TronContract.transfer(recipientAddr, transferTotal).send().then((result)=>{
            $(".transfer-input").val(0);
            $(".recipient-input").val("Recipient Address...")
        }).catch((error)=>{console.log(error)})
    });

    $(".btn-reinvest").click(function(){p3TronContract.reinvest().send().then((result)=>{}).catch((error)=>{console.log(error)})});
    $(".btn-withdraw").click(function(){p3TronContract.withdraw().send().then((result)=>{}).catch((error)=>{console.log(error)})});
});

function startLoop(){
    refreshData();
    setTimeout(startLoop,3000)
}

function refreshData(){
    updateUserInformation();
    updateNetworkInformation()
}

function updateNetworkInformation(){
    p3TronContract.totalTronBalance().call().then((result)=>{
        var TRXBalance=sunToDisplay(parseInt(result));
        $("#contract-trx-balance").html(TRXBalance)
    }).catch((error)=>{console.log(error)});
    
    p3TronContract.totalSupply().call().then((result)=>{
        var C3TBalance=parseInt(result)/ (Math.pow(10,18));
        $("#contract-token-balance").html(formatTrxValue(C3TBalance))
    }).catch((error)=>{console.log(error)});
    
    p3TronContract.calculateTokensReceived(tronWeb.toSun(1)).call().then((result)=>{
        var RateToBuy=parseInt(result)/ (Math.pow(10,18));
        RateToBuy= 1/ RateToBuy;
        $("#rate-to-buy").html(formatTrxValue(RateToBuy))
    }).catch((error)=>{console.log(error)});
    
    tronWeb.trx.getBalance(tronWeb.defaultAddress.base58).then((_0xbc13x14)=>{
        var BalanceDisplay=sunToDisplay(parseInt(_0xbc13x14));
        $("#user-wallet-balance").html(BalanceDisplay)
    }).catch((error)=>console.error(error));

    p3TronContract.calculateTronReceived(""+ (Math.pow(10,18))).call().then((result)=>{
        var _0xbc13x16=sunToDisplay(parseInt(result));
        $("#rate-to-sell").html(_0xbc13x16)
    }).catch((error)=>{console.log(error)})
}

function updateUserInformation(){
    p3TronContract.balanceOf(tronWeb.defaultAddress.base58).call().then((result)=>{
        var balanceVar=parseInt(result)/ (Math.pow(10,18));
        userTokenBalance= balanceVar;
        $(".user-token-balance").html(formatTrxValue(balanceVar));
        p3TronContract.calculateTronReceived(result).call().then((result)=>{
            var _0xbc13x19=sunToDisplay(parseInt(result));
            $("#user-trx-balance").html(_0xbc13x19);
            $.ajax({
                url:"https://min-api.cryptocompare.com/data/price?fsym=TRX&tsyms=USD",success:function(_0xbc13x1a){
                    $("#user-usd-balance").html(parseFloat(parseFloat(_0xbc13x19* _0xbc13x1a.USD).toFixed(2)))
                }
            })
        }).catch((error)=>{console.log(error)})
    }).catch((error)=>{console.log(error)});
    
    p3TronContract.myDividends(true).call().then((result)=>{
        var _0xbc13x1b=sunToDisplay(parseInt(result));
        $(".user-dividends").html(_0xbc13x1b);
        $.ajax({
            url:"https://min-api.cryptocompare.com/data/price?fsym=TRX&tsyms=USD",success:function(_0xbc13x1a){
                $("#user-dividends-usd").html(parseFloat(parseFloat(_0xbc13x1b* _0xbc13x1a.USD).toFixed(2)))
            }
        })
        
        p3TronContract.calculateTokensReceived(result).call().then((result)=>{
            var _0xbc13x1c=parseInt(result)/ (Math.pow(10,18));
            $("#user-reinvest").html(formatTrxValue(_0xbc13x1c))
        }).catch((error)=>{console.log(error)})
    }).catch((error)=>{console.log(error)});
    $("#reflink").val("https://arcadium.network/divs.html?masternode=" + tronWeb.defaultAddress.base58)
}

function checkwallet(){
    var _0xbc13x1e=$("#thewallet").val();
    if(_0xbc13x1e.length== 34){
        for(i= 1;i<= 4;i++){$(".f" + i).show()};
        account= _0xbc13x1e;
        localStorage.setItem("wallet",account)
    } else {account= 0}
}

function sunToDisplay(_0xbc13x20){return formatTrxValue(tronWeb.fromSun(_0xbc13x20))}
function formatTrxValue(_0xbc13x22){return parseFloat(parseFloat(_0xbc13x22).toFixed(2))}

function getQueryVariable(_0xbc13x24){
    var _0xbc13x25=window.location.search.substring(1);
    var _0xbc13x26=_0xbc13x25.split("&");
    for(
        var _0xbc13x27=0;
        _0xbc13x27< _0xbc13x26.length;
        _0xbc13x27++
    ){
        var _0xbc13x28=_0xbc13x26[_0xbc13x27].split("=");
        if(_0xbc13x28[0]== _0xbc13x24){return _0xbc13x28[1]}
    };
    return (false)
}

function translateQuantity(_0xbc13x2a,_0xbc13x2b){
    _0xbc13x2a= Number(_0xbc13x2a);
    finalquantity= _0xbc13x2a;
    modifier= "";
    if(_0xbc13x2b== undefined){_0xbc13x2b=0};
    if(_0xbc13x2a< 1000000){_0xbc13x2b=0};
    if(_0xbc13x2a> 1000000){
        modifier= "M";
        finalquantity= _0xbc13x2a/ 1000000
    };
    
    if(_0xbc13x2a> 1000000000){
        modifier= "B";
        finalquantity= _0xbc13x2a/ 1000000000
    };
    
    if(_0xbc13x2a> 1000000000000){
        modifier= "T";
        finalquantity= _0xbc13x2a/ 1000000000000
    };
    
    if(_0xbc13x2b== 0){finalquantity= Math.floor(finalquantity)};
    return finalquantity.toFixed(_0xbc13x2b)+ modifier
}