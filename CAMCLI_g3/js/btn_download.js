function btn_download(root, topContainer) {
  let chart = root.container.children.getIndex(0);

  var btn_download = am5.Button.new(root, {
    paddingTop: 1,
    paddingBottom: 1,
    marginRight: 20,
    cursorOverStyle: "pointer",
    label: am5.Label.new(root, {
      text: "Descargar",
      fontSize: 14,
      fill: am5.color("#000000"),
    }),
  });

  btn_download.get("background").setAll({
    cornerRadiusTL: 100,
    cornerRadiusTR: 100,
    cornerRadiusBR: 100,
    cornerRadiusBL: 100,
    fill: am5.color("#FFFFFF"),
    fillOpacity: 1,
    stroke: am5.color("#000000"),
  });

  let hoverStateDownload = btn_download
    .get("background")
    .states.create("hover", {
      fill: am5.color("#EFF6EB"),
    });

  let activeStateDownload = btn_download
    .get("background")
    .states.create("down", {
      fill: am5.color("#FFFFFF"),
    });

  topContainer.children.push(btn_download);

  var htmlModalDownload = `
  <div class="modal-download  max-w-md w-full md:w-96  ">      
  <div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Exportar Grafico</h3>
            
            <div class="mt-1">
              <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
          Exporte su gráfico fácilmente: elija entre formatos como PNG, JPEG y SVG
          para adaptarse a diferentes necesidades y plataformas.
        </p>
              <div id='exportdiv'></div>
              
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-6    ">
        <button id="btnCloseModalDownload" type="button" class="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Salir</button>
        </div>
        </div>
  `;

  let modalDownload = am5.Modal.new(root, {
    content: htmlModalDownload,
    className: "modal-download",
  });

  setTimeout(function () {
    let exporting = am5plugins_exporting.Exporting.new(root, {
      menu: am5plugins_exporting.ExportingMenu.new(root, {
        align: "left",
        valign: "top",
        container: document.getElementById("exportdiv"),
      }),
      htmlOptions: {
        disabled: false,
      },
    });
    exporting.events.on("exportstarted", function (ev) {
      hideUi(0);
    });
    exporting.events.on("exportfinished", function (ev) {
      hideUi(1);
    });

    document
      .getElementById("exportdiv")
      .addEventListener("click", function (event) {
        if (event.target.parentNode.classList.contains("am5exporting-item")) {
          modalDownload.close();
        }
      });

    document
      .getElementById("btnCloseModalDownload")
      .addEventListener("click", function () {
        modalDownload.close();
      });
  }, 1000);

  btn_download.events.on("click", function () {
    modalDownload.open();
  });

  function hideUi(state = 0) {
    topContainer.set("opacity", state);
    topContainer.set("opacity", state);
  }

  //---------------------------------------------------------------------------------

  function checkChartWidth() {
    if (chart.width() < 600) {
      btn_download.remove("label");
      btn_download.setAll({
        width: 32,
        height: 32,
        marginRight: 10,
        icon: am5.Picture.new(root, {
          width: 20,
          height: 20,
          x: 6,
          y: 6,
          src: "./img/icon_download.svg",
          cursorOverStyle: "pointer",
        }),
      });
    } else {
      btn_download.remove("icon");
      btn_download.setAll({
        width: null,
        height: null,
        marginRight: 20,
        label: am5.Label.new(root, {
          text: "Descargar",
          fontSize: 14,
          fill: am5.color("#000000"),
        }),
      });
    }
  }

  window.addEventListener("resize", checkChartWidth);

  checkChartWidth();
}
