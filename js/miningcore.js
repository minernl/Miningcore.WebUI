// --------------------------------------------------------------------------------------------
// Current running domain url will be used.
// Change the WebURL, API and/or stratumAddress to your own site if this is different to the current domain.
// You can check this in the browser development view F12 - Console 
var WebURL         = window.location.protocol + "//" + window.location.hostname + "/";  // Website URL is:  https://domain.com/
var API            = WebURL + "api/";   												// API address is:  https://domain.com/api/
var stratumAddress = "stratum+tcp://" + window.location.hostname + ":";                 // basic stratum address is:  stratum+tcp://domain.com:
//
// --------------------------------------------------------------------------------------------



// no need to change anything below here
// --------------------------------------------------------------------------------------------
console.log('MiningCore.WebUI : ', WebURL);			// Returns website URL
console.log('API address used : ', API);            // Returns API URL
console.log('Stratum address  : ', stratumAddress); // Returns Stratum URL

console.log('Page Load        : ', window.location.href); // Returns full URL

currentPage = "index"

$("#load-wallet2").on("click", function(event) {
  if ($("#walletAddress").val().length > 0) {
    localStorage.setItem(currentPool + "-walletAddress", $("#walletAddress").val() );
  }
  var coin = window.location.hash.split(/[#/?]/)[1];
  var currentPage = window.location.hash.split(/[#/?]/)[2] || "stats";
  window.location.href = "#" + currentPool + "/" + currentPage + "?address=" + $("#walletAddress").val();
  event.preventDefault();
});


function loadWallet() {
  console.log( 'Loading wallet address:',$("#walletAddress").val() );
  if ($("#walletAddress").val().length > 0) {
    localStorage.setItem(currentPool + "-walletAddress", $("#walletAddress").val() );
  }
  var coin = window.location.hash.split(/[#/?]/)[1];
  var currentPage = window.location.hash.split(/[#/?]/)[2] || "stats";
  window.location.href = "#" + currentPool + "/" + currentPage + "?address=" + $("#walletAddress").val();
	
	
}



// private function
function _formatter(value, decimal, unit) {
  if (value === 0) {
    return "0 " + unit;
  } else {
    var si = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
      { value: 1e21, symbol: "Z" },
      { value: 1e24, symbol: "Y" }
    ];
    for (var i = si.length - 1; i > 0; i--) {
      if (value >= si[i].value) {
        break;
      }
    }
    return ((value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + " " + si[i].symbol + unit);
  }
}


function convertLocalDateToUTCDate(date, toUTC) {
  date = new Date(date);
  //Local time converted to UTC
  var localOffset = date.getTimezoneOffset() * 60000;
  var localTime = date.getTime();
  if (toUTC) {
    date = localTime + localOffset;
  } else {
    date = localTime - localOffset;
  }
  newDate = new Date(date);
  return newDate;
}


function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    var localOffset = date.getTimezoneOffset() / 60;
    var hours = date.getUTCHours();
    newDate.setHours(hours - localOffset);
    return newDate;
}

function scrollPageTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  var elmnt = document.getElementById("page-scroll-top");
  elmnt.scrollIntoView();
}

function doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
     
    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}

function loadIndex() {
  $("div[class^='page-").hide();
  
  $(".page").hide();
  //$(".page-header").show();
  $(".page-wrapper").show();
  $(".page-footer").show();
  
  var hashList = window.location.hash.split(/[#/?=]/);
  //var fullHash = document.URL.substr(document.URL.indexOf('#')+1);   //IE
  // example: #vtc/dashboard?address=VttsC2.....LXk9NJU
  currentPool    = hashList[1];
  currentPage    = hashList[2];
  currentAddress = hashList[3];
  
  if (currentPool && !currentPage)
  {
    currentPage ="stats"
  }
  else if(!currentPool && !currentPage)
  {
    currentPage ="index";
  }
  if (currentPool && currentPage) {
    loadNavigation();
    $(".main-index").hide();
	$(".main-pool").show();
	$(".page-" + currentPage).show();
	$(".main-sidebar").show();

  } else {
    $(".main-index").show();
	$(".main-pool").hide();
	$(".page-index").show();
    $(".main-sidebar").hide();

  }
  
  if (currentPool) {
	$("li[class^='nav-']").removeClass("active");
    
	switch (currentPage) {
      case "stats":
	    console.log('Loading stats page content');
	    $(".nav-stats").addClass("active");
        loadStats();
        break;
      case "dashboard":
	    console.log('Loading dashboard page content');
        $(".nav-dashboard").addClass("active");
		loadDashboard();
        break;
	  case "miners":
	    console.log('Loading miners page content');
        $(".nav-miners").addClass("active");
		loadMinersList();
        break;
      case "blocks":
	    console.log('Loading blocks page content');
	    $(".nav-blocks").addClass("active");
        loadBlocksList();
        break;
      case "payments":
	    console.log('Loading payments page content');
	    $(".nav-payments").addClass("active");
        loadPaymentsList();
        break;
      case "connect":
	    console.log('Loading connect page content');
        $(".nav-connect").addClass("active");
		loadConnectConfig();
        break;
	  case "faq":
	    console.log('Loading faq page content');
        $(".nav-faq").addClass("active");
        break;
      case "support":
	    console.log('Loading support page content');
        $(".nav-support").addClass("active");
        break;
      default:
      
    }
  } else {
    loadIndexPage();
  }
  scrollPageTop();
  // $("html, body").animate({ scrollTop: 0 }, "slow");
}


function loadStats() {
  clearInterval();
  setInterval(
    (function load() {
      loadStatsData();
      return load;
    })(),
    60000
  );
  setInterval(
    (function load() {
      loadStatsChart();
      return load;
    })(),
    600000
  );
}


function loadNavigation() {
  return $.ajax(API + "pools")
    .done(function(data) {
	  var coinLogo = "";
	  var coinName = "";
	  var poolList = "<ul class='navbar-nav '>";
      $.each(data.pools, function(index, value) {
		poolList += "<li class='nav-item'>";
        poolList += "  <a href='#" + value.id.toLowerCase() + "' class='nav-link coin-header" + (currentPool == value.id.toLowerCase() ? " coin-header-active" : "") + "'>"
		poolList += "  <img  src='img/coin/icon/" + value.coin.type.toLowerCase() + ".png' /> " + value.coin.type;
        poolList += "  </a>";
		poolList += "</li>";
		if (currentPool === value.id) {
			coinLogo = "<img style='width:40px' src='img/coin/icon/" + value.coin.type.toLowerCase() + ".png' />";
			coinName = value.coin.name;
			if (typeof coinName === "undefined" || coinName === null) {
				coinName = value.coin.type;
			} 
		}
      });
      poolList += "</ul>";
	  
      if (poolList.length > 0) {
        $(".coin-list-header").html(poolList);
      }
	  
	  var sidebarList = "";
	  const sidebarTemplate = $(".sidebar-template").html();
      sidebarList += sidebarTemplate
		.replace(/{{ coinId }}/g, currentPool)
		.replace(/{{ coinLogo }}/g, coinLogo)
		.replace(/{{ coinName }}/g, coinName)
      $(".sidebar-wrapper").html(sidebarList);
  
      $("a.link").each(function() {
	    if (localStorage[currentPool + "-walletAddress"] && this.href.indexOf("/dashboard") > 0)
	    {
		  this.href = "#" + currentPool + "/dashboard?address=" + localStorage[currentPool + "-walletAddress"];
	    } 
      });

    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadNavigation)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}


function loadDashboard() {
  function render() {
    clearInterval();
    setInterval(
      (function load() {
        loadDashboardData($("#walletAddress").val());
        loadDashboardWorkerList($("#walletAddress").val());
        loadDashboardChart($("#walletAddress").val());
        return load;
      })(),
      60000
    );
  }
  var walletQueryString = window.location.hash.split(/[#/?]/)[3];
  if (walletQueryString) {
    var wallet = window.location.hash.split(/[#/?]/)[3].replace("address=", "");
    if (wallet) {
      $(walletAddress).val(wallet);
      localStorage.setItem(currentPool + "-walletAddress", wallet);
      render();
    }
  }

  if (localStorage[currentPool + "-walletAddress"]) {
    $("#walletAddress").val(localStorage[currentPool + "-walletAddress"]);
  }
}


function loadIndexPage() {
  console.log('Loading index page content');
  return $.ajax(API + "pools")
    .done(function(data) {
      var poolList = "";
      const poolCoinCardTemplate = $(".index-coin-card-template").html();
	  //const poolCoinTableTemplate = "";  //$(".index-coin-table-template").html();
	  
	  var poolCoinTableTemplate = "";
		
      $.each(data.pools, function(index, value) {
        var connectPoolConfig = "";
        $.each(value.ports, function(port, options) {
          connectPoolConfig += "<div><i class='ti-plug'></i> " + stratumAddress + port;
           if (
             typeof options.varDiff !== "undefined" &&
             options.varDiff != null
           ) {
             connectPoolConfig +=
               "   --> Variable " + options.varDiff.minDiff + " &harr; ";
             if (
               typeof options.varDiff.maxDiff === "undefined" ||
               options.varDiff.maxDiff == null
             ) {
               connectPoolConfig += "&infin;";
             } else {
               connectPoolConfig += options.varDiff.maxDiff;
             }
           } else {
             connectPoolConfig += "  --> Static / " + options.difficulty;
           }
          connectPoolConfig += "</div>";
        });
		
        var coinLogo = "<img style='width:40px' src='img/coin/icon/" + value.coin.type.toLowerCase() + ".png' />";
		var coinName = value.coin.name;
		if (typeof coinName === "undefined" || coinName === null) {coinName = value.coin.type;} 
        poolList += "" + poolCoinCardTemplate
            .replace(/{{ coinName }}/g, coinName)
            .replace(/{{ coinId }}/g, value.id.toLowerCase())
            .replace(/{{ aglorithm }}/g, value.coin.algorithm)
            .replace(/{{ coinLogo }}/g, coinLogo)
            .replace(/{{ miningMethod }}/g, value.miningMethod)
            .replace(/{{ poolHashrate }}/g, _formatter(value.poolStats.poolHashrate, 5, "H/s"))
            .replace(/{{ minerCount }}/g, value.poolStats.connectedMiners)
            .replace(/{{ minimumPayout }}/g, value.paymentProcessing.minimumPayment)
            .replace(/{{ coinType }}/g, value.coin.type)
            .replace(/{{ connection }}/g, connectPoolConfig)
            .replace(/{{ poolFee }}/g, value.poolFeePercent + "%")
            .replace(/{{ networkHashrate }}/g, _formatter(value.networkStats.networkHashrate, 5, "H/s"))
            .replace(/{{ networkDiff }}/g, _formatter(value.networkStats.networkDifficulty, 5, ""))
		+ "";
		
		
		poolCoinTableTemplate += "<tr class='coin-table-row' href='#" + value.id.toLowerCase() + "'>";
		poolCoinTableTemplate += "<td class='coin'><a href='#" + value.id.toLowerCase() + "'<span>" + coinLogo + "<b> " + coinName + "</b></span></a></td>";
		poolCoinTableTemplate += "<td class='algo'>" + value.coin.algorithm + "</td>";
		poolCoinTableTemplate += "<td class='miners'>" + value.poolStats.connectedMiners + "</td>";
		poolCoinTableTemplate += "<td class='pool-hash'>" + _formatter(value.poolStats.poolHashrate, 5, "H/s") + "</td>";
		poolCoinTableTemplate += "<td class='fee'>" + value.poolFeePercent + " %</td>";
		poolCoinTableTemplate += "<td class='net-hash'>" + _formatter(value.networkStats.networkHashrate, 5, "H/s") + "</td>";
		poolCoinTableTemplate += "<td class='net-diff'>" + _formatter(value.networkStats.networkDifficulty, 5, "") + "</td>";
		poolCoinTableTemplate += "<td class='card-btn col-hide'>Go Mine " + coinLogo + coinName + "</td>";
		poolCoinTableTemplate += "</tr>";
		
		
      });

      if (poolList.length > 0) {
        $(".index-main").html(poolList);
       
		
		$(".pool-coin-table").html(poolCoinTableTemplate);
      }
	  
	  
	  $(document).ready(function() {
        $('#pool-coins tr').click(function() {
          var href = $(this).find("a").attr("href");
          if(href) {
            window.location = href;
          }
        });
      });
	  
	  
	  
	  
	  
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadPools)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}


function loadStatsData() {
  return $.ajax(API + "pools")
    .done(function(data) {
      $.each(data.pools, function(index, value) {
        if (currentPool === value.id) {
          $("#poolShares").text(_formatter(value, 0, ""));
          $("#poolBlocks").text(_formatter(value, 0, ""));
          $("#poolMiners").text(value.poolStats.connectedMiners + " Miner(s)");
          $("#poolHashRate").text(_formatter(value.poolStats.poolHashrate, 5, "H/s"));
          $("#networkHashRate").text(_formatter(value.networkStats.networkHashrate, 5, "H/s"));
          $("#networkDifficulty").text(_formatter(value.networkStats.networkDifficulty, 5, ""));
        }
      });
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadStatsData)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}


function loadStatsChart() {
  return $.ajax(API + "pools/" + currentPool + "/performance")
    .done(function(data) {
      labels = [];
	  
	  poolHashRate = [];
      networkHashRate = [];
      networkDifficulty = [];
      connectedMiners = [];
      connectedWorkers = [];
      
	  
      $.each(data.stats, function(index, value) {
        if (labels.length === 0 || (labels.length + 1) % 4 === 1) {
          var createDate = convertLocalDateToUTCDate(new Date(value.created),false);
          labels.push(createDate.getHours() + ":00");
        } else {
          labels.push("");
        }
		poolHashRate.push(value.poolHashrate);
        networkHashRate.push(value.networkHashrate);
		networkDifficulty.push(value.networkDifficulty);
        connectedMiners.push(value.connectedMiners);
        connectedWorkers.push(value.connectedWorkers);
      });
	  
	  var dataPoolHash          = {labels: labels,series: [poolHashRate]};
      var dataNetworkHash       = {labels: labels,series: [networkHashRate]};
      var dataNetworkDifficulty = {labels: labels,series: [networkDifficulty]};
      var dataMiners            = {labels: labels,series: [connectedMiners,connectedWorkers]};
	  
	  var options = {
		height: "200px",
        showArea: false,
        seriesBarDistance: 1,
        // low:Math.min.apply(null,networkHashRate)/1.1,
        axisX: {
          showGrid: false
        },
        axisY: {
          offset: 47,
          scale: "logcc",
          labelInterpolationFnc: function(value) {
            return _formatter(value, 1, "");
          }
        },
        lineSmooth: Chartist.Interpolation.simple({
          divisor: 2
        })
      };
	  
      var responsiveOptions = [
        [
          "screen and (max-width: 320px)",
          {
            axisX: {
              labelInterpolationFnc: function(value) {
                return value[1];
              }
            }
          }
        ]
      ];
      Chartist.Line("#chartStatsHashRate", dataNetworkHash, options, responsiveOptions);
      Chartist.Line("#chartStatsHashRatePool",dataPoolHash,options,responsiveOptions);
      Chartist.Line("#chartStatsDiff", dataNetworkDifficulty, options, responsiveOptions);
      Chartist.Line("#chartStatsMiners", dataMiners, options, responsiveOptions);
 
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadStatsChart)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}


function loadDashboardData(walletAddress) {
  return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress)
    .done(function(data) {
      $("#pendingShares").text(_formatter(data.pendingShares, 0, ""));
      var workerHashRate = 0;
      if (data.performance) {
        $.each(data.performance.workers, function(index, value) {
          workerHashRate += value.hashrate;
        });
      }
      $("#minerHashRate").text(_formatter(workerHashRate, 5, "H/s"));
      $("#pendingBalance").text(_formatter(data.pendingBalance, 5, ""));
      $("#paidBalance").text(_formatter(data.todayPaid, 5, ""));
      $("#lifetimeBalance").text(_formatter(data.pendingBalance + data.totalPaid, 5, "")
      );
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadDashboardData)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}


function loadDashboardWorkerList(walletAddress) {
  return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress)
    .done(function(data) {
      var workerList = "";
      if (data.performance) {
        var workerCount = 0;
        $.each(data.performance.workers, function(index, value) {
          workerCount++;
          workerList += "<tr>";
          workerList += "<td>" + workerCount + "</td>";
          if (index.length === 0) {
            workerList += "<td>Unnamed</td>";
          } else {
            workerList += "<td>" + index + "</td>";
          }
          workerList += "<td>" + _formatter(value.hashrate, 5, "H/s") + "</td>";
          workerList +=
            "<td>" + _formatter(value.sharesPerSecond, 5, "S/s") + "</td>";
          workerList += "</tr>";
        });
      } else {
        workerList += '<tr><td colspan="4">None</td></tr>';
      }
      $("#workerCount").text(workerCount);
      $("#workerList").html(workerList);
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadDashboardWorkerList)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}


function loadDashboardChart(walletAddress) {
  return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/performance")
    .done(function(data) {

		labels = [];
        minerHashRate = [];
		
        $.each(data, function(index, value) {
          if (labels.length === 0 || (labels.length + 1) % 4 === 1) {
            var createDate = convertLocalDateToUTCDate(
              new Date(value.created),
              false
            );
            labels.push(createDate.getHours() + ":00");
          } else {
            labels.push("");
          }
          var workerHashRate = 0;
          $.each(value.workers, function(index2, value2) {workerHashRate += value2.hashrate;});
          minerHashRate.push(workerHashRate);
        });
        var data = {labels: labels,series: [minerHashRate]};
        var options = {
          height: "200px",
		  showArea: true,
		  seriesBarDistance: 1,
          axisX: {
            showGrid: false
          },
          axisY: {
            offset: 47,
            labelInterpolationFnc: function(value) {
              return _formatter(value, 1, "");
            }
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 2
          })
        };
        var responsiveOptions = [
          [
          "screen and (max-width: 320px)",
          {
            axisX: {
              labelInterpolationFnc: function(value) {
                return value[0];
              }
            }
          }
        ]
        ];
        Chartist.Line("#chartDashboardHashRate", data, options, responsiveOptions);

    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadDashboardChart)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}


function loadMinersList() {
  return $.ajax(API + "pools/" + currentPool + "/miners?page=0&pagesize=20")
    .done(function(data) {
      var minerList = "";
      if (data.length > 0) {
        $.each(data, function(index, value) {
          minerList += "<tr>";
          //minerList +=   "<td>" + value.miner + "</td>";
		  minerList +=   '<td>' + value.miner.substring(0, 12) + ' &hellip; ' + value.miner.substring(value.miner.length - 12) + '</td>';
          //minerList += '<td><a href="' + value.minerAddressInfoLink + '" target="_blank">' + value.miner.substring(0, 12) + ' &hellip; ' + value.miner.substring(value.miner.length - 12) + '</td>';
          minerList += "<td>" + _formatter(value.hashrate, 5, "H/s") + "</td>";
          minerList += "<td>" + _formatter(value.sharesPerSecond, 5, "S/s") + "</td>";
          minerList += "</tr>";
        });
      } else {
        minerList += '<tr><td colspan="4">No miner connected</td></tr>';
      }
      $("#minerList").html(minerList);
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadMinersList)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}


function loadBlocksList() {
  return $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=100")
    .done(function(data) {
      var blockList = "";
      if (data.length > 0) {
        $.each(data, function(index, value) {
		  var createDate = convertLocalDateToUTCDate(new Date(value.created),false);
          var effort = Math.round(value.effort * 100);
          var effortClass = "";
          if (effort < 30) {
            effortClass = "effort1";
          } else if (effort < 80) {
            effortClass = "effort2";
          } else if (effort < 110) {
            effortClass = "effort3";
          } else {
            effortClass = "effort4";
          }

          blockList += "<tr>";
          blockList += "<td>" + createDate + "</td>";
          blockList += "<td><a href='" + value.infoLink + "' target='_blank'>" + value.blockHeight + "</a></td>";
          if (typeof value.effort !== "undefined") {
            blockList += "<td class='" + effortClass + "'>" + effort + "%</td>";
          } else {
            blockList += "<td>n/a</td>";
          }
          var status = value.status;
          blockList += "<td>" + status + "</td>";
          blockList += "<td>" + _formatter(value.reward, 5, "") + "</td>";
          blockList += "<td><div class='c100 small p" + Math.round(value.confirmationProgress * 100) + "'><span>" + Math.round(value.confirmationProgress * 100) + "%</span><div class='slice'><div class='bar'></div><div class='fill'></div></div></div></td>";
          blockList += "</tr>";
        });
      } else {
        blockList += '<tr><td colspan="6">No blocks found yet</td></tr>';
      }

      $("#blockList").html(blockList);
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadBlocksList)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}


function loadPaymentsList() {
  return $.ajax(API + "pools/" + currentPool + "/payments?page=0&pageSize=500")
    .done(function(data) {
      var paymentList = "";
      if (data.length > 0) {
        $.each(data, function(index, value) {
          var createDate = convertLocalDateToUTCDate(new Date(value.created),false);
          paymentList += '<tr>';
          paymentList +=   "<td>" + createDate + "</td>";
          paymentList +=   '<td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 12) + ' &hellip; ' + value.address.substring(value.address.length - 12) + '</td>';
          paymentList +=   '<td>' + _formatter(value.amount, 5, '') + '</td>';
          paymentList +=   '<td colspan="2"><a href="' + value.transactionInfoLink + '" target="_blank">' + value.transactionConfirmationData.substring(0, 16) + ' &hellip; ' + value.transactionConfirmationData.substring(value.transactionConfirmationData.length - 16) + ' </a></td>';
          paymentList += '</tr>';
        });
      } else {
        paymentList += '<tr><td colspan="4">No payments found yet</td></tr>';
      }
      $("#paymentList").html(paymentList);
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadPaymentsList)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}


function loadConnectConfig() {
  return $.ajax(API + "pools")
    .done(function(data) {
      var connectPoolConfig = "";
      var defaultPort = "";
      var stratum = "<table class='table stratums'>";
      $.each(data.pools, function(index, value) {
        if (currentPool === value.id) {
          defaultPort = Object.keys(value.ports)[0];
          $.each(value.ports, function(port, options) {
            stratum += "<tr><td class='url'>" + stratumAddress + port + "</td><td>" + options.name + "</td></tr>";
		  });
          connectPoolConfig = populateConnectEnglish(value);
		  coinType = value.coin.type.toLowerCase();
		 
        }
      });
      stratum += "<tr><td></td><td></td></tr></table>";
      connectPoolConfig += "</tbody>";
      $("#connectPoolConfig").html(connectPoolConfig);
	  
	  $("#miner-config").html("");
      $("#miner-config").load("poolconfig/" + coinType + ".html",
        function( response, status, xhr ) {
          if ( status == "error" ) {
			$("#miner-config").load("poolconfig/default.html",
			  function(responseText){
				var config = $("#miner-config")
                .html()
				.replace(/{{ stratumAddress }}/g, stratumAddress + defaultPort)
				.replace(/{{ stratum }}/g, stratum);
				$(this).html(config);  
			  }
			);
		  } else {
			var config = $("#miner-config")
            .html()
            .replace(/{{ stratumAddress }}/g, stratumAddress + defaultPort)
            .replace(/{{ stratum }}/g, stratum);
            $(this).html(config);
		  }
        }
      );
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadConnectConfig)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}

function populateConnectEnglish(value) {
  var connectPoolConfig = "<tr><td>Algorithm</td><td>" + value.coin.algorithm + "</td></tr>";
  connectPoolConfig += '<tr><td>Wallet Address</td><td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 12) + " &hellip; " + value.address.substring(value.address.length - 12) + "</a></td></tr>";
  connectPoolConfig += "<tr><td>Payout Scheme</td><td>" + value.paymentProcessing.payoutScheme + "</td></tr>";
  connectPoolConfig += "<tr><td>Minimum Payment</td><td>" + value.paymentProcessing.minimumPayment + "</td></tr>";
  if (typeof value.paymentProcessing.minimumPaymentToPaymentId !== "undefined") {
    connectPoolConfig += "<tr><td>Minimum Payout (to Exchange)</td><td>" + value.paymentProcessing.minimumPaymentToPaymentId + "</td></tr>";
  }
  connectPoolConfig += "<tr><td>Pool Fee</td><td>" + value.poolFeePercent + "%</td></tr>";
  $.each(value.ports, function(port, options) {
    connectPoolConfig += "<tr><td>Port " + port + " Difficulty</td><td>";
    if (typeof options.varDiff !== "undefined" && options.varDiff != null) {
      connectPoolConfig += options.varDiff.minDiff + " &harr; ";
      if (typeof options.varDiff.maxDiff === "undefined" || options.varDiff.maxDiff == null) {
        connectPoolConfig += "&infin; / Variable";
      } else {
        connectPoolConfig += "Variable / " + options.varDiff.maxDiff;
      }
    } else {
      connectPoolConfig += "Static / " + options.difficulty;
    }
    connectPoolConfig += "</td></tr>";
  });
  return connectPoolConfig;
}
