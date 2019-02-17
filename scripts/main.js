//global variables
let modalCheckedButtons = [];
let coins = [];

//get the coins when page is loaded
$(document).ready(function () {
    getCoins();
})

$(window).ready(hideLoader);

function hideLoader() {
    $('.loader').hide();
}

function showLoader() {
    $('.loader').show();
}

//get the coins when "home" is clicked in navbar
$('#coins').click(function (e) {
    e.preventDefault();
    getCoins();
});

//initialize empty array of coins
//api call to show first 100 coins when "coins" link is clicked
function getCoins() {
    $.ajax({
        url: 'https://api.coingecko.com/api/v3/coins/list',
        method: 'GET'
    }).done(function (d) {
        if (typeof d === 'string')
            d = JSON.parse(d);
        coinsResults = d;

        //loop through the results and use the template to display each coin
        for (let i = 0; i < 100; i++) {
            let id = (coinsResults[i].id).toString();
            moreInfoData(id);
            displayMainContent(coinsResults[i]);
        }
    });
}

//display main content when function is called
function displayMainContent(data) {
    let html = `<div class="col-md-4 col-xs-12 col-sm-4"> 
        <div id="coin">
                <div class="coin-text">
                    <div class="row">
                        <div id="symbol" class="col-md-4">${data.symbol}</div>
                        <div class="col-md-5"></div>
                        <div class="col-md-3">
                            <label class="switch">
                            <input class="toggle toggle-class ${data.id}" type="checkbox" data-id="${data.id}" data-name="${data.name}" data-symbol=${data.symbol}>
                            <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div id="name">${data.name}</div>
                </div>
            <div>
                <button id="more-info-btn" class="${data.id}" onClick="showMore(this)" data-id="${data.id}" aria-expanded="false" aria-controls="collapseExample">More Info</button>
                    <div style="display: none;">

                    </div>
            </div>
        </div>
        </div>`;

    $('#each-coin').append(html);
}

//api call to get more info - set data in local storage
function moreInfoData(id) {
    $.ajax({
        url: 'https://api.coingecko.com/api/v3/coins/' + id,
        method: 'GET'
    }).done(function (resp) {
        localStorage.setItem("image" + id, resp.image.small);
        localStorage.setItem("usd" + id, resp.market_data.ath.usd);
        localStorage.setItem("eur" + id, resp.market_data.ath.eur);
        localStorage.setItem("nis" + id, resp.market_data.ath.ils);
    });
}

//show more coin info when function is called - get data from local storage
function showMore(element) {
    var id = $(element).data("id");
    let image = localStorage.getItem("image" + id);
    let euro = localStorage.getItem("eur" + id);
    let usd = localStorage.getItem("usd" + id);
    let nis = localStorage.getItem("nis" + id)
    let html = '<div><img src=' + image + '></img> <p class="dollars"> $' + usd + '</p> <p class="euros"> €' + euro + '</p><p class="shekels"> ₪' + nis + ' </p></div>';
    $(element).next("div").first().toggle().html(html);
}


// function addToReports(element) {
//     var id = $(element).data("id");
//     var name = $(element).data("name");
//     var symbol = $(element).data("symbol");
//     if (coins.length >= 5) {
//         $(element).prop('checked', false);
//         $('#myModal').modal('show');
//         return;
//     } if (coins.length < 5) {
//         var isChecked = $(element).is(':checked');
//         if (isChecked) {
//             //if this checkbox is checked, add the coin to the array
//             coins.push({ 'id': id, 'name': name, 'symbol' :symbol });
//         } else {
//             //if this checkbox is unchecked, remove the coin from array
//             for (var i = 0; i < coins.length - 1; i++) {
//                 if (coins[i]['id'] === id) {
//                     coins.splice(i, 1);
//                 } else {
//                     coins.push(id);
//                 }
//             }
//         }
//     }
// }

//remove coin from array
function removeCoin(id, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i]['id'] === id) {
            array.splice(i, 1);
        }
    }
}

//parallax
$('.parallax-window').parallax({
    imageSrc: '/imgs/banner.jpg'
});

//get symbols of chosen coins
function getSymbols() {
    var symbols = [];
    for (let i = 0; i < coins.length; i++) {
        symbols.push(coins[i].symbol.toUpperCase());
        return symbols;
    }
}

//API call to get price of multiple coins - we will do this every 2 seconds
function APIcallPrice(symbols) {
    $.ajax({
        url: 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + symbols + '&tsyms=USD',
        method: 'GET'
    }).done(function (d) {
        if (typeof d === 'string')
            d = JSON.parse(d);
        console.log(d)
    }
    )
};

//get price of coins
function getPrice(coins) {
    if (coins.length < 1) {
        alert('you havent picked any coins!');
        return;
    } else {
        let symbols = getSymbols();
        APIcallPrice(symbols);
    }
}

//function for when user clicks on the coin toggle
$(document).on('click', '.toggle-class', function () {
    var id = $(this).data('id');
    var name = $(this).data('name');
    var symbol = $(this).data("symbol");
    var isChecked = $(this).is(':checked');
    $('.' + id).prop('checked', isChecked);
    if (coins.length == 5) {
        console.log('coin length is 5');
        if (!isChecked) {
            console.log('coin length is 5 is checked false');
            $(this).prop('checked', false);
            removeCoin(id, coins);
        } else {
            console.log('coin length is 5 is checked true');
            $(this).prop('checked', false);
            //modalCheckedButtons = coins;
            for (let i = 0; i < coins.length; i++) {
                modalCheckedButtons.push(coins[i]);
            }
            showAlertModal();
            return;
        }
    } else if (coins.length < 5) {
        console.log('coins length < 5');
        if (isChecked) {
            //if this checkbox is checked add the coin to the array
            coins.push({ 'id': id, 'name': name, 'symbol': symbol });
        } else {
            console.log('coins length < 5 ELSE block');
            removeCoin(id, coins);
        }
    } else {
        console.log('else block');
        if (isChecked) {
            console.log(coins);
            $(this).prop('checked', false);
            showAlertModal();
            return;
        }
    }
});

//let user change the selected coins in the modal - this updates a new array
$(document).on('click', '.toggle-class-modal', function () {
    var id = $(this).data('id');
    var name = $(this).data('name');
    var symbol = $(this).data("symbol");
    var isChecked = $(this).is(':checked');
    $('.' + id).prop('checked', isChecked);
    if (!isChecked) {
        removeCoin(id, modalCheckedButtons);
    } else {
        modalCheckedButtons.push({ 'id': id, 'name': name, 'symbol': symbol });
    }
    console.log('modal checked btns----->', modalCheckedButtons);
    console.log('coins----->', coins);

});

// on save - coins array will be changed to the array saved in the modal
$(document).on('click', '.save-changes', function () {
    clearCoins();
    $.each(modalCheckedButtons, function (index, value) {
        coins.push(value);
    });
    hideModal();
    clearSelectedCoinsModal();
});

// on cancel-make sure each of the original coins selected are checked 
// (user may have unchecked them in modal before clicking "cancel")
$(document).on('click', '.cancel-changes', function () {
    $.each(coins, function (index, value) {
        $('.' + value.id).prop('checked', true);
    });
    hideModal();
    clearSelectedCoinsModal();
});

//show a pop up to tick off certain coins
function showAlertModal() {
    var coinListHTML = '';
    $.each(coins, function (index, value) {
        coinListHTML += `<div class="col-md-6"> ${value.name} </div> 
                        <div class="col-md-6"> 
                                <input class="toggle toggle-class-modal" type="checkbox" data-id=${value.id} data-name=${value.name} checked> 
                            </div>`;
    });
    $('.currently-added-coins').html(coinListHTML);
    showModal();
}

//empty the array of coins selected in the modal
function clearSelectedCoinsModal() {
    modalCheckedButtons = [];
}

//empty the array of coins selected
function clearCoins() {
    coins = [];
}

//hide the modal
function hideModal() {
    $('#myModal').modal('hide');
}

//show the modal
function showModal() {
    $('#myModal').modal('show');
}