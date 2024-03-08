document.addEventListener("DOMContentLoaded", function () {
  var data = {};

  load_data()
    .then((rows) => {
      data = rows;
      console.log('DATA', data);
      init();
    })
    .catch((error) => {
      console.error("Hubo un error al cargar los datos:", error);
    });

  function ocultarLoader() {
    document.getElementById("loader").style.display = "none";
  }

  function init() {
    ocultarLoader();

    let chartData = Object.values(data);

    let values = chartData.map((item) => item.value);
    let minValue = Math.min(...values);
    let maxValue = Math.max(...values);

    let root = am5.Root.new("chartdiv");

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "translateY",
        // minZoomLevel: 1,
        // maxZoomLevel: 24,
        projection: am5map.geoMercator(),
        layout: root.verticalLayout,
      })
    );

    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    chart.geodata = am5geodata_worldLow;

        
    // chart.set('tooltipHTML', function (text, target) {
    //   if (target.dataItem) {
    //     const dataItem = target.dataItem
    //     console.log(dataItem);
    //     let divTool = `<div class="tooltip"><p class="titu">Emisiones de GEI</p><p class='data'><span class='punto'>&#9679</span><span class='anio'>{name}:</span> {value} t de CO2</p></div>`;

    //     return divTool
    //   }

    //   return text
    // })

    let includedCountries = new Set(chartData.map((country) => country.id));

    let excludeCountries = am5geodata_worldLow.features
      .map((feature) => feature.id)
      .filter((code) => !includedCountries.has(code));

    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        valueField: "value",
        calculateAggregates: true,
        exclude: excludeCountries,
      })
    );

    polygonSeries.data.setAll(chartData);

    polygonSeries.mapPolygons.template.states.create("hover", {
      stroke: am5.color("#8e3b18"),
      strokeWidth: 1,
    });

    polygonSeries.set("heatRules", [
      {
        target: polygonSeries.mapPolygons.template,
        dataField: "value",
        min: am5.color("#dadada"),
        max: am5.color("#ff7b03"),
        key: "fill",
      },
    ]);

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}: {value}",
      tooltipPosition: "pointer",
      interactive: false,
    });
    //------------------------------------------------------------------------------------
    let tooltip = am5.Tooltip.new(root, {
      labelText: "[bold fontSize: 13px textAlign:center]Emisiones de CO2[/]\n[bold fontSize: 13px textAlign:center]{name}: {value} t de CO2[/]",
      getFillFromSprite: false,
      autoTextColor: false,
    });

    tooltip.label.adapters.add("tooltipHTML", function (text, target) {
      const dataItem = target.dataItem;
      text = "";

      if (dataItem && dataItem.dataContext) {
        let content = `[bold underline fontSize: 13px textAlign:center]Emisiones de CO2[/]\n\n`;
        content += `[bold fontSize: 13px textAlign:center]{name}: {value}[/]\n\n`;
        // for (let i = 0; i < dataItem.dataContext.years.length; i += 3) {
        //   const year1 = dataItem.dataContext.years[i];
        //   const year2 = dataItem.dataContext.years[i + 1];
        //   const year3 = dataItem.dataContext.years[i + 2];

        //   content += `[#252323 fontWeight:600 fontSize: 13px]${
        //     year1.year
        //   }:[/] [#252323 fontWeight:400 fontSize: 13px]${year1.value.toFixed(2)}[/]`;

        //   if (year2) {
        //     content += `    [#252323 fontWeight:600 fontSize: 13px]${
        //       year2.year
        //     }:[/] [#252323 fontWeight:400 fontSize: 13px]${year2.value.toFixed(
        //       2
        //     )}[/]`;
        //   }

        //   if (year3) {
        //     content += `    [#252323 fontWeight:600 fontSize: 13px]${
        //       year3.year
        //     }:[/] [#252323 fontWeight:400 fontSize: 13px]${year3.value.toFixed(
        //       2
        //     )}[/]`;
        //   }

        //   content += "\n";
        // }
        return content;
      }
      return text;
    });

    polygonSeries.mapPolygons.template.set("tooltipPosition", "pointer");
    polygonSeries.mapPolygons.template.set("tooltip", tooltip);

    tooltip.set(
      "background",
      am5.Rectangle.new(root, {
        opacity: 1,
        fill: am5.color(0xffffff),
        fillOpacity: 0.8,
        strokeWidth: 1,
        stroke: am5.color(0x000000),
      })
    );

    tooltip.label.setAll({
      fill: am5.color("#000000"),
      textAlign: "center",
    });

    //------------------------------------------------------------------------------------
    let heatLegend = chart.children.push(
      am5.HeatLegend.new(root, {
        orientation: "vertical",
        startColor: am5.color("#dadada"),
        endColor: am5.color("#ff7b03"),
        startText: `${minValue.toFixed(2)}t de CO2`,
        endText: `${maxValue.toFixed(2)}t de CO2`,
        stepCount: 10,
        width: am5.percent(100),
        centerY: am5.percent(60),
        // centerX: am5.percent(50),
        x: am5.percent(85),
        y: am5.percent(50),
        stroke: am5.color("#ffffff"),
        strokeWidth: 2,
      })
    );

    heatLegend.startLabel.setAll({
      fontSize: 10,
      // fill: heatLegend.get("startColor"),
      fill: am5.color("#000000"),
      textAlign: 'left',
    });
    
    heatLegend.endLabel.setAll({
      fontSize: 10,
      textAlign: 'left',
      // fill: heatLegend.get("endColor"),
      fill: am5.color("#000000"),
    });

    polygonSeries.events.on("datavalidated", function () {
      heatLegend.set("startValue", minValue);
      heatLegend.set("endValue", maxValue);
    });

    polygonSeries.set("heatLegend", heatLegend);

    polygonSeries.events.on("datavalidated", function () {
      polygonSeries.mapPolygons.each(function (polygon) {
        polygon.events.on("pointerover", function (event) {
          var dataItem = event.target.dataItem;
          if (dataItem) {
            var value = dataItem.dataContext.value;
            heatLegend.showValue(value);
          }
        });
      });
    });
    //------------------------------------------------------------------------------------
    // let topContainer = chart.children.push(
    //   am5.Container.new(root, {
    //     layout: root.horizontalLayout,
    //     width: am5.percent(100),
    //     height: 50,
    //     y: 2,
    //     x: 0,
    //     centerX: am5.percent(0),
    //     marginLeft: 1000,
    //   })
    // );

    // var leftContainer = topContainer.children.push(
    //   am5.Container.new(root, {
    //     width: am5.percent(50),
    //     height: am5.percent(100),
    //     layout: root.horizontalLayout,
    //   })
    // );

    //------------------------------------------------------------------------------------
    // am5.ready(function () {
    //   btn_download(root, topContainer);
    //   btn_share(root, topContainer);
    //   btn_full_screen(root, topContainer);
    // });
    //------------------------------------------------------------------------------------
  }
});
