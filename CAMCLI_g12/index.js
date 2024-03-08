var root = am5.Root.new("areaGraph");
// root.dateFormatter.setAll({
//   dateFormat: "yyyy",
//   dateFields: ["anio"]
// });
var dataOk;
root.setThemes([
  am5themes_Animated.new(root)
]);

let chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    cursor: am5xy.XYCursor.new(root, {}),
    paddingLeft: 75,
    paddingRight: 0,
  })
);
// Areas apiladas ////////////////////
// var chart = root.container.children.push(am5xy.XYChart.new(root, {
//     panX: true,
//     panY: true,
//     wheelX: "panX",
//     wheelY: "zoomX",
//     pinchZoomX: true,
//     paddingLeft: 0
// }));

// cursor
var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "none"
}));
cursor.lineY.set("visible", false);

var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "anio",
    startLocation: 0.5,
    endLocation: 0.5,
    renderer: am5xy.AxisRendererX.new(root, {}),
    tooltip: am5.Tooltip.new(root, {})
}));

xAxis.get("renderer").grid.template.set("visible", false);

xAxis.get("renderer").labels.template.setAll({
  fontWeight: "500",
  fontSize: "0.5em",
  inside: true,
  centerX: 0,
  dy: 5,
});


var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
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

chart.get("colors").set("colors", [
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
])
// function createSeries(name, field) {
    var series = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      stacked: true,
      valueYField: "valor_en_mtco2e",
      categoryXField: "anio",
      tooltip: am5.Tooltip.new(root, {
        // pointerOrientation: "horizontal",
        labelText: "[bold]{categoryX}: {valueY}"
      })
    }));
  
    series.fills.template.setAll({
      fillOpacity: 0.5,
      visible: true
    });
  
    // series.data.setAll(data);
    // series.appear(1000);
// }

// createSeries("Cars", "cars");
// createSeries("Motorcycles", "motorcycles");
// createSeries("Bicycles", "bicycles");

// var rangeDataItem = xAxis.makeDataItem({
//     category: "2001",
//     endCategory: "2003"
// });

// var rangeArea = xAxis.createAxisRange(rangeDataItem);

// rangeDataItem.get("grid").setAll({
//     stroke: am5.color(0x00ff33),
//     strokeOpacity: 0.5,
//     strokeDasharray: [3]
// });
am5.net
  .load("./data/data.csv")
  .then((data) => {
    // let fetchedData = data.response;
    dataOk = am5.CSVParser.parse(data.response, {
      delimiter: ",",
      reverse: false,
      skipEmpty: false,
      useColumnNames: true,
    });
    
    console.log('data TYPE', dataOk);
    var processor = am5.DataProcessor.new(root, {
      numericFields: ["valor_en_mtco2e"]
    });
    processor.processMany(dataOk);
    function compareByAnio(a, b) {
      let dateA = new Date(a.anio);
      let dateB = new Date(b.anio);
      let anioA = dateA.getFullYear()
      let anioB = dateB.getFullYear()
      // if(a.sector === b.sector){
        return anioA - anioB;
      // }
    }
    dataOk.sort(compareByAnio);
    // let el1 = 0;
    // let el2 = 0;
    // let el3 = 0;
    // let el4 = 0;
    // for (let i = 0; i < dataOk.length; i++) {
    //   let el = dataOk[i];
    //   if(el.sector === 'Energía'){
    //     el1++
    //   } else if(el.sector === 'Residuos'){
    //     el2++
    //   } else if(el.sector === 'AGSyOUT'){
    //     el3++
    //   } else{
    //     el4++
    //   }
    // }
    // console.log('AGSyOUT', el3);
    // console.log('Energia', el1);
    // console.log('Residuos', el2);
    // console.log('Largo', el4);
    console.log('DATA', dataOk);
    xAxis.data.setAll(dataOk);
    series.data.setAll(dataOk);
  })
  .catch((result) => {
    if (result && result.xhr && result.xhr.responseURL) {
      console.log("ERROR: Datos no cargados - " + result.xhr.responseURL);
    } else {
      console.log("ERROR: Datos no cargados");
    }
  });
  series.appear();
  chart.appear(1000, 100);