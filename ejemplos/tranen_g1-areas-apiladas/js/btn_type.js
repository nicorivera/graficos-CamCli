function btn_type(root) {
  let chart = root.container.children.getIndex(0);

  var htmlModalSeries = `
  <div class="modal-type relative  w-full md:max-w-xl  md:w-[1000px] min-h-[400px]">   
      <div class=" ">
        <div   class=" ">
        <div class="  flex md:flex-row flex-col items-center gap-2 justify-between">
          <div class=" relative w-full md:w-1/2">
            <input type="text" name="search-type" id="search-type" class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm !border-gray-900 !bg-gray-800 text-white !px-4 h-10 !rounded-full" placeholder="Buscar">
            <svg id="icon-search" class="text-white opacity-50 absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <svg id="icon-clear" class="hidden cursor-pointer text-white opacity-50 absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>

          </div>

          <button type="button" id="clear-type" class=" md:w-auto w-full text-center justify-center border text-gray-800 hover:text-white border-gray-500 inline-flex items-center px-4 md:py-2 py-1    shadow-sm text-base font-medium rounded-full   bg-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Borrar selección
          </button>

          <a id="close-modal-type" class="absolute md:static -right-8 -top-10 hover:bg-opacity-90 cursor-pointer active:scale-95 origin-center w-8  h-8  p-1.5 flex items-center justify-center  rounded-full  bg-gray-800 text-sm md:text-base ">
            <svg class="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </a>
          </div>
        <div id="content-modal-type" class="mt-4 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-3">

        </div>

        </div>
      </div>
  
    </div>
`;

  let modalSeries = am5.Modal.new(root, {
    content: htmlModalSeries,
    className: "modal-type",
  });

  var btn_series = am5.Button.new(root, {
    x: 1,
    paddingTop: 1,
    paddingBottom: 1,
    cursorOverStyle: "pointer",
    label: am5.Label.new(root, {
      text: "Tipo de energia",
      fontSize: 14,
      fill: am5.color("#000000"),
    }),
  });

  btn_series.get("background").setAll({
    cornerRadiusTL: 100,
    cornerRadiusTR: 100,
    cornerRadiusBR: 100,
    cornerRadiusBL: 100,
    fill: am5.color("#ABBABA"),
    fillOpacity: 1,
    stroke: am5.color("#000000"),
  });

  let hoverStateCountry = btn_series.get("background").states.create("hover", {
    fill: am5.color("#EFF6EB"),
  });

  let activeStateCountry = btn_series.get("background").states.create("down", {
    fill: am5.color("#FFFFFF"),
  });

  btn_series.events.on("click", function () {
    modalSeries.open();
  });

  chart.topAxesContainer.children.push(btn_series);

  setTimeout(function () {
    addCheckboxes();
    clearCheckboxes();
    searchCheckboxes();
    document
      .getElementById("close-modal-type")
      .addEventListener("click", function () {
        modalSeries.close();
      });
  }, 1000);

  //---------------------------------------------------------------------------------

  function searchCheckboxes() {
    var searchBox = document.getElementById("search-type");
    var iconSearch = document.getElementById("icon-search");
    var iconClear = document.getElementById("icon-clear");

    searchBox.addEventListener("input", function () {
      var searchText = this.value.toLowerCase();
      var checkboxWrappers = document.querySelectorAll(".checkbox-type");

      if (this.value.length > 0) {
        iconSearch.classList.add("hidden");
        iconClear.classList.remove("hidden");
      } else {
        iconSearch.classList.remove("hidden");
        iconClear.classList.add("hidden");
      }

      iconClear.addEventListener("click", function () {
        searchBox.value = "";
        iconSearch.classList.remove("hidden");
        iconClear.classList.add("hidden");
        searchBox.dispatchEvent(new Event("input"));
      });

      checkboxWrappers.forEach(function (wrapper) {
        var label = wrapper.querySelector("label");
        var labelText = label.textContent.toLowerCase();

        if (labelText.includes(searchText)) {
          wrapper.style.display = "";
        } else {
          wrapper.style.display = "none";
        }
      });
    });
  }

  //---------------------------------------------------------------------------------

  function clearCheckboxes() {
    var clearButton = document.getElementById("clear-type");

    clearButton.addEventListener("click", function () {
      var checkboxes = document.querySelectorAll(
        'input[name="seriesCheckbox"]'
      );

      checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
      });

      chart.series.each(function (series, index) {
        series.set("visible", false);
      });
    });
  }
  //---------------------------------------------------------------------------------

  function addCheckboxes() {
    var container = document.getElementById("content-modal-type");

    chart.series.each(function (series, index) {
      var seriesId = series.id || `series-${index}`;

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = seriesId;
      checkbox.value = seriesId;
      checkbox.name = "seriesCheckbox";
      checkbox.checked = true;

      checkbox.addEventListener("change", function () {
        series.set("visible", this.checked);
      });

      var label = document.createElement("label");
      label.htmlFor = seriesId;
      label.appendChild(document.createTextNode(series.get("name")));

      var wraper = document.createElement("div");
      wraper.classList.add("checkbox-type");
      wraper.appendChild(checkbox);
      wraper.appendChild(label);

      container.appendChild(wraper);
    });
  }

  //---------------------------------------------------------------------------------

  function checkChartWidth() {
    if (chart.width() < 600) {
      console.log("Ancho del gráfico es menor que 600.");
    } else {
      console.log("Ancho del gráfico es 600 píxeles o más.");
    }
  }

  window.addEventListener("resize", checkChartWidth);

  checkChartWidth();
}
