function load_data() {
  return new Promise((resolve, reject) => {
    Papa.parse("./data/data.csv", {
      download: true,
      header: true,
      complete: function (results) {
        const data = results.data.map((fila) => {
          if (fila.anio) {
            fila.year = fila.anio;
            delete fila.anio;
          }
          if (fila.valor_en_twh) {
            fila.value = parseFloat(fila.valor_en_twh);
            delete fila.valor_en_twh;
          }
          if (fila.tipo_energia) {
            fila.category = fila.tipo_energia;
            delete fila.tipo_energia;
          }
          return fila;
        });
        console.log("Datos analizados:", data);
        resolve(data);
      },
      error: function (error) {
        console.error("Error al cargar o analizar el archivo:", error);
        reject(error);
      },
    });
  });
}
