function btn_play(root, data) {
  let chart = root.container.children.getIndex(0);
  let scrollbarX = chart.get("scrollbarX");
  let xAxis = chart.xAxes.getIndex(0);
  let yAxis = chart.yAxes.getIndex(0);
  let cursor = chart.get("cursor");

  let btn_play = scrollbarX.children.push(
    am5.Button.new(root, {
      width: 28,
      height: 28,
      icon: am5.Picture.new(root, {
        width: 12,
        height: 12,
        x: 10,
        y: 9,
        src: "./img/icon_play.svg",
      }),
      cursorOverStyle: "pointer",
      fontSize: 12,
      fontWeight: "600",
      x: am5.percent(-40),
      y: 0,
      centerX: am5.p50,
      centerY: am5.p50,
      dx: 0,
      dy: 0,
    })
  );

  btn_play.get("background").setAll({
    cornerRadiusTL: 100,
    cornerRadiusTR: 100,
    cornerRadiusBR: 100,
    cornerRadiusBL: 100,
    fill: am5.color("#FFFFFF"),
    fillOpacity: 1,
    stroke: am5.color("#000000"),
  });

  let hoverState = btn_play.get("background").states.create("hover", {
    fill: am5.color("#EFF6EB"),
  });

  let activeState = btn_play.get("background").states.create("down", {
    fill: am5.color("#FFFFFF"),
  });

  let hoverStateWraper = btn_play.states.create("hover", {
    scale: 1.1,
  });

  let activeStateWraper = btn_play.states.create("down", {
    scale: 1,
  });

  let title_view_year = scrollbarX.children.push(
    am5.Label.new(root, {
      text: "Ver año por año",
      textAlign: "start",
      x: am5.percent(-10),
      y: 0,
      centerX: am5.p100,
      centerY: am5.p50,
      fontSize: 14,
      fontWeight: "600",
      fill: am5.color(0x000000),
    })
  );

  var years = new Set(data.map((item) => item.year));
  years = Array.from(years).sort((a, b) => a - b);

  function animateYears(index, onComplete) {
    if (index < years.length) {
      let startYear = years[0];
      let currentYear = new Date(years[index]);

      var endLabel = scrollbarX.endGrip.children._values[0];
      endLabel.set("text", currentYear.getFullYear());

      xAxis.zoomToDates(new Date(years[0]), new Date(years[index]));

      setTimeout(() => {
        animateYears(index + 1, onComplete);
      }, 40);
    } else {
      if (onComplete && typeof onComplete === "function") {
        onComplete();
      }
    }
  }

  btn_play.events.on("click", function () {
    if (btn_play.get("disabled")) {
      return;
    }

    btn_play.set("disabled", true);
    btn_play.set("cursorOverStyle", "not-allowed");
    btn_play.get("background").setAll({
      fillOpacity: 0.3,
      strokeOpacity: 0.3,
    });

    xAxis.zoomToDates(new Date(years[0]), new Date(years[1]));

    setTimeout(function () {
      animateYears(0, function () {
        btn_play.set("disabled", false);
        btn_play.set("cursorOverStyle", "pointer");
        btn_play.get("background").setAll({
          fillOpacity: 1,
          strokeOpacity: 1,
        });
      });
    }, 500);
  });

  //--------------------------------------------------------------------------

  function checkChartWidth() {
    if (chart.width() < 600) {
      title_view_year.setAll({
        textAlign: "center",
        x: am5.percent(50),
        y: -25,
        centerX: am5.p50,
        centerY: am5.p50,
      });

      btn_play.setAll({
        x: am5.percent(50),
        y: 28,
        centerX: am5.p50,
        centerY: am5.p50,
      });
    } else {
      title_view_year.setAll({
        textAlign: "left",
        x: am5.percent(-10),
        y: 0,
        centerX: am5.p100,
        centerY: am5.p50,
      });
      btn_play.setAll({
        x: am5.percent(-40),
        y: 0,
        centerX: am5.p50,
        centerY: am5.p50,
        dx: 0,
        dy: 0,
      });
    }
  }

  window.addEventListener("resize", checkChartWidth);

  checkChartWidth();
}
