function load_data() {
  return new Promise((resolve, reject) => {
    Papa.parse("./data/data.csv", {
      download: true,
      header: true,
      complete: function (results) {
        // console.log('RES', results);

        let energias = [ { name: "Energias", children: [] } ];
        let sectores = results.data.map((ele) => {
          
          let eneGroup;
            if (ele.sector != '') {
              eneGroup = { name: ele.sector, color: '', children: []}            }
            if(ele.sector === 'Energía'){
              eneGroup.color = '#d49b00'
            } else if(ele.sector === 'AGSyOUT'){
              eneGroup.color = '#608080'
            } else if(ele.sector === 'Procesos industriales y uso de productos'){
              eneGroup.color = '#720034'
            } else if(ele.sector === 'Residuos'){
              eneGroup.color = '#4b4bab'
            }
            return eneGroup
          })
          let jsonObject = sectores.map(JSON.stringify);
          let uniqueSet = new Set(jsonObject);
          let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
          energias[0].children = uniqueArray
          let subUnicos = results.data.map((ele) => {
            if(ele.indicador === 'valor_en_porcent'){
              for (let i = 0; i < uniqueArray.length; i++) {
                let sub = uniqueArray;
                if (ele.sector === sub[i].name) {
                  return sub[i].children.push({
                    name: ele.subsector,
                    value: parseFloat(ele.valor) || 0,
                  });
                }
              }
            }
          })
        // console.log('energias', energias);
        resolve(energias);
      },
      error: function (error) {
        console.error("Error al cargar o analizar el archivo:", error);
        reject(error);
      },
    });
  });
}
