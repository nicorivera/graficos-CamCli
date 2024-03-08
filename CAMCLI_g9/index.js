let root;
var dataOk;
let chart;
let cursor;
let xAxis;
let yAxis;
let processor;
// var dataEnergía = [];
// var dataProcesos = [];
// var dataResiduos = [];
// var dataAGSyOUT = [];
let unicos;
// let legend;
fetchData()

function createChart(divId, data) {
  root = am5.Root.new(divId);

  root.setThemes([
    am5themes_Animated.new(root)
  ]);

  chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      cursor: am5xy.XYCursor.new(root, {}),
      paddingLeft: 75,
      paddingRight: 0,
    })
  );
  chart.set(am5.ColorSet.new(root, {
    step: 2,
    colors: [
      am5.color("#ff7b03"),
      am5.color("#608080"),
      am5.color("#d49b00"),
      am5.color("#720034"),
      am5.color("#4b4bab"),
      am5.color("#bf3e3e"),
      am5.color("#006cb5"),
      am5.color("#3e9dff"),
      am5.color("#686868"),
      am5.color("#8cbed2"),
      am5.color("#c7deec"),
    ]
  }))

  // cursor
  cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "none"
  }));
  cursor.lineY.set("visible", false);

  xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "anio",
      startLocation: 0.5,
      endLocation: 0.5,
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
  }));

  xAxis.get("renderer").grid.template.set("visible", true);

  xAxis.get("renderer").labels.template.setAll({
    fontWeight: "500",
    fontSize: "0.5em",
    inside: true,
    centerX: 0,
    dy: 5,
  });

  yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      categoryField: "valor_en_mtco2e",
      numberFormat: "#'MtCO2e'",
      renderer: am5xy.AxisRendererY.new(root, {})
  }));

  yAxis.get("renderer").grid.template.setAll({
    stroke: am5.color("#ABBABA"),
    strokeWidth: 1,
    strokeDasharray: [1, 1],
    strokeOpacity: 1,
  });

  yAxis.get("renderer").labels.template.setAll({
    fontWeight: "500",
    fontSize: "0.5em",
    dx: 0,
    inside: true,
  });

  root.dateFormatter.set("dateFormat", "[bold]yyyy");
}

function fetchData() {
  am5.net
    .load("./data/data.csv")
    .then((data) => {
      // var dataEnergía = [];
      // var dataProcesos = [];
      // var dataResiduos = [];
      // var dataAGSyOUT = [];
      console.log('DATA', data);
      dataOk = am5.CSVParser.parse(data.response, {
        delimiter: ",",
        reverse: false,
        skipEmpty: false,
        useColumnNames: true,
      });
      
      processor = am5.DataProcessor.new(root, {
        numericFields: ["valor_en_mtco2e"],
        // dateFormat: "yyyy",
        // dateFields: ["anio"],
      });
      processor.processMany(dataOk);
  
      function compareByAnio(a, b) {
        let dateA = new Date(a.anio);
        let dateB = new Date(b.anio);
        let anioA = dateA.getFullYear()
        let anioB = dateB.getFullYear()
        return anioA - anioB;
      }
      dataOk.sort(compareByAnio);
      let dataStacked = []
      let dato
      for (let i = 0; i < dataOk.length; i++) {
        let el = dataOk[i];
        dato = { anio: el.anio }
        dataOk.forEach((ele) => {
          // if(el.anio === ele.anio){
            dato[ele.sector] = ele.valor_en_mtco2e;
          // }
        });
        // console.log('DATO', dato);
        dataStacked.push(dato)
      }
      let jsonObject = dataStacked.map(JSON.stringify);
      let uniqueSet = new Set(jsonObject);
      // console.log('uniqueSet', uniqueSet);
      let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
      unicos = uniqueArray;
      console.log('uniqueArray', unicos);
      // console.log('OK', dataStacked);
      // dataOk.forEach((el) => {
      //   if(el.sector === 'Energía'){
      //     dataEnergía.push(el)
      //   } else if(el.sector === 'Procesos industriales y uso de productos'){
      //     dataProcesos.push(el)
      //   } else if(el.sector === 'Residuos'){
      //     dataResiduos.push(el)
      //   } else if(el.sector === 'AGSyOUT'){
      //     dataAGSyOUT.push(el)
      //   } 
      // });
      // console.log('dataEnergía', dataEnergía);
      // console.log('dataProcesos', dataProcesos);
      // console.log('dataResiduos', dataResiduos);
      // console.log('dataAGSyOUT', dataAGSyOUT);
      // xAxis.data.setAll(dataOk);
      // createLineSeries(uniqueArray);
      // createLineSeries(dataProcesos);
      // createLineSeries(dataResiduos);
      // createLineSeries(dataAGSyOUT);
  xAxis.data.setAll(data);
      // series.data.setAll(uniqueArray);
    })
    .catch((result) => {
      if (result && result.xhr && result.xhr.responseURL) {
        console.log("ERROR: Datos no cargados - " + result.xhr.responseURL);
      } else {
        console.log("ERROR: Datos no cargados");
      }
    });
}
// SERIES
let series;
function createLineSeries(name, value) {

  series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
    name: name,
    xAxis: xAxis,
    yAxis: yAxis,
    stacked: true,
    valueYField: value,
    categoryXField: "anio",
    locationX: 0.5,
    tooltip: am5.Tooltip.new(root, {
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      autoTextColor: false,
      getLabelFillFromSprite: false,
      forceHidden: true,
    }),
  }));
  series.strokes.template.setAll({
    strokeWidth: 4,
    strokeOpacity: 1,
    shadowBlur: 2,
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    shadowColor: am5.color(0x000000),
    shadowOpacity: 0.1
  })

  series.fills.template.setAll({
    fillOpacity: 0.5,
    visible: true,

    fillPattern: am5.GrainPattern.new(root, {
      maxOpacity: 0.15,
      density: 0.5,
      colors: [am5.color("#ff7b03"),
              am5.color("#608080"),
              am5.color("#d49b00"),
              am5.color("#720034")]
    })

  });

  // BULLETS
  series.bullets.push(() => {
    let circle = am5.Circle.new(root, {
      strokeWidth: 0,
      radius: 5,
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
  series.data.setAll(unicos);
  // series.data.setAll(data);
  series.appear(1000);
}
// fetchData();
createChart("areaGraph", unicos);
createLineSeries('Procesos', 'Procesos industriales y uso de productos');
createLineSeries('AGSyOUT', 'AGSyOUT');
createLineSeries('Energía', 'Energía');
createLineSeries('Residuos', 'Residuos');


// chart.appear(1000, 100);