function load_data() {
  return new Promise((resolve, reject) => {
    Papa.parse("./data/data.csv", {
      download: true,
      header: true,
      complete: function (results) {
        let continentes = [ { name: "Continentes", anio: results.data[0].anio, children: [] } ];
        let paises = results.data.map((ele) => {
        let contGroup;
          if (ele.continente_fundar) {
            contGroup = { colorPais: '', children: []}
            if(ele.continente_fundar === 'Transporte internacional'){
              contGroup['name'] = ''
            } else {
              contGroup['name'] = ele.continente_fundar
            }
          }
          if(contGroup.name === 'Asia'){
            contGroup.colorPais = '#d49b00'
          } else if(contGroup.name === 'Europa'){
            contGroup.colorPais = '#608080'
          } else if(contGroup.name === 'África'){
            contGroup.colorPais = '#720034'
          } else if(contGroup.name === 'América del Norte Central y el Caribe'){
            contGroup.colorPais = '#4b4bab'
          } else if(contGroup.name === 'América del Sur'){
            contGroup.colorPais = '#ff7b03'
          } else if(contGroup.name === 'Oceanía'){
            contGroup.colorPais = '#bf3e3e'
          } else if(contGroup.name === 'Transporte internacional'){
            contGroup.colorPais = '#c7deec'
          }
          return contGroup
        })
        let jsonObject = paises.map(JSON.stringify);
        let uniqueSet = new Set(jsonObject);
        let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
        continentes[0].children = uniqueArray
        results.data.map((ele) => {
          for (let i = 0; i < uniqueArray.length; i++) {
            let conti = uniqueArray;
            if (ele.continente_fundar === conti[i].name) {
              return conti[i].children.push({
                name: ele.iso3_desc_fundar,
                value: parseFloat(ele.valor_en_porcent) || 0,
              });
            }
          }
        })
        resolve(continentes);
      },
      error: function (error) {
        console.error("Error al cargar o analizar el archivo:", error);
        reject(error);
      },
    });
  });
}
