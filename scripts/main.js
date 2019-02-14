
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

//api call to show first 100 coins when "coins" link is clicked
function getCoins() {
    $.ajax({
        url: 'https://api.coingecko.com/api/v3/coins/list',
        method: 'GET'
    }).done(function (d) {
        if (typeof d === 'string')
            d = JSON.parse(d);
        let coinsResults = d;

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
                            <input class="toggle toggle-class" type="checkbox" data-id="${data.id}" data-name="${data.name}">
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
    let html = '<div><img src=' + image + '></img> <p class="dollars"> $' + usd + '</p> <p class="euros"> €' + euro + '</p><p class="shekels">' + nis + ' NIS </p></div>';
    $(element).next("div").first().toggle().html(html);
}

/* // add to list of getting live reports
const liveReportsArray
function addToReports(el, id) {
    coinForLiveReport = $('#more-info-btn').prop('checked');
    if (!liveReportsArray) {
        var liveReportsArray = [];
    }
    if (liveReportsArray.length < 5) {
        liveReportsArray.push(coinForLiveReport);
        console.log('these are the coins for report', liveReportsArray);
    } else if (liveReportsArray.length == 5) {
        coinForLiveReport.prop('checked', false);
        alert('you\'ve already selected five coins and that\'s the max!')
    }
}
 */


const coins = [];
function addToReports(element) {
    console.log(element);
    var id = $(element).data("id");
    var name = $(element).data("name");
    console.log(coins.length);
    var coinListHTML = '';
    if (coins.length >= 5) {
        console.log(coins);
        $(element).prop('checked', false);

        //alert('max 5 coins');
        $.each(coins, function (index, value) {
            //currently-added-coins
            coinListHTML += `<div class="col-md-6"> ${value.name} </div> 
                            <div class="col-md-6"> 
                                    <input class="toggle ${value.id}" type="checkbox" onclick="removeCoin(this)" data-id=${value.id} data-name=${value.name} checked> 
                                </div>`;
        });
        $('.currently-added-coins').html(coinListHTML);
        $('#myModal').modal('show');
        return;
    } if (coins.length < 5) {
        var isChecked = $(element).is(':checked');
        if (isChecked) {
            //if this checkbox is checked add the coin in array
            coins.push({ 'id': id, 'name': name });
        } else {
            //if this checkbox is unchecked remove the coin from array
            // removeCoin(id,coins,element);
            for (var i = 0; i < coins.length - 1; i++) {
                if (coins[i]['id'] === id) {
                    coins.splice(i, 1);
                    //console.log(element);
                    //console.log(coins);
                } else {
                    coins.push(id);
                    //console.log(coins);
                }
            }
        }
    }
}

function removeCoin(element) {
    for (var i = 0; i < coins.length - 1; i++) {
        if (coins[i]['id'] === id) {
            coins.splice(i, 1);
            console.log(element);
            var id = $(element).data("id");
            $(id).prop('checked', false);
        }
    }
}


//parallax
$('.parallax-window').parallax({
    imageSrc: '/imgs/banner.jpg'
});

//search bar-filter coins depending on search
$('#search-btn').click(function searchBar() {
    //
    var searchInput = $('#search-input').val();
    var filter = searchInput.value.toUpperCase();
    var findCoin = (str) => {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
    search = findCoin(searchInput.val());
    var coin = coinsResults.filter(function (coin) { return coin.id == search }) ? coinArray.filter(function (coin) { return coin.id == search }).length > 0 : coin = coinArray;

    if (coin == true) {
        coin = coinsResults.filter(function (coin) { return coin.id == search });
    } else {
        coin = coinsResults;
        alert("the requested currency is not found, make sure you enter a proper name");
    }
});

//link to get report every 2 seconds
// https://www.cryptocompare.com/api/#-api-data-price


$(document).on('click', '.toggle-class', function () {
    var id = $(this).data('id');
    var name = $(this).data('name');
    var isChecked = $(this).is(':checked');

    if (coins.length == 5) {
        console.log('coin length is 5');
        if (!isChecked) {
            console.log('coin length is 5 is checked false');
            $(this).prop('checked', false);
            // turnOffCheckbox();
            removeCoin(id);
            
        } else {
            console.log('coin length is 5 is checked true');
            $(this).prop('checked', false);
            // turnOffCheckbox();
            showAlertModal();
            return;
        }
    } else if (coins.length < 5) {
        console.log('coins length < 5');
        if (isChecked) {
            //if this checkbox is checked add the coin in array
            coins.push({ 'id': id, 'name': name });
        } else {
            console.log('coins length < 5 ELSE block');
            removeCoin(id);
        }
    } else {
        console.log('else block');
        if (isChecked) {
            console.log(coins);
            $(this).prop('checked', false);
            //console.log('this is the id---->',$(this).data('id'))
            // turnOffCheckbox();
            showAlertModal();
            return;
        }
    }

});

//remove coin from array
function removeCoin(id) {
    for (var i = 0; i < coins.length; i++) {
        if (coins[i]['id'] === id) {
            console.log('COINS SPLICE');
            coins.splice(i, 1);
            //console.log(element);
            //console.log(coins);
        }
    }
}

//show a pop up to tick off certain coins
function showAlertModal() {
    var coinListHTML = '';
    $.each(coins, function (index, value) {
        coinListHTML += `<div class="col-md-6"> ${value.name} </div> 
                        <div class="col-md-6"> 
                                <input class="toggle toggle-class" type="checkbox" data-id=${value.id} data-name=${value.name} checked> 
                            </div>`;
    });
    $('.currently-added-coins').html(coinListHTML);
    $('#myModal').modal('show');
}



