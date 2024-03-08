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
    var root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Responsive.new(root)]);
    root.setThemes([am5themes_Animated.new(root)]);

    root.numberFormatter.setAll({
      numberFormat: "######.",
      bigNumberPrefixes: [
        { number: 1e3, suffix: "K" },
        { number: 1e6, suffix: "M" },
        { number: 1e9, suffix: "B" },
      ],
    });

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        cursor: am5xy.XYCursor.new(root, {}),
        paddingLeft: 45,
        paddingRight: 20,
      })
    );

    chart.fontFamily = "";
    chart.zoomOutButton.set("forceHidden", true);
    chart.get("colors").set("step", 5);
    chart.bottomAxesContainer.set("paddingBottom", 80);
    chart.topAxesContainer.set("height", 70);
    chart.topAxesContainer.set("layout", root.horizontalLayout);

    var leftContainer = chart.topAxesContainer.children.push(
      am5.Container.new(root, {
        width: am5.percent(50),
        height: am5.percent(100),
        layout: root.horizontalLayout,
      })
    );

    chart.set(
      "colors",
      am5.ColorSet.new(root, {
        step: 1,
        colors: [
          am5.color("#3EA2FF"),
          am5.color("#FF7B03"),
          am5.color("#4B4BB0"),
          am5.color("#720034"),
          am5.color("#608584"),
          am5.color("#C43E3E"),
          am5.color("#50945D"),
          am5.color("#006CBA"),
        ],
      })
    );

    var tooltip = am5.Tooltip.new(root, {});

    chart.plotContainer.set("tooltipPosition", "pointer");
    chart.plotContainer.set("tooltipText", "a");
    chart.plotContainer.set("tooltip", tooltip);

    //--------------------------------------------------------------------------

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
            "";
        }
        i++;
      });
      text += "\n";
      return text;
    });

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        startLocation: 0.5,
        endLocation: 0.5,
        gridIntervals: [
          { timeUnit: "year", count: 1 },
          { timeUnit: "year", count: 1 },
        ],
        baseInterval: { timeUnit: "year", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    //--------------------------------------------------------------------------

    xAxis.get("renderer").grid.template.set("visible", false);

    xAxis.get("renderer").labels.template.setAll({
      fontWeight: "500",
      fontSize: "0.75em",
      inside: true,
      centerX: 0,
      dy: 10,
    });

    xAxis.data.setAll(data);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        strictMinMax: true,
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
      dx: 0,
      inside: true,
    });

    //--------------------------------------------------------------------------

    var cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
        xAxis: xAxis,
        yAxis: yAxis,
      })
    );

    cursor.lineY.set("visible", false);
    cursor.lineX.set("stroke", am5.color("#ABBABA"));
    cursor.lineX.set("strokeWidth", 1);
    cursor.lineX.set("strokeDasharray", [0, 0]);

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

    //--------------------------------------------------------------------------

    function createSeries(name, field) {
      var series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          stacked: true,
          valueYField: field,
          categoryXField: "year",
          tooltip: am5.Tooltip.new(root, {
            labelText: undefined,
            forceHidden: true,
            animationDuration: 0,
          }),
        })
      );

      series.fills.template.setAll({
        fillOpacity: 1,
        visible: true,
      });

      series.data.setAll(data);

      series.bullets.push(function (root, series, dataItem) {
        var circle = am5.Circle.new(root, {
          radius: 4,
          interactive: true,
          fill: series.get("fill"),
          opacity: 0,
        });

        circle.states.create("default", {
          opacity: 0,
        });

        circle.states.create("hover", {
          opacity: 1,
          scale: 1.5,
        });

        let bullet = am5.Bullet.new(root, {
          sprite: circle,
        });
        return bullet;
      });

      series.set("cursorHoverEnabled", true);
      series.strokes.template.set("strokeWidth", 2);
      series.data.setAll(data.filter((item) => item.category === name));

      series.appear(1000);
    }

    var uniqueEntities = new Set(data.map((item) => item.category));
    uniqueEntities.forEach((category) => {
      createSeries(category, "value");
    });

    //--------------------------------------------------------------------------

    btn_type(root);
    scrollbar_x(root);
    btn_play(root, data);
    btn_download(root);
    btn_share(root);
    btn_full_screen(root);

    //--------------------------------------------------------------------------

    chart.appear(1000, 100);
  }
});
