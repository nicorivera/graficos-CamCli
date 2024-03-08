let chart;
let cursor;
let xAxis;
let xRenderer;
let yAxis;
let root;
let processor;
let legend;

// CHART
const createChart = (divId) => {
  root = am5.Root.new(divId);

  // Proceso de datos
  processor = am5.DataProcessor.new(root, {
    numericFields: ["valor_en_mtco2e"],
    dateFormat: "yyyy",
    dateFields: ["anio"],
  });

  chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      cursor: am5xy.XYCursor.new(root, {}),
      locationX: 0.5,
      layout: root.verticalLayout,
    })
  );

  // Colores del gráfico
  colors = chart.get("colors"); 

  // EJE X
  xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: "year", count: 1 },
      min: new Date(1990, 1, 1).getTime(),
      max: new Date(2018, 1, 1).getTime(),
      renderer: am5xy.AxisRendererX.new(root, {}),
      locationX: 0.5,
    })
  );

  // 1965 en bold
  const firstDate = new Date(1990, 1, 1).getTime();
  let firstDateLocation = xAxis.makeDataItem({ value: firstDate });
  xAxis.createAxisRange(firstDateLocation);

  firstDateLocation.get("label").setAll({
    text: 1990,
    fontSize: 9,
    fontWeight: 500,
    dx: 10,
    forceHidden: false,
  });

  // 2022 en bold
  const lastDate = new Date(2018, 1, 1).getTime();
  let lastDateLocation = xAxis.makeDataItem({ value: lastDate });
  xAxis.createAxisRange(lastDateLocation);

  lastDateLocation.get("label").setAll({
    text: 2018,
    fontSize: 9,
    fontWeight: 500,
    dx: 5,
    forceHidden: false,
  });

  // LABELS EJE X
  let rendererX = xAxis.get("renderer");

  rendererX.labels.template.setAll({
    fontSize: 9,
    fontFamily: "Chivo Mono",
    paddingTop: 15,
  });

  rendererX.grid.template.set("forceHidden", true);
  // Colores de la paleta dada
  chart
    .get("colors")
    .set("colors", [
      am5.color("#FF7B03"),
      am5.color("#006CBA"),
      am5.color("#000000"),
      am5.color("#ACBABB"),
      am5.color("#CCE3F1"),
      am5.color("#608584"),
      am5.color("#720034"),
      am5.color("#3EA2FF"),
      am5.color("#ABBABA"),
      am5.color("#C43E3E"),
      am5.color("#4B4BB0")
    ]);

  // EJE Y
  yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      max: 600,
      numberFormat: "#' Mt CO2eq'",
      renderer: am5xy.AxisRendererY.new(root, {
        minGridDistance: 50,
      }),
    })
  );

  // LABELS EJE Y
  let rendererY = yAxis.get("renderer");

  rendererY.labels.template.setAll({
    fontSize: 10,
    fontFamily: "Chivo Mono",
    paddingRight: 15,
  });

  root.dateFormatter.set("dateFormat", "[bold]yyyy");

  legend = chart.children.push(am5.Legend.new(root, {}));
  legend.data.setAll(chart.series.values);

  // CURSOR
  cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "none",
    xAxis: xAxis,
    yAxis: yAxis,
  }));

  cursor.lineY.set("visible", false);
  cursor.lineX.set("stroke", am5.color("#ABBABA"));
  cursor.lineX.set("strokeWidth", 1);
  cursor.lineX.set("strokeDasharray", [0, 0]);
}; // FIN createChart()

let parsedData;
// Datos CSV
const fetchData = () => {
  am5.net
    .load("./data/data.csv")
    .then((data) => {
      let fetchedData = data.response;

      parsedData = am5.CSVParser.parse(fetchedData, {
        delimiter: ",",
        reverse: false,
        skipEmpty: false,
        useColumnNames: true,
      });

      processor.processMany(parsedData);

      // console.log('data', parsedData);
      createLineSeries(parsedData);
    })
    .catch((result) => {
      if (result && result.xhr && result.xhr.responseURL) {
        console.log("ERROR: Datos no cargados - " + result.xhr.responseURL);
      } else {
        console.log("ERROR: Datos no cargados");
      }
    });
};

// SERIES
let series;
const createLineSeries = (parsedData) => {
  let dataPais = parsedData;

  series = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: 'pais',
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "valor_en_mtco2e",
      valueXField: "anio",
      locationX: 0.5,
      tooltip: am5.Tooltip.new(root, {
            getFillFromSprite: false,
            getStrokeFromSprite: false,
            autoTextColor: false,
            getLabelFillFromSprite: false,
            forceHidden: true,
        }),
    })
  );

  series.strokes.template.setAll({
    strokeWidth: 2,
  });
  series.data.setAll(dataPais);

  // BULLETS
  series.bullets.push(() => {
    let circle = am5.Circle.new(root, {
      strokeWidth: 0,
      radius: 6,
      opacity: 0,
      toggleKey: "active",
      pointerOrientation: "horizontal",
      interactive: true,
      fill: "#000000",
      locationX: 0.5,
      keepTargetHover: true,
    })

    circle.states.create("default", {
      opacity: 0,
    })

    circle.states.create("hover", {
      opacity: 1,
    })
    // TOOLTIP
    circle.adapters.add("tooltipHTML", function (text, target) {
      if (target.dataItem) {
        const dataItem = target.dataItem.dataContext
        let divTool = `<div class="tooltip"><p class="titu">Emisiones de GEI</p><p class='data'><span class='punto'>&#9679</span><span class='anio'>${new Date(dataItem.anio).getFullYear()}:</span> ${dataItem.valor_en_mtco2e.toFixed(2)} Mt CO2eq</p></div>`;

        return divTool
      }

      return text
    })

    return am5.Bullet.new(root, {
      sprite: circle,
    })
  })

  // Nombres al final de las lineas
  series.bullets.push((root, series, dataItem) => {
    let lastIndex = 0;
    if (series.dataItems.indexOf(dataItem) == lastIndex) {
      return am5.Bullet.new(root, {
        // opacity: 1,
        sprite: am5.Label.new(root, {
          fontFamily: 'Chivo Mono',
          fontWeight: 500,
          fontSize: 12,
          fill: series.get("fill"),
          textAlign: 'left',
          paddingRight: 3,
          paddingTop: -5,
          text: dataItem.dataContext.pais
        })
      });
    }
  });
  return series;
}

createChart("chart-cont");
fetchData();
