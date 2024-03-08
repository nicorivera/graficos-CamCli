function load_data() {
  const dataCodes = "./data/diccionario_paises_argendata.json";
  let paisesCode;

  fetch(dataCodes)
    .then((response) => {
      return response.json();
    })
    .then((listData) => {
      paisesCode = listData;
    });

  return new Promise((resolve, reject) => {
    Papa.parse("./data/data.csv", {
      download: true,
      header: true,
      complete: function (results) {
        const excludedCodes = ["OWID_KOS", "OWID_USS", "OWID_WRL"];

        const data = results.data.map((fila) => {
          if (excludedCodes.includes(fila.iso3)) {
            return null;
          }
          if (fila.anio) {
            fila.year = fila.anio;
            delete fila.anio;
          }
          if (fila.valor_en_ton) {
            fila.value = parseFloat(fila.valor_en_ton);
            delete fila.valor_en_ton;
          }
          if (fila.iso3) {
            fila.iso3 = fila.iso3;

            const countryData = paisesCode.find(
              (country) => country.iso3 === fila.iso3
            );

            if (countryData) {
              fila.iso2 = countryData.iso2_unsd;
              fila.name = countryData.iso3_desc_fundar;
            }
          }
          return fila;
        });

        let processedData = {};

        data.forEach((item) => {
          if (item) {
            if (!processedData[item.iso2]) {
              processedData[item.iso2] = {
                id: item.iso2,
                idIso3: item.iso3,
                value: 0,
                years: [],
              };
            }
            if(item.year == 2021){
              console.log(item.value.toFixed(2));
              processedData[item.iso2].value += +item.value.toFixed(2);
              processedData[item.iso2].years.push({
                year: item.year,
                value: item.value.toFixed(2),
              });
            }
          }
        });

        console.log("Data", processedData);
        resolve(processedData);
      },
      error: function (error) {
        console.error("Error al cargar o analizar el archivo:", error);
        reject(error);
      },
    });
  });
}
