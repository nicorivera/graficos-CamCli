function dataURItoBlob(dataUri) {
  const byteString = atob(dataUri.split(",")[1]);
  const mimeString = dataUri.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

function uploadImageToImgur(dataUri) {
  return new Promise((resolve, reject) => {
    const file = dataURItoBlob(dataUri);
    const formData = new FormData();
    formData.append("image", file);

    fetch("https://api.imgur.com/3/image/", {
      method: "POST",
      headers: {
        Authorization: "Client-ID 9a50ab494138bb3",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          resolve(data.data.link);
        } else {
          reject(
            "Error al subir imagen: " + (data.data.error || "Error desconocido")
          );
        }
      })
      .catch((error) => {
        reject("Error en la solicitud: " + error.message);
      });
  });
}

function btn_share(root, topContainer) {
  let chart = root.container.children.getIndex(0);

  let exporting = am5plugins_exporting.Exporting.new(root, {});

  var btn_share = am5.Button.new(root, {
    paddingTop: 1,
    paddingBottom: 1,
    marginRight: 20,
    cursorOverStyle: "pointer",
    label: am5.Label.new(root, {
      text: "Compartir",
      fontSize: 14,
      fill: am5.color("#000000"),
    }),
  });

  btn_share.get("background").setAll({
    cornerRadiusTL: 100,
    cornerRadiusTR: 100,
    cornerRadiusBR: 100,
    cornerRadiusBL: 100,
    fill: am5.color("#FFFFFF"),
    fillOpacity: 1,
    stroke: am5.color("#000000"),
  });

  let hoverStateShare = btn_share.get("background").states.create("hover", {
    fill: am5.color("#EFF6EB"),
  });

  let activeStateShare = btn_share.get("background").states.create("down", {
    fill: am5.color("#FFFFFF"),
  });

  topContainer.children.push(btn_share);

  var htmlModalShare = `
  <div class="modal-share  max-w-md w-full md:w-96  ">      
  <div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Compartir Gráfico</h3>
            
            <div class="mt-1">
              <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
              Comparte la imagen de tu gráfico de forma rápida y sencilla. Directamente en redes sociales o con colegas, todo con solo un clic.
        </p>
              <div id='exportdiv'>
                 <div class='shareon'>
                    <a class="facebook button"   data-title="Gráfico compartido" data-url="TU_IMAGE_URL">Compartir en Facebook</a>

                    <a class="twitter button"   data-title="Gráfico compartido" data-url="TU_IMAGE_URL">Compartir en Twitter</a>
                  
                    <a class="whatsapp button"   data-title="Gráfico compartido" data-url="TU_IMAGE_URL">Compartir en WhatsApp</a>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-6    ">
        <button id="btnCloseModalShare" type="button" class="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Salir</button>
        </div>
        </div>
  `;

  let modalShare = am5.Modal.new(root, {
    content: htmlModalShare,
    className: "modal-share",
  });

  am5.ready(function () {
    setTimeout(function () {
      document
        .getElementById("btnCloseModalShare")
        .addEventListener("click", function () {
          modalShare.close();
        });
    }, 1500);
  });

  btn_share.events.on("click", function () {
    modalShare.open();
  });

  let linkImage = "";

  modalShare.events.on("opened", function (ev) {
    exporting.events.on("exportstarted", function (ev) {
      hideUi(0);
    });
    exporting.events.on("exportfinished", function (ev) {
      hideUi(1);
    });

    exporting.export("png").then(function (dataUri) {
      uploadImageToImgur(dataUri)
        .then((imageUrl) => {
          linkImage = imageUrl;

          document
            .querySelectorAll("#exportdiv .shareon a")
            .forEach((button) => {
              button.setAttribute("data-url", imageUrl);
              Shareon.init();
            });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });

  function hideUi(state = 0) {
    chart.topAxesContainer.set("opacity", state);
    chart.bottomAxesContainer.set("opacity", state);
  }

  //---------------------------------------------------------------------------------

  function checkChartWidth() {
    if (chart.width() < 600) {
      btn_share.remove("label");
      btn_share.setAll({
        width: 32,
        height: 32,
        marginRight: 10,
        icon: am5.Picture.new(root, {
          width: 20,
          height: 20,
          x: 6,
          y: 6,
          src: "./img/icon_share.svg",
          cursorOverStyle: "pointer",
        }),
      });
    } else {
      btn_share.remove("icon");
      btn_share.setAll({
        width: null,
        height: null,
        marginRight: 20,
        label: am5.Label.new(root, {
          text: "Compartir",
          fontSize: 14,
          fill: am5.color("#000000"),
        }),
      });
    }
  }

  window.addEventListener("resize", checkChartWidth);

  checkChartWidth();
}
