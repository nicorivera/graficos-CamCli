document.addEventListener("DOMContentLoaded", function () {
  let data = {};

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
    const categoriesToFilter = [
      "Argentina",
      "Mundo",
      "Brasil",
      "Chile",
      "Suecia",
    ];

    const filteredData = data.filter((item) =>
      categoriesToFilter.includes(item.category)
    );

    ocultarLoader();

    var root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Responsive.new(root)]);
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        cursor: am5xy.XYCursor.new(root, {}),
        paddingLeft: 40,
        paddingRight: 20,
      })
    );

    chart.fontFamily = "";
    chart.zoomOutButton.set("forceHidden", true);
    chart.get("colors").set("step", 5);
    chart.bottomAxesContainer.set("paddingBottom", 80);

    var tooltip = am5.Tooltip.new(root, {});

    chart.plotContainer.set("tooltipPosition", "pointer");
    chart.plotContainer.set("tooltipText", "a");
    chart.plotContainer.set("tooltip", tooltip);

    tooltip.set(
      "background",
      am5.Rectangle.new(root, {
        opacity: 0.8,
        fill: am5.color(0xffffff),
        fillOpacity: 1,
        strokeWidth: 1,
        stroke: am5.color(0x000000),
      })
    );

    tooltip.label.adapters.add("text", function (text, target) {
      text = "";
      var i = 0;

      chart.series.each(function (series) {
        var tooltipDataItem = series.get("tooltipDataItem");
        var seriesName = series.get("name");

        if (tooltipDataItem && series.get("visible")) {
          // if (i == 0) {
          //   text +=
          //     "[bold textAlign:center]" +
          //     tooltipDataItem.get("valueX") +
          //     "[/] " +
          //     "\n\n";
          // }
          if (i == 0) {
            text += "\n";
          }
          if (i != 0) {
            text += "\n";
          }
          text +=
            "[" +
            series.get("stroke").toString() +
            "]●[/] [bold width:100px]" +
            seriesName +
            ":[/] " +
            tooltipDataItem.get("valueY").toFixed(1) +
            "%";
        }
        i++;
      });
      text += "\n";
      return text;
    });

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "year", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xAxis.data.setAll(filteredData);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        // strictMinMax: false,
        //min: -10,
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    yAxis.get("renderer").grid.template.setAll({
      stroke: am5.color("#ABBABA"),
      strokeWidth: 1,
      strokeDasharray: [0, 0],
      strokeOpacity: 1,
    });

    yAxis.get("renderer").labels.template.setAll({
      fontWeight: "500",
      fontSize: "0.75em",
      dx: -5,
      inside: true,
    });

    xAxis.get("renderer").grid.template.set("visible", false);

    xAxis.get("renderer").labels.template.setAll({
      fontWeight: "500",
      fontSize: "0.75em",
      inside: true,
      centerX: 0,
      dy: 10,
    });

    var cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
        xAxis: xAxis,
        yAxis: yAxis,
      })
    );

    var previousBulletSprites = [];

    cursor.events.on("cursormoved", cursorMoved);

    cursor.events.on("cursorhidden", function (ev) {
      for (var i = 0; i < previousBulletSprites.length; i++) {
        previousBulletSprites[i].unhover();
      }
    });

    function cursorMoved() {
      for (var i = 0; i < previousBulletSprites.length; i++) {
        previousBulletSprites[i].unhover();
      }
      previousBulletSprites = [];
      chart.series.each(function (series) {
        var dataItem = series.get("tooltip").dataItem;
        if (dataItem) {
          var bulletSprite = dataItem.bullets[0].get("sprite");
          bulletSprite.hover();
          previousBulletSprites.push(bulletSprite);
        }
      });
    }

    chart.series.each(function (series) {
      cursor.snapToSeries.push(series);
    });

    cursor.lineY.set("visible", false);
    cursor.lineX.set("stroke", am5.color("#ABBABA"));
    cursor.lineX.set("strokeWidth", 1);
    cursor.lineX.set("strokeDasharray", [0, 0]);

    //--------------------------------------------------------------------------

    var uniqueEntities = new Set(filteredData.map((item) => item.category));

    console.log(uniqueEntities);

    uniqueEntities.forEach(function (category) {
      createSeries(root, filteredData, category, "value");
    });

    //--------------------------------------------------------------------------
    chart.topAxesContainer.set("height", 70);
    chart.topAxesContainer.set("layout", root.horizontalLayout);

    var leftContainer = chart.topAxesContainer.children.push(
      am5.Container.new(root, {
        width: am5.percent(50),
        height: am5.percent(100),
        layout: root.horizontalLayout,
      })
    );

    //--------------------------------------------------------------------------
    am5.ready(function () {
      btn_type(chart, root, data);
      //list_series(chart, root);
      btn_download(root);
      btn_share(root);
      btn_full_screen(root);
      scrollbar_x(root);
      btn_play(root, data);
    });

    //--------------------------------------------------------------------------

    function checkChartWidth() {
      if (chart.width() < 600) {
        chart.plotContainer.set("tooltipPosition", "top");
      } else {
        chart.plotContainer.set("tooltipPosition", "pointer");
      }
    }

    window.addEventListener("resize", checkChartWidth);

    checkChartWidth();

    chart.appear(1000, 100);
  }
  //});
});
