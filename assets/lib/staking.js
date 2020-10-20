async function run() {
    var abi = [
      {
        constant: true,
        inputs: [
          {
            internalType: 'address',
            name: '_user',
            type: 'address'
          }
        ],
        name: 'allInfoFor',
        outputs: [
          {
            internalType: 'uint256',
            name: 'totalTokenSupply',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'totalTokensFrozen',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'userBalance',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'userFrozen',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'userDividends',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: true,
        inputs: [
          {
            internalType: 'address',
            name: '_user',
            type: 'address'
          }
        ],
        name: 'balanceOf',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [],
        name: 'collect',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            internalType: 'uint256',
            name: '_tokens',
            type: 'uint256'
          }
        ],
        name: 'freeze',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            internalType: 'address',
            name: '_to',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: '_tokens',
            type: 'uint256'
          }
        ],
        name: 'transfer',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            internalType: 'address',
            name: '_to',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: '_tokens',
            type: 'uint256'
          },
          {
            internalType: 'bytes',
            name: '_data',
            type: 'bytes'
          }
        ],
        name: 'transferAndCall',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: false,
        inputs: [
          {
            internalType: 'uint256',
            name: '_tokens',
            type: 'uint256'
          }
        ],
        name: 'unfreeze',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];
    var address = 'TMCMPzmosnQ8UAYW1zcBwjLTxDq8ce4Y5e';
    var FNB = await tronWeb.contract().at(address);

    var requestAbi = [
      {
        constant: false,
        inputs: [],
        name: 'request',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];

    var tumblerAbi = [
      {
        constant: false,
        inputs: [
          {
            internalType: 'uint256',
            name: '_runs',
            type: 'uint256'
          }
        ],
        name: 'tumble',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];

    var faucetAddress = 'TMeMGbAJErRPvrZo1LMDneLDg2VVqg6jN2';

    function init() {

      setInterval(()=>{
        update()
      },3000)

      $('#freezeToggle .nav-link').click(function () {
        $('#freezeToggle .nav-link').removeClass('active');
        $(this).addClass('active');
        var toggle = $(this).attr('toggle');
        $('.freeze, .unfreeze').hide();
        $('.' + toggle).show();
      });

      $('#transfer').click(async function (event) {
        event.preventDefault();
        var amount = parseInt($('#transferAmount').val());
        let value = amount.toString() + "000000";
        var to = $('#transferReceiver').val();
        if (amount > 0 && to.length == 34) {
          try {
            await FNB.transfer(to, value).send();
          } catch (err) {
            console.error(err)
          }
        }
      });

      $('#freeze').click(async function (event) {
        event.preventDefault();
        var amount = parseInt($('#freezeAmount').val());
        let value = amount.toString() + "000000";
        console.log(value)
        if (amount > 0) {
          try {
            await FNB.freeze(value).send();
          } catch (err) {
            console.error(err)
          }
        }
      });

      $('#unfreeze').click(async function (event) {
        event.preventDefault();
        var amount = parseInt($('#unfreezeAmount').val());
        let value = amount.toString() + "000000";
        console.log(value)
        if (amount > 0) {
          try {
            await FNB.unfreeze(value).send();
          } catch (err) {
            console.error(err)
          }
        }
      });

      $('#withdraw').click(function () {
        FNB.collect().send(function (error, hash) {
          if (!error) {
            console.log(hash);
          } else {
            console.log(error);
          }
        });
      });

      $('#request').click(function () {
        Request.request().send(function (error, hash) {
          if (!error) {
            console.log(hash);
          } else {
            console.log(error);
          }
        });
      });

      $('#tumble').click(function () {
        Tumbler.tumble(10, function (error, hash) {
          if (!error) {
            console.log(hash);
          } else {
            console.log(error);
          }
        });
      });

      setTimeout(update, 500);
    }

    function update() {
      var account =
        tronWeb.defaultAddress !== undefined && tronWeb.defaultAddress.base58 !== undefined
          ? tronWeb.defaultAddress.base58
          : null;
      FNB.allInfoFor(account).call(function (error, info) {
        if (!error) {
          console.log(info);
          $('#totalSupply').text(
            formatNumber(parseFloat(info.totalTokenSupply / 1e6), 5)
          );
          $('#totalFrozen').text(
            formatNumber(parseFloat(info.totalTokensFrozen / 1e6), 5)
          );
          $('.myTokens').text(
            formatNumber(parseFloat(info.userBalance / 1e6), 5)
          );
          $('.myFrozen').text(
            formatNumber(parseFloat(info.userFrozen / 1e6), 5)
          );
          $('#myDividends').text(
            formatNumber(parseFloat(info.userDividends / 1e6), 5)
          );
          $('#withdrawAmount').text(
            formatNumber(parseFloat(info.userDividends / 1e6), 5)
          );
          FNB.balanceOf(faucetAddress).call(function (error, balance) {
            if (!error) {
              $('#faucetBalance').text(
                formatNumber(parseFloat(balance) / 1e6, 5)
              );
              tronWeb.trx.getBalance(account, function (error, balance) {
                if (!error) {
                  $('#myPastBalance').text(
                    formatNumber(parseFloat(balance) / 1e6, 5)
                  );
                } else {
                  console.log(error);
                }
              });
            } else {
              console.log(error);
            }
          });
        } else {
          console.log(error);
        }
      });
    }

    function log10(val) {
      return Math.log(val) / Math.log(10);
    }

    function formatNumber(n, maxDecimals) {
      var zeroes = Math.floor(log10(Math.abs(n)));
      var postfix = '';
      if (zeroes >= 9) {
        postfix = 'B';
        n /= 1e9;
        zeroes -= 9;
      } else if (zeroes >= 6) {
        postfix = 'M';
        n /= 1e6;
        zeroes -= 6;
      }

      zeroes = Math.min(maxDecimals, maxDecimals - zeroes);

      return (
        n.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: Math.max(zeroes, 0)
        }) + postfix
      );
    }
    $(document).ready(init);
  }

  let waitForTronWeb=function(){
    if(window.tronWeb===undefined){
      setTimeout(waitForTronWeb,500);
    }
    else{
      run();
    }
  }
  waitForTronWeb();
