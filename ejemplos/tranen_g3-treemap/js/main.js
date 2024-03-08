document.addEventListener("DOMContentLoaded", function () {
  var data = {};

  load_data()
    .then((rows) => {
      data = rows;
      console.log('DATA',data);
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

    // root.setThemes([am5themes_Responsive.new(root)]);
    root.setThemes([am5themes_Animated.new(root)]);

    // root.numberFormatter.setAll({
    //   numberFormat: "######.",
    //   bigNumberPrefixes: [
    //     { number: 1e3, suffix: "K" },
    //     { number: 1e6, suffix: "M" },
    //     { number: 1e9, suffix: "B" },
    //   ],
    // });

    // let chart = root.container.children.push(
    //   am5xy.XYChart.new(root, {
    //     cursor: am5xy.XYCursor.new(root, {}),
    //     paddingLeft: 20,
    //     paddingRight: 20,
    //   })
    // );
    // let chart = root.container.children.push(
    //   am5.Container.new(root, {
    //     width: am5.percent(100),
    //     height: am5.percent(100),
    //     layout: root.verticalLayout
    //   })
    // );

    // chart.fontFamily = "";
    // chart.zoomOutButton.set("forceHidden", false);
    // chart.get("colors").set("step", 5);

    // chart.plotContainer.set("maskContent", true);
    // chart.topAxesContainer.set("layout", root.horizontalLayout);
    // chart.topAxesContainer.set("layer", 90);

    // chart.topAxesContainer.setAll({
    //   interactive: true,
    //   interactiveChildren: true,
    //   height: 50,
    // });

    // chart.plotContainer.set(
    //   "background",
    //   am5.Rectangle.new(root, {
    //     stroke: am5.color("#608584"),
    //     fill: am5.color("#f4ffff"),
    //     opacity: 0.3,
    //   })
    // );

    // var leftContainer = chart.topAxesContainer.children.push(
    //   am5.Container.new(root, {
    //     width: am5.percent(50),
    //     height: am5.percent(100),
    //     layout: root.horizontalLayout,
    //   })
    // );

   

    // var cursor = chart.set(
    //   "cursor",
    //   am5xy.XYCursor.new(root, {
    //     behavior: "none",
    //   })
    // );

    // cursor.lineY.set("visible", false);
    // cursor.lineX.set("visible", false);

    //--------------------------------------------------------------------------

    // let zoomableContainer = chart.plotContainer.children.push(
    //   am5.ZoomableContainer.new(root, {
    //     x: am5.percent(0),
    //     y: am5.percent(0),
    //     width: am5.p100,
    //     height: am5.p100,
    //     wheelable: true,
    //     pinchZoom: true,
    //   })
    // );

    // var zoomTools = zoomableContainer.children.push(
    //   am5.ZoomTools.new(root, {
    //     target: zoomableContainer,
    //     x: am5.percent(8),
    //     opacity: 0.8,
    //   })
    // );

    //--------------------------------------------------------------------------
    var container = root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout
      })
    );
     container.set(
      "colors",
      am5.ColorSet.new(root, {
        step: 1,
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
        ],
      })
    );

    var series = container.children.push(
      am5hierarchy.Treemap.new(root, {
        sort: "descending",
        // singleBranchOnly: false,
        downDepth: 1,
        upDepth: 0,
        initialDepth: 1,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
        // colorField: "color",
        nodePaddingOuter: 0,
        nodePaddingInner: 0,
        // type: "rectangle",
        layoutAlgorithm: "squarify", // "squarify" | "binary" | "slice" | "dice" | "sliceDice"
        // tooltip: am5.Tooltip.new(root, {
        //   getFillFromSprite: true,
        //   getStrokeFromSprite: false,
        //   autoTextColor: true,
        //   getLabelFillFromSprite: false,
        //   forceHidden: false,
        // }),
      })
    );

    // function generateRandomColor() {
    //   const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    //   console.log(randomColor);
    //   return "#" + randomColor;
    // }

    series.rectangles.template.adapters.add("fill", function (fill, target) {
      const dataItem = target.dataItem;
      // if (dataItem && !dataItem.dataContext.children) {
      if (dataItem && dataItem.dataContext.children) {
        const nodeName = dataItem.dataContext.name;
        console.log('nodeName', nodeName);
        switch (nodeName) {
          case "Asia":
            return am5.color("#d49b00");
          case "Europa":
            return am5.color("#608080");
          case "África":
            return am5.color("#720034");
          case "América del Norte Central y el Caribe":
            return am5.color("#4b4bab");
          case "América del Sur":
            return am5.color("#ff7b03");
          case "Oceanía":
            return am5.color("#bf3e3e");
          case "Transporte internacional":
            return am5.color("#c7deec");
          // case "Carbon":
          //   return am5.color("#4B4BB0");
          // case "Petroleo":
          //   return am5.color("#720034");
          // case "Total":
          //   return am5.color("#FF6666");
          default:
            return am5.color("#dadada"); //fill;
        }
      } else if (dataItem && !dataItem.dataContext.children) {
        // if(dataItem._settings.category === 'Asia'){
        //   return am5.color("#d49b00");
        // } else if(dataItem._settings.category === 'Europa'){
        //   return am5.color("#608080");
        // } else if(dataItem._settings.category === 'África'){
        //   return am5.color("#720034");
        // } else if(dataItem._settings.category === 'América del Norte Central y el Caribe'){
        //   return am5.color("#4b4bab");
        // } else if(dataItem._settings.category === 'América del Sur'){
        //   return am5.color("#ff7b03");
        // } else if(dataItem._settings.category === 'Oceanía'){
        //   return am5.color("#bf3e3e");
        // } else if(dataItem._settings.category === 'Transporte internacional'){
        //   return am5.color("#c7deec");
        // }
        console.log('color', dataItem);

        return dataItem.dataContext.color;
        // return generateRandomColor();
      }

      return fill;
    });


    // var tooltip = am5.Tooltip.new(root, {
    //   getFillFromSprite: false,
    //   autoTextColor: false,
    //   labelText: "[bold fontSize:12px]{category}:[/] [fontSize:12px  ]{value}[/]\n",
    //   fill: am5.color("#000000"),
    // });

    

    //--------------------------------------------------------------------------

    // tooltip.set(
    //   "background",
    //   am5.Rectangle.new(root, {
    //     opacity: 1,
    //     fill: am5.color(0xffffff),
    //     fillOpacity: 1,
    //     strokeWidth: 1,
    //     stroke: am5.color(0x000000),
    //   })
    // );

    // tooltip.label.setAll({
    //   fill: am5.color("#000000"),
    //   textAlign: "center",
    // });
    // series.labels.template.setAll({
    //   fontSize: 15,
    //   fill: am5.color(0x000000),
    //   text: "{category}"
    // });

    // tooltip.label.adapters.add("tooltipHTML", function (text, target) {
    //   if (target.dataItem) {
    //     const dataItem = target.dataItem.dataContext
    //     let divTool = `<div class="tooltip"><p class="titu">Emisiones de GEI</p><p class='data'><span class='punto'>&#9679</span><span class='anio'>${new Date(dataItem.name).getFullYear()}:</span> ${dataItem.value.toFixed(2)} Mt CO2eq</p></div>`;

    //     return divTool
    //   }

    //   return text
    // })
    // series.get("tooltip").label.set("interactive", true);
    series.rectangles.template.adapters.add("tooltipHTML", function (text, target) {
      const dataItem = target.dataItem;
      console.log('TTTT', target);
      text = "";
      
      if (dataItem && !dataItem.dataContext.children) {
        console.log('tooltip', dataItem);
        let itemData = dataItem._settings.parent;
        let continente = itemData.dataContext.name;
        text +=
          "[bold fontSize:14px verticalAlign: super;]" +
          continente +
          "[/]\n";

        text += `[bold fontSize:12px]${
          dataItem.dataContext.name
        }[/]: [ fontSize:12px]${dataItem.dataContext.value.toFixed(2)}[/]`;
        return text;
      } else if (dataItem && dataItem.dataContext.children) {
        console.log('tool', dataItem);
        let itemData = dataItem._settings.parent;

        const sortedChildren = dataItem.dataContext.children.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        // let sortedPaises = sortedChildren.forEach((cont) => {
        //   cont.children.sort((a, b) => {
        //     console.log('AAA', a);
        //     return a.name.localeCompare(b.name);
        //   })
        // })
        // console.log('SORT', sortedPaises);
        let anio = dataItem.dataContext.anio;
        console.log('anio', anio);

        let content = `<div class="tooltip"><p class="titu">${dataItem.dataContext.name}</p><p class='data'><span class='punto' style='color:${dataItem.dataContext.color}'>&#9679</span> ${itemData}%</p></div>`;
        
        // `[bold  fontSize: 14px textAlign:center]${dataItem.dataContext.name}[/]\n`;
        // content +=
        //   "[bold fontSize:12px]Año:[/] [fontSize:12px  ]" + anio + "[/]\n";
        var i = 0;

        // sortedPaises.forEach((child) => {
        //   content += `[#252323 fontWeight:600 fontSize: 12px    ]${
        //     child.name
        //   }:[/] [#252323  fontWeight:500 fontSize: 12px ]${child.value.toFixed(
        //     2
        //   )}[/]\n`;

        //   i++;
        // });
        return content;
      }
    })
    // var tooltip = series.set("tooltip", am5.Tooltip.new(root, {}));
    // console.log('TOOL', tooltip);

    // // tooltip.label.set("text", "{valueX.formatDate()}: {valueY.formatNumber()}");
    // tooltip._label.setAll("text", function (text, target) {
    // // series.label.adapters.add("tooltipText", function (text, target) {
    //   const dataItem = target.dataItem;
    //   text = "";
      
    //   if (dataItem && !dataItem.dataContext.children) {
    //     console.log('ESTO', dataItem);
    //     let itemData = dataItem._settings.parent;
    //     let continente = itemData.dataContext.name;
    //     text +=
    //       "[bold fontSize:14px verticalAlign: super;]" +
    //       continente +
    //       "[/]\n";

    //     text += `[bold fontSize:12px]${
    //       dataItem.dataContext.name
    //     }[/]: [ fontSize:12px]${dataItem.dataContext.value.toFixed(2)}[/]`;
    //     return text;
    //   } else if (dataItem && dataItem.dataContext.children) {
    //   console.log('ESTO00000', dataItem);
    //   let itemData = dataItem._settings.parent;

    //     const sortedChildren = dataItem.dataContext.children.sort((a, b) => {
    //       return a.name.localeCompare(b.name);
    //     });
    //     let anio = itemData.dataContext.anio;

    //     let content = `[bold  fontSize: 14px textAlign:center]${dataItem.dataContext.name}[/]\n`;
    //     content +=
    //       "[bold fontSize:12px]Año:[/] [fontSize:12px  ]" + anio + "[/]\n";
    //     var i = 0;

    //     sortedChildren.forEach((child) => {
    //       content += `[#252323 fontWeight:600 fontSize: 12px    ]${
    //         child.name
    //       }:[/] [#252323  fontWeight:500 fontSize: 12px ]${child.value.toFixed(
    //         2
    //       )}[/]\n`;

    //       i++;
    //     });
    //     return content;
    //   }
    //   // return text;
    // });
    // series.nodes.template.set("tooltipText", "{category}: [bold]{sum}[/]");

    // series.set("tooltipPosition", "pointer");

    // series.setAll("tooltip", tooltip);

    // zoomableContainer.children.unshift(
    //   am5hierarchy.BreadcrumbBar.new(root, {
    //     series: series
    //   })
    // );

    // root.container.children.unshift(
    //   am5hierarchy.BreadcrumbBar.new(root, {
    //     series: series
    //   })
    // );
    series.get("colors").setAll({
      step: 2
    });

    series.set("selectedDataItem", series.dataItems[0]);
    series.data.setAll(data);

    root.container.children.unshift(
      am5hierarchy.BreadcrumbBar.new(root, {
        series: series
      })
    );

    //--------------------------------------------------------------------------

    // btn_type(chart, root, series, data);
    // btn_download(root);
    // btn_share(root);
    // btn_full_screen(root, zoomableContainer);

    //--------------------------------------------------------------------------
    series.appear(1000, 100);
    // chart.appear(1000, 100);
  }
});


