document.addEventListener("DOMContentLoaded", function () {
  let data = {};
  let uniqueCategories = [];

  load_data()
    .then((rows) => {
      let transformedData = rows.reduce((acc, item) => {
        let existingCountry = acc.find((d) => d.category === item.category);
        if (existingCountry) {
          existingCountry[`${new Date(item.year).getFullYear()}`] = item.value;
        } else {
          let newItem = {
            category: item.category,
            [`${new Date(item.year).getFullYear()}`]: item.value,
          };
          acc.push(newItem);
        }
        return acc;
      }, []);

      uniqueCategories = [...new Set(rows.map((item) => item.category))];

      data = transformedData;

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
      "China",
      "Francia",
      "Mundo",
      "Estados Unidos",
      "Brasil",
      "Indonesia",
      "Alemania",
      "Tailandia",
    ];

    const filteredData = data.filter(
      (item) => !categoriesToFilter.includes(item.category)
    );

    ocultarLoader();

    var root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Responsive.new(root)]);
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        cursor: am5xy.XYCursor.new(root, {}),
        paddingLeft: 40,
        paddingRight: 20,
      })
    );

    chart.fontFamily = "";
    chart.zoomOutButton.set("forceHidden", true);
    chart.get("colors").set("step", 6);
    chart.bottomAxesContainer.set("paddingBottom", 80);
    chart.zoomOutButton.set("forceHidden", true);

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

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        numberFormat: "#.00'twh'",
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
        }),
      })
    );

    var yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 10,
      minorGridEnabled: true,
    });

    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "category",
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    yRenderer.grid.template.setAll({
      location: 1,
    });

    yAxis.data.setAll(filteredData);

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
      inside: false,
    });

    xAxis.get("renderer").grid.template.set("visible", false);

    xAxis.get("renderer").labels.template.setAll({
      fontWeight: "500",
      fontSize: "0.75em",
      inside: false,
      centerX: 0,
    });

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

    const processedKeys = [];

    filteredData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (!key.startsWith("category")) {
          if (!processedKeys.includes(key)) {
            processedKeys.push(key);
          }
        }
      });
    });

    processedKeys.sort((a, b) => a - b);

    processedKeys.forEach((category) => {
      createSeries(root, filteredData, category);
    });

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

    btn_type(root, data);
    btn_download(root);
    btn_share(root);
    btn_full_screen(root);

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

    //--------------------------------------------------------------------------

    chart.appear(1000, 100);
  }
  //});
});
