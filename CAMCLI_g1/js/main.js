document.addEventListener("DOMContentLoaded", function () {
  var data = {};

  load_data()
    .then((rows) => {
      data = rows;
      const newArr = data[0].children.filter(object => {
        return object.name !== '';
      });
      data[0].children = newArr;
      // console.log('DATA',data);
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
        downDepth: 1,
        upDepth: 0,
        initialDepth: 1,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
        colorField: "colorPais",
        nodePaddingOuter: 0,
        nodePaddingInner: 0,
        type: "rectangle",
        layoutAlgorithm: "squarify", // "squarify" | "binary" | "slice" | "dice" | "sliceDice"
        tooltip: am5.Tooltip.new(root, {
          getFillFromSprite: true,
          getStrokeFromSprite: false,
          autoTextColor: true,
          getLabelFillFromSprite: false,
          forceHidden: false,
        }),
      })
    );

    series.rectangles.template.adapters.add("fill", function (fill, target) {
      const dataItem = target.dataItem;
      if (dataItem && dataItem.dataContext.children) {
        return dataItem.dataContext.colorPais;

      } else if (dataItem && !dataItem.dataContext.children) {

        return dataItem.dataContext.colorPais;
      }
      return fill;
    });

    series.rectangles.template.set({
      fill: am5.color(0xffffff),
      fillOpacity: 1
    });

    series.labels.template.setAll({
      fontSize: 13,
      fill: am5.color(0xffffff),
      text: "{category}: [bold]{sum}%[/]"
    });

    series.nodes.template.set("tooltipText", "{category}: [bold]{sum}%[/]");

    series.data.setAll(data);
    series.set("selectedDataItem", series.dataItems[0]);

    root.container.children.unshift(
      am5hierarchy.BreadcrumbBar.new(root, {
        series: series
      })
    );

    series.appear(1000, 100);
  }
});
