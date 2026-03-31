var Prodi = require('../models/prodi');

var prodi = function(){};

prodi.prototype.byCmahasiswa = (response, convertToJSON=true) => {
    let rows = [],
    promises = []
    for(let i in response.rows){
        var temp = new Promise((resolve, reject) => {
            Prodi.findOne({
                where: {
                    kode: response.rows[i].prodi_cmahasiswa,
                    jalur: response.rows[i].jalur_cmahasiswa,
                }
            }).then(result => {
                if(convertToJSON)   response.rows[i] = response.rows[i].toJSON()
                rows.push(response.rows[i])
                resolve(result)
            })
        })
        promises.push(temp)
    }

    return {
        rows: rows,
        promises: promises
    }
}

module.exports = prodi