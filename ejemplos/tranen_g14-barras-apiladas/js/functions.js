function createSeries(root, data, name) {
  let chart = root.container.children.getIndex(0);
  let xAxis = chart.xAxes.getIndex(0);
  let yAxis = chart.yAxes.getIndex(0);
  let cursor = chart.get("cursor");

  let series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: name,
      stacked: true,
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: name,
      categoryYField: "category",
    })
  );

  var tooltip = am5.Tooltip.new(root, {
    getFillFromSprite: false,
    autoTextColor: false,
  });

  //--------------------------------------------------------------------------

  tooltip.set(
    "background",
    am5.Rectangle.new(root, {
      opacity: 1,
      fill: am5.color(0xffffff),
      fillOpacity: 1,
      strokeWidth: 1,
      stroke: am5.color(0x000000),
    })
  );

  tooltip.label.setAll({
    fill: am5.color(0x000000),
  });

  series.columns.template.set("tooltip", tooltip);

  series.columns.template.setAll({
    tooltipText: "{categoryY}, {name}: {valueX}",
  });

  series.data.setAll(data);

  series.appear(1000);
}
