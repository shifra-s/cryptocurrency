//global variables
let modalCheckedButtons = [];
let coins = [];

//get coins only when page is loaded-including imgs
$(window).on('load', function () {
    getCoins();
});

$(window).ready(hideLoader);

//parallax
$('.parallax-window').parallax({
    imageSrc: '/imgs/banner.jpg'
});

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

$('#live-reports').click(function () {
    if (coins.length < 1) {
        alert('you havent picked any coins!');
        return;
    }
    else {
        $('#each-coin').hide();
        $('#chartContainer').show();
        APIcallPrice(coins);
    }
});

//use second link to get coins since third link doesn't have most coins
function APIcallPrice(coins) {
    let objArr1 = [];
    let objArr2 = [];
    let objArr3 = [];
    let objArr4 = [];
    let objArr5 = [];
    for (let i = 0; i < coins.length; i++) {
        let id = coins[i].id;
        let symbol = coins[i].symbol;
        //console.log(id);
        //console.log('symbol', symbol);
        
        // updateData(id, (resp, err) => {
            
        //     if(!err) {
        //         console.log("resp here: ",resp);
        //         objArr.push(resp);
        //     } else {console.log("error", err);}
            ``
        // });
        window.setInterval(() => {
            if (coins[0] !== 'undefined') {
                updateData(id, (resp, err) => {
                    console.log('resp here: ',resp);
                    objArr1.push(resp);
                });
            }
            if (coins[1] !== 'undefined') {
                updateData(id, (resp, err) => {
                    console.log('resp here: ',resp);
                    objArr2.push(resp);
                });
            }
            if (coins[2] !== 'undefined') {
                updateData(id, (resp, err) => {
                    console.log('resp here: ',resp);
                    objArr3.push(resp);
                });
            }
            if (coins[3] !== 'undefined') {
                updateData(id, (resp, err) => {
                    console.log('resp here: ',resp);
                    objArr4.push(resp);
                });
            }
            if (coins[4] !== 'undefined') {
                updateData(id, (resp, err) => {
                    console.log('resp here: ',resp);
                    objArr5.push(resp);
                });
            }
            
            console.log("new object", objArr1, objArr2, objArr3, objArr4, objArr5);
            displayGraph(objArr1, objArr2, objArr3, objArr4, objArr5);
        }, 20000);
       
    }
}

// function msToTime(duration) {
//     //var milliseconds = parseInt((duration % 1000) / 100),
//       seconds = parseInt((duration / 1000) % 60),
//       minutes = parseInt((duration / (1000 * 60)) % 60),
//       hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  
//     hours = (hours < 10) ? "0" + hours : hours;
//     minutes = (minutes < 10) ? "0" + minutes : minutes;
//     seconds = (seconds < 10) ? "0" + seconds : seconds;
  
//     return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
//   }

function updateData(id, callback) {
        $.ajax({
            url: 'https://api.coingecko.com/api/v3/coins/' + id,
            method: 'GET'
        }).done(function (resp) {
                let price = resp.market_data.ath.usd;
                
                //let convert = msToTime(time);

                let newObj = {};
                newObj['y'] = price;
                //newObj['x'] = time;
                callback(newObj);
        });
}

function displayGraph(graphObj1, graphObj2, graphObj3, graphObj4, graphObj5) {
    let date = new Date();
    let time = date.setTime(date.getTime() + 30000);
    graphObj1.push({x: time});
    graphObj2.push({x: time});
    graphObj3.push({x: time});
    graphObj4.push({x: time});
    graphObj5.push({x: time});
    var options = {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Coin Value Over Time"
        },
        subtitles: [{
            text: "Click Legend to Hide or Unhide Data Series"
        }],
        axisX: {
            title: "Time"
        },
        axisY: {
            title: "Coin Value",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
            includeZero: false
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "spline",
            xValueType: "dateTime",
            name: "Units Sold",
            showInLegend: true,
            xValueFormatString: "hh:mm:ss TT",
            yValueFormatString: "$###.00",
            dataPoints: graphObj1 || []
        },
        {
            type: "spline",
            xValueType: "dateTime",
            name: "Units Sold",
            showInLegend: true,
            xValueFormatString: "hh:mm:ss TT",
            yValueFormatString: "$###.00",
            dataPoints: graphObj2 || []
        },
        {
            type: "spline",
            xValueType: "dateTime",
            name: "Units Sold",
            showInLegend: true,
            xValueFormatString: "hh:mm:ss TT",
            yValueFormatString: "$###.00",
            dataPoints: graphObj3 || []
        },
        {
            type: "spline",
            xValueType: "dateTime",
            name: "Units Sold",
            showInLegend: true,
            xValueFormatString: "hh:mm:ss TT",
            yValueFormatString: "$###.00",
            dataPoints: graphObj4 || []
        },
        {
            type: "spline",
            xValueType: "dateTime",
            name: "Profit",
            axisYType: "secondary",
            showInLegend: true,
            xValueFormatString: "hh:mm:ss TT",
            yValueFormatString: "$###.00",
            dataPoints: graphObj5 || []
        }]
    };
    //options.data[0].dataPoints.push(graphObj)
    $("#chartContainer").CanvasJSChart(options);
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

//show the modal that was built
function showAlertModal() {
    buildModal();
    showModal();
}

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


