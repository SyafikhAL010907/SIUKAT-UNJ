var Ukt = require("../models/ukt");
var CMahasiswa = require("../models/cmahasiswa");
var Ayah = require("../models/ayah");
var Ibu = require("../models/ibu");
var Wali = require("../models/wali");
var Rumah = require("../models/rumah");
var Listrik = require("../models/listrik");
var Kendaraan = require("../models/kendaraan");
var Pendukung = require("../models/pendukung");
var Bobot = require("../models/bobot");
var Value = require("../models/value");

var ukt = function () {};

const vFirst = (
  gaji_ibu,
  gaji_ayah,
  sampingan_ibu,
  sampingan_ayah,
  uang_wali,
  gaji_sendiri,
  tanggungan
) => {
  return (
    (gaji_ibu +
      gaji_ayah +
      sampingan_ibu +
      sampingan_ayah +
      uang_wali +
      gaji_sendiri) /
    tanggungan
  );
};

const vSecond = (pbb, kk, kontrak, bobot_pbb, bobot_kontrak) => {
  return bobot_pbb * ((pbb / 12) * kk) + bobot_kontrak * (kontrak / 12);
};

const vThird = (listrik) => {
  return listrik / 3;
};

const vFourthFifth = (kendaraan) => {
  return kendaraan / 12;
};

/*const decisionMaker = (ikb, ukt) => {
    var uktCategories = {}
    uktCategories.I = ukt.I
    uktCategories.II = ukt.II
    uktCategories.III = ukt.III
    uktCategories.IV = ukt.IV
    uktCategories.V = ukt.V
    uktCategories.VI = ukt.VI
    uktCategories.VII = ukt.VII
    uktCategories.VIII = ukt.VIII

    // var selisih = 99999999
    var ukt_temp = 0
    if(ikb <= uktCategories.I){
        ukt_temp = 'I'            
    }else if(ikb <= 1500000){
        ukt_temp = 'II'
    }else if(ikb <= uktCategories.III){
        ukt_temp = 'III'
    }else if(ikb <= uktCategories.IV){
        ukt_temp = 'IV'
    }else if(ikb <= uktCategories.V){
        ukt_temp = 'V'
    }else if(ikb <= uktCategories.VI){
        ukt_temp = 'VI'
    }else if(ikb <= uktCategories.VII){
        ukt_temp = 'VII'
    }else if(ikb <= uktCategories.VIII){
        ukt_temp = 'VIII'
    }else{
        ukt_temp = 'VIII'
    }
    // for(var key in uktCategories){
    //     if(key === "II"){
    //         temp = Math.abs(1500000 - ikb)
    //     }else{
    //         temp = Math.abs(uktCategories[key] - ikb)
    //     }

    //     if(temp <= selisih){
    //         selisih = temp
    //         ukt_temp = key
    //     }
    // }

    return ukt_temp
}*/

// const decisionMaker = (ikb, ukt) => {
//     var uktCategories = {}
//     uktCategories.I = ukt.I
//     uktCategories.II = ukt.II
//     uktCategories.III = ukt.III
//     uktCategories.IV = ukt.IV
//     uktCategories.V = ukt.V
//     uktCategories.VI = ukt.VI
//     uktCategories.VII = ukt.VII
//     uktCategories.VIII = ukt.VIII

//     // var selisih = 99999999
//     var ukt_temp = 0
//     if (ikb <= uktCategories.I) {
//         ukt_temp = 'I'
//     } else if (ikb <= 1500000) {
//         ukt_temp = 'II'
//     } else if (ikb <= uktCategories.III) {
//         ukt_temp = 'III'
//     } else if (ikb <= uktCategories.IV) {
//         ukt_temp = 'IV'
//     } else if (ikb <= uktCategories.V) {
//         ukt_temp = 'V'
//     } else if (ikb <= uktCategories.VI) {
//         ukt_temp = 'VI'
//     } else if (ikb <= uktCategories.VII) {
//         ukt_temp = 'VII'
//     } else if (ikb <= uktCategories.VIII) {
//         ukt_temp = 'VIII'
//     } else {
//         ukt_temp = 'VIII'
//     }
// for(var key in uktCategories){
//     if(key === "II"){
//         temp = Math.abs(1500000 - ikb)
//     }else{
//         temp = Math.abs(uktCategories[key] - ikb)
//     }

//     if(temp <= selisih){
//         selisih = temp
//         ukt_temp = key
//     }
// }

//     return ukt_temp
// }

const decisionMaker = (ikb, ukt) => {
  var uktCategories = {};
  uktCategories.I = ukt.I;
  uktCategories.II = ukt.II;
  uktCategories.III = ukt.III;
  uktCategories.IV = ukt.IV;
  uktCategories.V = ukt.V;
  uktCategories.VI = ukt.VI;
  uktCategories.VII = ukt.VII; //null
  uktCategories.VIII = ukt.VIII; //null

  var ukt_temp = 0;
  var category_temp = Object.entries(uktCategories);

  // for(var i = 0; i <category_temp.length; i++){
  //     if(category_temp[i][1]){
  //         console.log('woy' + i)
  //         if(category_temp[i][0] === 'II' && ikb <= 1500000){
  //             ukt_temp = category_temp[i][0]
  //             break
  //         }else if(ikb <= category_temp[i][1]){
  //             ukt_temp = 'II'
  //             break
  //         }
  //     }else{
  //         ukt_temp = category_temp[i-1][0]
  //         break
  //     }
  // }

  // var selisih = 99999999
  ukt_temp = 0;
  if (ikb <= uktCategories.I) {
    ukt_temp = "I";
  } else if (ikb <= uktCategories.II) {
    ukt_temp = "II";
  } else if (ikb <= uktCategories.III) {
    ukt_temp = "III";
  } else if (ikb <= uktCategories.IV) {
    ukt_temp = "IV";
  } else if (ikb <= uktCategories.V) {
    ukt_temp = "V";
  } else if (ikb <= uktCategories.VI) {
    ukt_temp = "VI";
  } else if (ikb <= uktCategories.VII) {
    ukt_temp = "VII";
  } else if (ikb <= uktCategories.VIII) {
    ukt_temp = "VIII";
  } else {
    ukt_temp = "VIII";
  }
  // for(var key in uktCategories){
  //     if(key === "II"){
  //         temp = Math.abs(1500000 - ikb)
  //     }else{
  //         temp = Math.abs(uktCategories[key] - ikb)
  //     }

  //     if(temp <= selisih){
  //         selisih = temp
  //         ukt_temp = key
  //     }
  // }

  return ukt_temp;
};

ukt.prototype.computeUkt = (no_peserta, atribut) => {
  return new Promise((resolve, reject) => {
    var data = {};
    CMahasiswa.findOne({ where: { no_peserta: no_peserta, atribut: atribut } })
      .then((mhs) => {
        data.cmahasiswa = mhs;
        // console.log(mhs);
        return Ayah.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.ayah = response;
        return Ibu.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.ibu = response;
        return Wali.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.wali = response;
        return Rumah.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.rumah = response;
        return Listrik.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.listrik = response;
        return Kendaraan.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.kendaraan = response;
        return Pendukung.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.pendukung = response;
        return Bobot.findOne({ where: { id: 1 } });
      })
      .then((response) => {
        data.bobot = response;
        console.log(no_peserta);
        return Ukt.findOne({
          where: {
            major_id: data.cmahasiswa.prodi_cmahasiswa,
            entrance: data.cmahasiswa.jalur_cmahasiswa,
          },
        });
      })
      .then((response) => {
        data.ukt = response;

        data.v1 = vFirst(
          data.ibu.penghasilan_ibu,
          data.ayah.penghasilan_ayah,
          data.ibu.sampingan_ibu,
          data.ayah.sampingan_ayah,
          data.wali.kesanggupan_wali,
          data.cmahasiswa.penghasilan_cmahasiswa,
          data.pendukung.tanggungan
        );
        data.v2 = vSecond(
          data.rumah.biaya_pbb,
          data.rumah.jumlah_kepala_keluarga,
          data.rumah.biaya_kontrak,
          data.bobot.pbb,
          data.bobot.kontrak
        );
        data.v3 = vThird(data.listrik.pengeluaran);
        data.v4 = vFourthFifth(data.kendaraan.pajak_motor);
        data.v5 = vFourthFifth(data.kendaraan.pajak_mobil);

        data.av1 = data.v1 * 6 * data.bobot.a;
        data.bv2 = data.v2 * 6 * data.bobot.b;
        data.cv3 = data.v3 * 6 * data.bobot.c;
        data.dv4 = data.v4 * 6 * data.bobot.d;
        data.ev5 = data.v5 * 6 * data.bobot.e;

        data.ikb = data.av1 + data.bv2 + data.cv3 + data.dv4 + data.ev5;

        data.choosenUkt = decisionMaker(data.ikb, data.ukt);

        return Value.update(
          {
            v1: data.v1,
            v2: data.v2,
            v3: data.v3,
            v4: data.v4,
            v5: data.v5,
            av1: data.av1,
            bv2: data.bv2,
            cv3: data.cv3,
            dv4: data.dv4,
            ev5: data.ev5,
            ikb: data.ikb,
          },
          { where: { no_peserta: no_peserta, atribut: atribut } }
        );
      })
      .then((response) => {
        data.value = response;

        return CMahasiswa.update(
          {
            golongan_id: data.choosenUkt,
          },
          { where: { no_peserta: no_peserta, atribut: atribut } }
        );
      })
      .then((response) => {
        data.uktCmahasiswa = response;
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

ukt.prototype.justCompute = (no_peserta, atribut) => {
  return new Promise((resolve, reject) => {
    var data = {};
    CMahasiswa.findOne({ where: { no_peserta: no_peserta, atribut: atribut } })
      .then((response) => {
        data.cmahasiswa = response;
        return Ayah.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.ayah = response;
        return Ibu.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.ibu = response;
        return Wali.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.wali = response;
        return Rumah.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.rumah = response;
        return Listrik.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.listrik = response;
        return Kendaraan.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.kendaraan = response;
        return Pendukung.findOne({
          where: { no_peserta: no_peserta, atribut: atribut },
        });
      })
      .then((response) => {
        data.pendukung = response;
        return Bobot.findOne({ where: { id: 1 } });
      })
      .then((response) => {
        data.bobot = response;
        return Ukt.findOne({
          where: {
            major_id: data.cmahasiswa.prodi_cmahasiswa,
            entrance: data.cmahasiswa.jalur_cmahasiswa,
          },
        });
      })
      .then((response) => {
        data.ukt = response;

        data.v1 = vFirst(
          data.ibu.penghasilan_ibu,
          data.ayah.penghasilan_ayah,
          data.ibu.sampingan_ibu,
          data.ayah.sampingan_ayah,
          data.wali.kesanggupan_wali,
          data.cmahasiswa.penghasilan_cmahasiswa,
          data.pendukung.tanggungan
        );
        data.v2 = vSecond(
          data.rumah.biaya_pbb,
          data.rumah.jumlah_kepala_keluarga,
          data.rumah.biaya_kontrak,
          data.bobot.pbb,
          data.bobot.kontrak
        );
        data.v3 = vThird(data.listrik.pengeluaran);
        data.v4 = vFourthFifth(data.kendaraan.pajak_motor);
        data.v5 = vFourthFifth(data.kendaraan.pajak_mobil);

        data.av1 = data.v1 * 6 * data.bobot.a;
        data.bv2 = data.v2 * 6 * data.bobot.b;
        data.cv3 = data.v3 * 6 * data.bobot.c;
        data.dv4 = data.v4 * 6 * data.bobot.d;
        data.ev5 = data.v5 * 6 * data.bobot.e;

        data.ikb = data.av1 + data.bv2 + data.cv3 + data.dv4 + data.ev5;

        data.choosenUkt = decisionMaker(data.ikb, data.ukt);
      })
      .then((response) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

ukt.prototype.byCmahasiswa = (cmahasiswa) => {
  let columnUKT = cmahasiswa.golongan_id
    ? [cmahasiswa.golongan_id, "nominal"]
    : "*";
  Ukt.findOne({
    where: {
      major_id: cmahasiswa.prodi_cmahasiswa,
      entrance: cmahasiswa.jalur_cmahasiswa,
    },
    attributes: [columnUKT],
  })
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
};

ukt.prototype.perCmahasiswa = (response, convertToJSON = true) => {
  let rows = [],
    promises = [];
  for (let i in response.rows) {
    let columnUKT = response.rows[i].golongan_id
      ? [response.rows[i].golongan_id, "nominal"]
      : "*";
    var temp = new Promise((resolve, reject) => {
      Ukt.findOne({
        where: {
          major_id: response.rows[i].prodi_cmahasiswa,
          entrance: response.rows[i].jalur_cmahasiswa,
        },
        attributes: [columnUKT],
      }).then((result) => {
        if (convertToJSON) response.rows[i] = response.rows[i].toJSON();
        rows.push(response.rows[i]);
        resolve(result);
      });
    });
    promises.push(temp);
  }

  return {
    rows: rows,
    promises: promises,
  };
};

ukt.prototype.rupiah = (angka) => {
  if (angka !== undefined) {
    var value = angka.toString().replace(".", "");
    var rupiah = "";
    var angkarev = value.toString().split("").reverse().join("");
    for (var i = 0; i < angkarev.length; i++)
      if (i % 3 === 0) rupiah += angkarev.substr(i, 3) + ".";
    return (
      "Rp " +
      rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("")
    );
  }
};

module.exports = ukt;
