document.addEventListener("DOMContentLoaded", function () {
  var data = {};

  load_data()
    .then((rows) => {
      data = rows;
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
        projection: am5map.geoMercator(),
        layout: root.verticalLayout,
      })
    );

    chart.geodata = am5geodata_worldLow;

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
      stroke: am5.color("#C43E3E"),
      strokeWidth: 2,
    });

    polygonSeries.set("heatRules", [
      {
        target: polygonSeries.mapPolygons.template,
        dataField: "value",
        min: am5.color("#ABBABA"),
        max: am5.color("#C43E3E"),
        key: "fill",
      },
    ]);

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}: {value}",
      tooltipPosition: "pointer",
      interactive: true,
    });
    //------------------------------------------------------------------------------------
    let tooltip = am5.Tooltip.new(root, {
      labelText: "{name}: {value}",
      getFillFromSprite: false,
      autoTextColor: false,
    });

    tooltip.label.adapters.add("text", function (text, target) {
      const dataItem = target.dataItem;
      text = "";

      if (dataItem && dataItem.dataContext) {
        let content = `[bold underline fontSize: 16px textAlign:center]{name}: {value}[/]\n\n`;
        for (let i = 0; i < dataItem.dataContext.years.length; i += 3) {
          const year1 = dataItem.dataContext.years[i];
          const year2 = dataItem.dataContext.years[i + 1];
          const year3 = dataItem.dataContext.years[i + 2];

          content += `[#252323 fontWeight:600 fontSize: 13px]${
            year1.year
          }:[/] [#252323 fontWeight:400 fontSize: 13px]${year1.value.toFixed(
            2
          )}[/]`;

          if (year2) {
            content += `    [#252323 fontWeight:600 fontSize: 13px]${
              year2.year
            }:[/] [#252323 fontWeight:400 fontSize: 13px]${year2.value.toFixed(
              2
            )}[/]`;
          }

          if (year3) {
            content += `    [#252323 fontWeight:600 fontSize: 13px]${
              year3.year
            }:[/] [#252323 fontWeight:400 fontSize: 13px]${year3.value.toFixed(
              2
            )}[/]`;
          }

          content += "\n";
        }
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
        orientation: "horizontal",
        startColor: am5.color("#ABBABA"),
        endColor: am5.color("#C43E3E"),
        startText: "Bajo",
        endText: "Alto",
        stepCount: 6,
        width: am5.percent(100),
        centerX: am5.percent(0),

        y: am5.percent(90),
      })
    );

    heatLegend.startLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("startColor"),
    });

    heatLegend.endLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("endColor"),
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
    let topContainer = chart.children.push(
      am5.Container.new(root, {
        layout: root.horizontalLayout,
        width: am5.percent(100),
        height: 50,
        y: 2,
        x: 0,
        centerX: am5.percent(0),
        marginLeft: 1000,
      })
    );

    var leftContainer = topContainer.children.push(
      am5.Container.new(root, {
        width: am5.percent(50),
        height: am5.percent(100),
        layout: root.horizontalLayout,
      })
    );

    //------------------------------------------------------------------------------------
    am5.ready(function () {
      btn_download(root, topContainer);
      btn_share(root, topContainer);
      btn_full_screen(root, topContainer);
    });
    //------------------------------------------------------------------------------------
  }
});
