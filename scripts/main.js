
//global variables - initialize empty array of coins & empty of array of btns checked in the modal
let modalCheckedButtons = [];
let coins = [];

//get coins only when page is loaded-including imgs
$(window).on('load', function () {
    getCoins();
});

//get the coins when "home" is clicked in navbar
$('#coins').click(function (e) {
    e.preventDefault();
    $('#each-coin').empty();
    getCoins();
});

//api call to show first 100 coins when "coins" link is clicked
function getCoins() {

    $('#loading').show();
    $.ajax({
        url: 'https://api.coingecko.com/api/v3/coins/list',
        method: 'GET'
    }).done(function (d) {
        if (typeof d === 'string')
            d = JSON.parse(d);
        coinsResults = d;

        let id = '';
        //loop through the results and use the template to display each coin
        for (let i = 0; i < 100; i++) {
            id = (coinsResults[i].id).toString();
            moreInfoData(id);
            displayMainContent(coinsResults[i]);

            for (let i = 0; i < coins.length; i++) {
                if (id == coins[i].id) {
                    $('.' + id).prop('checked', true);

                }
            }
        }

        $('#loading').hide();

    });
}

function checkReportsList(id) {
    console.log('id its gettttinggg when checking---->', id);
    //check if coin is in list of coins for reports and if so tick on
    for (let i = 0; i < coins.length; i++) {
        if (id == coins[i].id) {
            $('.' + id).prop('checked', true);
            console.log('checking if shold get report');
        } else {
            $('.' + id).prop('checked', false);
        }
    }
}

//display main content when function is called
function displayMainContent(data, d) {
    if (d) {
        data = d;
    }
    
    let html = `<div class="col-lg-4 col-md-4 col-xs-12 col-sm-4"> 
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

$("#coins").on("click", function () {
    $('#chartContainer').hide();
    $('#about-page-content').hide();
    $('#each-coin').show();
});


//empty page on search click
function emptyContent() {
    $('#each-coin').empty();
}

//search button on click
$("#search-btn").on("click", function () {
    $('#loading').show();
    emptyContent();
    searchForCoin();
});

//find coin where symbol equals symbol searched
function searchForCoin() {
    let searchedCoin = '';
    $.ajax('https://api.coingecko.com/api/v3/coins/list').done(function (d) {
        for (let i = 0; i < 100; i++) {
            if (d[i].symbol == $("#search-input").val()) {
                searchedCoin = d[i].id;
                break;
            }
        }
        if (searchedCoin !== '') {
            displayCoin(searchedCoin);
        } else {
            $('#loading').hide();
            emptyContent();
            swal('no coin found!');
        }
    })
}

//display coin
function displayCoin(searchedCoin) {
    let id = searchedCoin;
    $.ajax({
        url: 'https://api.coingecko.com/api/v3/coins/' + id,
        method: 'GET'
    }).done(function (d) {
        if (typeof d === 'string')
            d = JSON.parse(d);

        console.log(d, 'this is dataaaa');

        displayMainContent(d);

        for (let i = 0; i < coins.length; i++) {
            if (searchedCoin == coins[i].id) {
                $('.' + id).prop('checked', true);
            }
        }
        $('#loading').hide();
    });
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

//remove coin from array
function removeCoin(id, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i]['id'] === id) {
            array.splice(i, 1);
        }
    }
}

//get symbols of chosen coins
function getSymbols() {
    var symbols = [];
    for (let i = 0; i < coins.length; i++) {
        symbols.push(coins[i].symbol.toUpperCase());
        return symbols;
    }
}

//go to the live reports page if at least one coin is selected
$('#live-reports').click(function () {
    if (coins.length < 1) {
        swal({
            title: "You haven't picked any coins!",
            text: "Please select at least one coin in order to view live reports",
            icon: "error"
        });

        return;
    }
    else {
        $('#loading').show();
        $('#each-coin').hide();
        $('#about-page-content').hide();
        $('#chartContainer').show();
        defineDataPoints(coins);
    }
});

//use second link to get coins since third link doesn't have most coins
//define data points for graph
function defineDataPoints(coins) {
    let dataPoints = [];
    let dataPoints2 = [];
    let dataPoints3 = [];
    let dataPoints4 = [];
    let dataPoints5 = [];
    let chart = displayGraph(dataPoints, dataPoints2, dataPoints3, dataPoints4, dataPoints5);
    for (let i = 0; i < coins.length; i++) {
        let updateChart = function () {
            if (typeof (coins[0]) !== 'undefined') {
                let id = coins[0].id;
                let symbol = coins[0].symbol;
                getCoinValue(id, (resp, err) => {
                    dataPoints.push(resp);
                });
            }
            if (typeof (coins[1]) !== 'undefined') {
                let id = coins[1].id;
                let symbol = coins[1].symbol;
                getCoinValue(id, (resp, err) => {
                    dataPoints2.push(resp);
                });
            }
            if (typeof (coins[2]) !== 'undefined') {
                let id = coins[2].id;
                let symbol = coins[2].symbol;
                getCoinValue(id, (resp, err) => {
                    dataPoints3.push(resp);
                });
            }
            if (typeof (coins[3]) !== 'undefined') {
                let id = coins[3].id;
                let symbol = coins[3].symbol;
                getCoinValue(id, (resp, err) => {
                    dataPoints4.push(resp);
                });
            }
            if (typeof (coins[4]) !== 'undefined') {
                let id = coins[4].id;
                let symbol = coins[4].symbol;
                getCoinValue(id, (resp, err) => {
                    dataPoints5.push(resp);
                });
            }
            chart.render();
            $('#loading').hide();
        };

        // update chart every 2 seconds
        setInterval(function () { updateChart() }, 2000);
    }
}

//get coin value
function getCoinValue(id, callback) {
    $.ajax({
        url: 'https://api.coingecko.com/api/v3/coins/' + id,
        method: 'GET'
    }).done(function (resp) {
        let price = resp.market_data.ath.usd;
        let date = new Date();
        let time = date.setTime(date.getTime() + 30000);

        let newObj = {};
        newObj['y'] = price;
        newObj['x'] = time;
        callback(newObj);
    });
}

//display the graph
function displayGraph(dataPoints, dataPoints2, dataPoints3, dataPoints4, dataPoints5) {
    let chart = new CanvasJS.Chart("chartContainer", {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Live Reports of Cryptocurrency Value"
        },
        axisX: {
            title: "Time",
            intervalType: "minute",
            valueFormatString: "hh:mm:ss tt",
        },
        axisY: {
            title: "Coin Value",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
            includeZero: false,
            prefix: "$",
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "line",
            xValueType: "dateTime",
            name: coins[0].name + "(" + coins[0].symbol + ")",
            xValueFormatString: "hh:mm:ss TT",
            yValueFormatString: "##.00mn",
            showInLegend: typeof (coins[0]) !== "undefined" ? true : false,
            dataPoints: dataPoints
        },
        {
            type: "line",
            xValueType: "dateTime",
            name: typeof (coins[1]) !== "undefined" ? coins[1].name + "(" + coins[1].symbol + ")" : "",
            xValueFormatString: "hh:mm:ss TT",
            yValueFormatString: "##.00mn",
            showInLegend: typeof (coins[1]) !== "undefined" ? true : false,
            dataPoints: dataPoints2
        },
        {
            type: "line",
            xValueType: "dateTime",
            name: typeof (coins[2]) !== "undefined" ? coins[2].name + "(" + coins[2].symbol + ")" : "",
            xValueFormatString: "hh:mm:ss TT",
            yValueFormatString: "##.00mn",
            showInLegend: typeof (coins[2]) !== "undefined" ? true : false,
            dataPoints: dataPoints3
        },
        {
            type: "line",
            xValueType: "dateTime",
            name: typeof (coins[3]) !== "undefined" ? coins[3].name + "(" + coins[3].symbol + ")" : "",
            xValueFormatString: "hh:mm:ss TT",
            yValueFormatString: "##.00mn",
            showInLegend: typeof (coins[3]) !== "undefined" ? true : false,
            dataPoints: dataPoints4
        },
        {
            type: "line",
            xValueType: "dateTime",
            name: typeof (coins[4]) !== "undefined" ? coins[4].name + "(" + coins[4].symbol + ")" : "",
            xValueFormatString: "hh:mm:ss TT",
            yValueFormatString: "##.00mn",
            showInLegend: typeof (coins[4]) !== "undefined" ? true : false,
            dataPoints: dataPoints5
        },
        ]
    });

    chart.render();

    return chart;
}

function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    } else {
        e.dataSeries.visible = true;
    }

    e.chart.render();
}

//function for when user clicks on the coin toggle
$(document).on('click', '.toggle-class', function () {
    var id = $(this).data('id');
    var name = $(this).data('name');
    var symbol = $(this).data("symbol");
    var isChecked = $(this).is(':checked');
    $('.' + id).prop('checked', isChecked);
    if (coins.length == 5) {
        if (!isChecked) {
            $(this).prop('checked', false);
            removeCoin(id, coins);
        } else {
            $(this).prop('checked', false);
            //modalCheckedButtons = coins;
            for (let i = 0; i < coins.length; i++) {
                modalCheckedButtons.push(coins[i]);
            }
            showAlertModal();
            return;
        }
    } else if (coins.length < 5) {
        if (isChecked) {
            //if this checkbox is checked add the coin to the array
            coins.push({ 'id': id, 'name': name, 'symbol': symbol });
        } else {
            removeCoin(id, coins);
        }
    } else {
        if (isChecked) {
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

//build modal
function buildModal() {
    var coinListHTML = '';
    $.each(coins, function (index, value) {
        coinListHTML += `<div class="col-md-6"> ${value.name} </div> 
                        <div class="col-md-6"> 
                                <input class="toggle toggle-class-modal" type="checkbox" data-id=${value.id} data-name=${value.name} checked> 
                            </div>`;
    });
    $('.currently-added-coins').html(coinListHTML);
}

//show the modal that was built
function showAlertModal() {
    buildModal();
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

$('#about').click(function () {
    $('#chartContainer').hide();
    $('#each-coin').hide();
    $('#about-page-content').show();
})
