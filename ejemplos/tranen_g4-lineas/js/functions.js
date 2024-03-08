function createSeries(root, data, name, field) {
  let chart = root.container.children.getIndex(0);
  let xAxis = chart.xAxes.getIndex(0);
  let yAxis = chart.yAxes.getIndex(0);
  let cursor = chart.get("cursor");

  let series = chart.series.push(
    am5xy.LineSeries.new(root, {
      baseAxis: xAxis,
      valueAxis: yAxis,
      name: name,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: field,
      valueXField: "year",
      setStateOnChildren: true,
      tooltip: am5.Tooltip.new(root, {
        labelText: undefined,
        forceHidden: true,
        animationDuration: 0,
      }),
    })
  );

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
