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
        // console.log('RES', results);
        // console.log('paises', paisesCode);
        const data = results.data.map((fila) => {
          if (fila.anio) {
            fila.year = fila.anio;
            delete fila.anio;
          }
          if (fila.valor_en_ton) {
            fila.value = parseFloat(fila.valor_en_ton);
            delete fila.valor_en_ton;
          }
          if (fila.iso3) {
            fila.category = fila.iso3;
            delete fila.iso3;
          }
          return fila;
        });
          for (let i = 0; i < data.length; i++) {
            const el = data[i];
            paisesCode.forEach((a)=>{
              if(el.category == a.iso3){
                el.pais = a.iso3_desc_fundar;
              } else if (el.category == 'OWID_WRL'){
                el.pais = 'Mundo';
              } else if (el.category == 'OWID_KOS'){
                el.pais = 'Kosovo';
              }
            })
          }
        // console.log("Datos analizados:", data);
        resolve(data);
      },
      error: function (error) {
        console.error("Error al cargar o analizar el archivo:", error);
        reject(error);
      },
    });
  });
}
