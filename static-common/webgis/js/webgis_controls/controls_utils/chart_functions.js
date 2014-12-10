var chart;
function buildChart(response) {
    var jf = new OpenLayers.Format.JSON();
    var jsonString = response.responseText;
    var json = jf.read(jsonString);
    var canvas = '';

    if (json.success) {
        canvas = '<div id="typeSelection"></div><div id="placeholder"></div>';
        canvas += '<div id="toolTip"></div>';
        $('#chart_body').html(canvas);

        chart = new buildFWIChart(json, json.selected_type);
        chart.makeChart();
    } else {
        canvas = '<div id="no_chart_available" ><p>No data available for selected area.</p></div>';
        $('#chart_body').html(canvas);
    }

    $('#chart_div').show();
}



function buildSuperChart(json, selectedType) {
    this.json = json;
    this.selectedType = selectedType;
}

function makeTheChart() {
    this.chart.addChart();
    this.chart.addHover();
}


function buildFWIChart(json, selectedType) {
    this.json = json;
    this.selectedType = selectedType;
    this.chart = getFdiChartType(this.selectedType, this.json);
    this.makeChart = makeTheChart;
    this.buildbasic = makeTheChart;
    this.updateChart = updateFdiChart;
    addTitle(getTitleName(this.json, this.selectedType) + ' for latlon : ' + json.latlon);
    types = this.json.types;
    buildDropDown(types, this.selectedType);
}

buildFWIChart.prototype = new buildSuperChart(this.json, this.selectedType);


function updateChartWindow() {
    chart.updateChart($("OPTION:selected", this).val());
}


function updateFdiChart(selectedType) {

    this.selectedType = selectedType;
    addTitle(getTitleName(this.json, this.selectedType) + ' for latlon : ' + this.json.latlon);
    this.chart = getFdiChartType(this.selectedType, this.json);
    this.buildbasic();
}

function getFdiChartType(selectedType, json) {
    switch (selectedType) {
        case 'FWI':
            return   new FwiChartDisplay(json.fwi_data, json.date_data, 'FWI', json.graph_max.fwi, 'FWI Value', getColor(selectedType), false, true, true);
            break;
        case 'ISI':
            return   new FwiChartDisplay(json.isi_data, json.date_data, 'ISI', json.graph_max.isi, 'ISI Value', getColor(selectedType), false, true, true);
            break;
        case 'BUI':
            return   new FwiChartDisplay(json.bui_data, json.date_data, 'BUI', json.graph_max.bui, 'BUI Value', getColor(selectedType), false, true, true);
            break;
        case 'FFMC':
            return   new FwiChartDisplay(json.ffmc_data, json.date_data, 'FFMC', json.graph_max.ffmc, 'FFMC Value', getColor(selectedType), false, true, true);
            break;
        case 'DMC':
            return   new FwiChartDisplay(json.dmc_data, json.date_data, 'DMC', json.graph_max.dmc, 'DMC Value', getColor(selectedType), false, true, true);
            break;
        case 'DC':
            return   new FwiChartDisplay(json.dc_data, json.date_data, 'DC', json.graph_max.dc, 'DC Value', getColor(selectedType), false, true, true);
            break;
    }
}

function buildDropDown(types, selectedType) {
    var options = '';
    for (var i = 0; i < types.length; i++) {
        if (selectedType == types[i][0]) {
            options += '<option value="' + types[i][0] + '" selected="selected">' + types[i][1] + '</option>';
        } else {
            options += '<option value="' + types[i][0] + '">' + types[i][1] + '</option>';
        }
    }
    var selType = $("<select>");
    selType.html(options)
        .attr('id', 'types')
        .change(updateChartWindow)
        .appendTo("#typeSelection");

}
function getColor(selectedType) {
    switch (selectedType) {
        case 'FWI':
            return "#f35555";
            break;
        case 'BAREA':
            return "#b7b657";
            break;
        case 'NFIRE':
            return '#e2d352';
            break;
        case 'BANF':
            return '#c27522';
            break;

    }
}


function addTitle(title) {
    $("#chartTitle").html(title);
}

function getTitleName(json, selectedType) {
    for (var i = 0; i < json.types.length; i++) {
        if (selectedType == json.types[i][0]) {
            return json.types[i][1]; // + json.min_fire;
        }
    }
    return false;
}


/* class for adding chart  */

function FwiChartDisplay(data, ticks, lbString, graphMax, title, color, blBars, blLine, blPoints) {


    this.data = data;
    this.ticks = ticks;
    this.title = title;
    this.plot = null;
    this.color = color;
    this.blBars = blBars;
    this.blLine = blLine;
    this.blPoints = blPoints;
    this.lbString = lbString;
    this.graphMax = graphMax;
    this.addChart = superChart;
    this.addHover = addHoverDetails;

}

function superChart() {
    this.plot = $.plot($("#placeholder"),
        [
            {data: this.data, label: this.lbString, color: this.color}
        ],
        {xaxis: {ticks: this.ticks},
            yaxis: {min: 0, max: this.graphMax},
            selection: { mode: "xy" },
            grid: { hoverable: true, clickable: true},
            bars: { show: this.blBars, fill: true},
            lines: {show: this.blLine},
            points: {show: this.blPoints},
            legend: { position: 'sw' }
        });
    $("#placeholder").unbind();
}


function addHoverDetails() {
    var previousPoint = null;
    var ticks = this.plot.getAxes().xaxis.ticks;
    var title = this.title;
    $("#placeholder").bind("plothover", function (event, pos, item) {
        if (item) {
            if (previousPoint != item.datapoint) {
                previousPoint = item.datapoint;
                $("#tooltip").remove();
                var x = item.datapoint[0];
                var y = item.datapoint[1];
                showTooltip(item.pageX, item.pageY, title + ': ' + item.datapoint[1]);
            }
        }
        else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });
}
function showTooltip(x, y, contents) {
    $('<div id="tooltip">' + contents + '</div>').css({
        position: 'absolute',
        display: 'none',
        top: y + 5,
        left: x + 5,
        border: '1px solid #fdd',
        padding: '2px',
        'z-index': '990000',
        'background-color': '#fee',
        opacity: 0.80
    }).appendTo("body").fadeIn(200);
}

