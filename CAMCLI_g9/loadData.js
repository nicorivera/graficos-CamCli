function load_data() {
  return new Promise((resolve, reject) => {
    Papa.parse("./data/data.csv", {
      download: true,
      header: true,
      complete: function (results) {
        // console.log('RES', results);
        // console.log('paises', paisesCode);
        const data = results.data.map((fila) => {
            // console.log('FILA', fila);
          if (fila.anio) {
            fila.year = fila.anio;
            delete fila.anio;
          }
          if (fila.valor_en_mtco2e) {
            fila.valor = parseFloat(fila.valor_en_mtco2e);
            delete fila.valor_en_mtco2e;
          }
          if (fila.sector) {
            fila.esteSector = fila.sector;
            delete fila.sector;
          }
          return fila;
        });
          // for (let i = 0; i < data.length; i++) {
          //   const el = data[i];
          //   paisesCode.forEach((a)=>{
          //     if(el.category == a.iso3){
          //       el.pais = a.iso3_desc_fundar;
          //     } else if (el.category == 'OWID_WRL'){
          //       el.pais = 'Mundo';
          //     } else if (el.category == 'OWID_KOS'){
          //       el.pais = 'Kosovo';
          //     }
          //   })
          // }
        // console.log("Datos analizados:", data);

        // let dataOk = am5.CSVParser.parse(data.response, {
        //   delimiter: ",",
        //   reverse: false,
        //   skipEmpty: false,
        //   useColumnNames: true,
        // });
        
        // let processor = am5.DataProcessor.new(root, {
        //   numericFields: ["valor_en_mtco2e"],
        //   // dateFormat: "yyyy",
        //   // dateFields: ["anio"],
        // });
        // processor.processMany(dataOk);
    
        // function compareByAnio(a, b) {
        //   let dateA = new Date(a.anio);
        //   let dateB = new Date(b.anio);
        //   let anioA = dateA.getFullYear()
        //   let anioB = dateB.getFullYear()
        //   return anioA - anioB;
        // }
        // dataOk.sort(compareByAnio);
        let dataStacked = []
        let dato
        for (let i = 0; i < data.length; i++) {
          let el = data[i];
        //   console.log('ELS', el);
          dato = { anio: el.year }
          for (let row in el) {
            //   console.log('ROW', row);
              if(dato.anio === el.year){
                dato[el.esteSector] = el.valor;
              }
          }
        //   data.forEach((ele) => {
        //     //   console.log('ELEEEE', ele);
        //     if(dato.anio === ele.year){
        //         console.log('anio', dato.anio, ele.year);
        //         if(el.esteSector === ele.esteSector){
        //             dato[ele.esteSector] = el.valor;
        //         }
        //     }
        //   });
          dataStacked.push(dato)
        }
        // let datok = {}
        const transformed = dataStacked.reduce((acc, item) => {
            let anios = { anio: item.anio }
            let itemKeys = Object.keys(item);
            let itemValues = Object.values(item);
            // let este = [...acc];
            for (let k = 0; k < itemKeys.length; k++) {
                let el = itemKeys[k];
                let elv = itemValues[k];
                console.log('EL', el, elv);

                // if(el != 'anio'){
                //     arrAnios.push({el : elv})
                // }
            }
            // dato[itemKeys != 'anio'] = itemValues[itemKeys != 'anio'];
            acc.push(itemKeys)
            return acc
         }, []);
         console.log('transformed', transformed);
         

        //  for (let t = 0; t < transformed.length; t++) {
        //     let el = transformed[t];
            
        //  }
        // for (let i = 0; i < dataStacked.length; i++) {
        //     const el = dataStacked[i];
        //     datok.anio = el.anio
        //     // let row = Object.entries(dataStacked[i])
        //     // row.forEach(([key, value]) => {
        //     //     console.log(key, value)
        //     // });
        //     if(datok.anio = el.anio){
        //         let dataAnios = { ...el}
        //         dataStacked.filter((row) => {
        //             datok
        //         })
        //     }
        // }
        console.log('dataStacked', dataStacked);
        let jsonObject = dataStacked.map(JSON.stringify);
        let uniqueSet = new Set(jsonObject);
        console.log('uniqueSet', uniqueSet);
        let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
        unicos = uniqueArray;
        console.log('data', unicos);
        // console.log('uniqueArray', unicos);
        resolve(unicos);
      },
      error: function (error) {
        console.error("Error al cargar o analizar el archivo:", error);
        reject(error);
      },
    });
  });
}
