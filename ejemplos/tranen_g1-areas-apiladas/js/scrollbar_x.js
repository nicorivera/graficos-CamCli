function scrollbar_x(root) {
  let chart = root.container.children.getIndex(0);
  let xAxis = chart.xAxes.getIndex(0);

  var scrollbarX = am5.Scrollbar.new(root, {
    orientation: "horizontal",
    maxHeight: 2,
    height: 2,
    y: 90,
    x: am5.percent(20),
    width: am5.percent(80),
  });

  chart.set("scrollbarX", scrollbarX);

  var startLabel = scrollbarX.startGrip.children.push(
    am5.Label.new(root, {
      isMeasured: false,
      width: 100,
      fill: am5.color(0x000000),
      centerX: 50,
      centerY: 30,
      x: am5.p50,
      y: 70,
      textAlign: "center",
      populateText: true,
      fontWeight: "600",
      fontSize: "1.6em",
    })
  );
  startLabel.set("customId", "startLabel");
  let retrievedLabel = startLabel.get("customId");

  var endLabel = scrollbarX.endGrip.children.push(
    am5.Label.new(root, {
      isMeasured: false,
      width: 100,
      fill: am5.color(0x000000),
      centerX: 50,
      centerY: 30,
      x: am5.p50,
      y: 70,
      textAlign: "center",
      populateText: true,
      fontWeight: "600",
      fontSize: "1.6em",
    })
  );
  endLabel.set("customId", "endLabel");

  scrollbarX.events.on("rangechanged", function (event) {
    var startRange = event.target.get("start");
    var endRange = event.target.get("end");

    var startIndex = Math.floor(startRange * xAxis.dataItems.length);
    var endIndex = Math.floor(endRange * xAxis.dataItems.length);

    endIndex = Math.min(endIndex, xAxis.dataItems.length - 1);

    var startCategory = xAxis.dataItems[startIndex]?.get("category");
    var endCategory = xAxis.dataItems[endIndex]?.get("category");

    startLabel.set("text", startCategory ? startCategory.toString() : "");
    endLabel.set("text", endCategory ? endCategory.toString() : "");
  });

  chart.bottomAxesContainer.children.push(scrollbarX);

  scrollbarX.thumb.setAll({
    fill: am5.color("#ABBABA"),
    fillOpacity: 1,
  });

  scrollbarX.startGrip.setAll({
    scale: 0.5,
    width: 30,
    height: 30,
    icon: null,
  });

  scrollbarX.startGrip.get("background").setAll({
    fill: am5.color("#ABBABA"),
  });

  scrollbarX.endGrip.setAll({
    scale: 0.5,
    width: 30,
    height: 30,
    icon: null,
  });

  scrollbarX.endGrip.get("background").setAll({
    fill: am5.color("#ABBABA"),
  });

  //---------------------------------------------------------------------------------

  function checkChartWidth() {
    if (chart.width() < 600) {
      scrollbarX.setAll({ x: am5.percent(0), width: am5.percent(100) });
    } else {
      scrollbarX.setAll({ x: am5.percent(30), width: am5.percent(70) });
    }
  }

  window.addEventListener("resize", checkChartWidth);

  checkChartWidth();
}
