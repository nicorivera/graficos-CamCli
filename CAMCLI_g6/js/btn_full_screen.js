function btn_full_screen(root, zoomableContainer) {
  let chart = root.container.children.getIndex(0);

  let icon_full_screen = am5.Picture.new(root, {
    width: 16,
    height: 16,
    x: 8,
    y: 8,
    src: "./img/icon_screen.svg",
  });

  let btn_full_screen = chart.plotContainer.children.push(
    am5.Button.new(root, {
      width: 32,
      height: 32,
      cursorOverStyle: "pointer",
    })
  );

  btn_full_screen.get("background").setAll({
    cornerRadiusTL: 100,
    cornerRadiusTR: 100,
    cornerRadiusBR: 100,
    cornerRadiusBL: 100,
    fill: am5.color("#FFFFFF"),
    fillOpacity: 1,
    stroke: am5.color("#000000"),
  });

  let hoverStateFullScreen = btn_full_screen
    .get("background")
    .states.create("hover", {
      fill: am5.color("#EFF6EB"),
    });

  let activeStateFullScreen = btn_full_screen
    .get("background")
    .states.create("down", {
      fill: am5.color("#FFFFFF"),
    });

  btn_full_screen.children.push(icon_full_screen);
  chart.topAxesContainer.children.push(btn_full_screen);

  //------------------------------------------------------------------------------------

  if (screenfull.isEnabled) {
    screenfull.on("change", () => {
      zoomableContainer.goHome();
      if (screenfull.isFullscreen) {
        document.body.classList.add("full");
      } else {
        document.body.classList.remove("full");
      }
    });
  }

  btn_full_screen.events.on("click", function () {
    zoomableContainer.goHome();
    if (screenfull.isEnabled) {
      if (!screenfull.isFullscreen) {
        var tagChart = document.querySelector("#chartdivWraper");
        screenfull.request(tagChart, { navigationUI: "hide" });
      } else {
        screenfull.exit();
      }
    }
  });

  //---------------------------------------------------------------------------------

  function checkChartWidth() {
    if (chart.width() < 600) {
    } else {
    }
  }

  window.addEventListener("resize", checkChartWidth);

  checkChartWidth();
}
