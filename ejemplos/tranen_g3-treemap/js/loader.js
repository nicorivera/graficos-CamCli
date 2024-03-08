function load_data() {
  return new Promise((resolve, reject) => {
    Papa.parse("./data/data.csv", {
      download: true,
      header: true,
      complete: function (results) {
        console.log('RES', results);
        // const filteredData = results.data.filter(
        //   (fila) => fila.iso3 === "ARG" && fila.anio === "2022"
        // );

        // const groupedData = filteredData.reduce((acc, item) => {
        //   let yearGroup = acc.find((group) => group.year === item.anio);
        //   if (!yearGroup) {
        //     yearGroup = { year: item.anio, children: [] };
        //     acc.push(yearGroup);
        //   }

        //   yearGroup.children.push({
        //     name: item.tipo_energia,
        //     value: parseFloat(item.valor_en_twh) || 0,
        //   });

        //   return acc;
        // }, []);

        // groupedData[0].country = "Argentina";
        // resolve(groupedData);


        // const filteredData = results.data.filter(
        //   (fila) => fila.iso3 === "ARG" && fila.anio === "2022"
        // );
        let continentes = [ { name: "Continentes", anio: results.data[0].anio, children: [] } ];
        // let dataConti = results.data.map((el) => {
        //   let estePais;
        //   let contGroup = results.data.find((group) => group.continente_fundar === el.continente_fundar);
        //   let contiChildren = { name: el.continente_fundar, children: []}
        //   continentes[0].children.push(contiChildren)
        //   console.log('contGroup', contGroup);
        //   // if(el.continente_fundar){

        //   // }
        //   if(contGroup.hasOwnProperty(el.continente_fundar)){
        //     estePais = { pais: el.iso3_desc_fundar, valor_en_porcent: el.valor_en_porcent }
        //     continentes[0].children[el.continente_fundar].push(estePais)
        //   }
        //   return estePais
        // });
        // console.log('dataConti', dataConti);
        let paises = results.data.map((ele) => {
          // let contGroup = results.data.find((group) => group.continente_fundar === ele.continente_fundar);
        // console.log('ele', ele);
        let contGroup;
          if (ele.continente_fundar) {
            contGroup = { name: ele.continente_fundar, color: '', children: []}
            // continentes[0].children.push(contGroup)
          }
          if(contGroup.name === 'Asia'){
            contGroup.color = '#d49b00'
          } else if(contGroup.name === 'Europa'){
            contGroup.color = '#608080'
          } else if(contGroup.name === 'África'){
            contGroup.color = '#720034'
          } else if(contGroup.name === 'América del Norte Central y el Caribe'){
            contGroup.color = '#4b4bab'
          } else if(contGroup.name === 'América del Sur'){
            contGroup.color = '#ff7b03'
          } else if(contGroup.name === 'Oceanía'){
            contGroup.color = '#bf3e3e'
          } else if(contGroup.name === 'Transporte internacional'){
            contGroup.color = '#c7deec'
          }
          // if(ele.continente === item.continente_fundar){
          //   ele.children.push({
          //     pais: item.iso3_desc_fundar,
          //     value: parseFloat(item.valor_en_porcent) || 0,
          //   });
          // }
          return contGroup
        })
        let jsonObject = paises.map(JSON.stringify);
        // console.log('jsonObject', jsonObject);
        let uniqueSet = new Set(jsonObject);
        // console.log('uniqueSet', uniqueSet);
        let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
        console.log('uniqueArray', uniqueArray);
        continentes[0].children = uniqueArray
        results.data.map((ele) => {
          for (let i = 0; i < uniqueArray.length; i++) {
            let conti = uniqueArray;
            // console.log('CAAA', conti, ele);
            if (ele.continente_fundar === conti[i].name) {
              return conti[i].children.push({
                name: ele.iso3_desc_fundar,
                value: parseFloat(ele.valor_en_porcent) || 0,
              });
            }
          }
        })
        // console.log('ele', ele);

        // continentes[0].children[0].forEach((el) => {
        //   console.log('UNICO', el);
        // })

        
        // const continenteData = results.data.reduce((acc, item) => {
        //   let contGroup = acc.find((group) => group.continente_fundar === item.continente_fundar);
        //   if (!contGroup) {
        //     contGroup = { continente: item.continente_fundar, anio: item.anio, children: [] };
        //     continentes[0].children.push(contGroup)
        //     acc.push(contGroup);
        //   }
        //   // console.log('acc', acc);
        //   // for (let i = 0; i < continentes[0].children.length; i++) {
        //   //   let ele = continentes[0].children[i];
        //   //   if(ele.continente === item.continente_fundar){
        //   //     continentes[0].children[i].children.push({
        //   // // contGroup.children.push({
        //   //       pais: item.iso3_desc_fundar,
        //   //       value: parseFloat(item.valor_en_porcent) || 0,
        //   //     });
        //   //   }
        //   // }
          
        //   // console.log('este', item);

        //   // console.log('acc', acc);
        //   return acc;
        // }, []);
        console.log('continentes', continentes);
        // let paises = continentes[0].children.map((ele) => {
        //   if(ele.continente === item.continente_fundar){
        //     ele.children.push({
        //       pais: item.iso3_desc_fundar,
        //       value: parseFloat(item.valor_en_porcent) || 0,
        //     });
        //   }
        // })
        // console.log('paises', paises);

        // let newPaises = [...new Set(continentes[0].children)]
        // // console.log('continentes[0].children', continentes[0].children);
        // let jsonObject = continentes[0].children.map(JSON.stringify);
        // // console.log('jsonObject', jsonObject);
        // let uniqueSet = new Set(jsonObject);
        // // console.log('uniqueSet', uniqueSet);
        // let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
        // console.log('uniqueArray', uniqueArray);

        
        // const conti = continenteData.reduce((acc, item) => {
        //   let cont = acc.find((c) => c.continente === item.continente);
        //   console.log('item', cont);
        //   if(!cont){
        //     cont = { continente: item.continente, anio: item.anio, children: [] };
        //     // continentes[0].children.push(cont)
        //     acc.push(cont)
        //   }
        //   // for (let i = 0; i < continentes[0].children.length; i++) {
        //   //   let ele = continentes[0].children[i];
        //   //   if(ele.continente === item.continente){
        //   //     continentes[0].children[i].children.push({
        //   //       pais: item.iso3_desc_fundar,
        //   //       value: parseFloat(item.valor_en_porcent) || 0,
        //   //     });
        //   //   }
            
        //   // }
        //   // cont.children.push({
        //   //   pais: item.iso3_desc_fundar,
        //   //   value: parseFloat(item.valor_en_porcent) || 0,
        //   // });
        //   return acc
        // }, [])
        // console.log('continenteData', continenteData);
        // console.log('CONTI', conti);
        // results.forEach(el => {
        //   let dato = {
        //     anio: el.anio,
        //     continente: el.continente_fundar,
        //     children: []
        //   }
        // });

        // groupedData[0].country = "Argentina";
        resolve(continentes);
      },
      error: function (error) {
        console.error("Error al cargar o analizar el archivo:", error);
        reject(error);
      },
    });
  });
}
