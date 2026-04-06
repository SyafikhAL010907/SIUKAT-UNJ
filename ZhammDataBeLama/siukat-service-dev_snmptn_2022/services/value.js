var Value = require('../models/value');
var LogValue = require('../models/log_value');

var value = function(){};

value.prototype.getByLoggedIn = function(no_peserta){
    return new Promise(function(resolve, reject){
      Value.findOne({
        where: {
          no_peserta: no_peserta
        }
      }).then(function(response){
        resolve(response)
      }).catch(function(err){
        reject(err)
      })
    })
}

value.prototype.add = function(users, atribut){
    return new Promise(function(resolve, reject){
      Value.create({
        no_peserta: users.no_peserta,
        v1: users.v1,
        v2: users.v2,
        v3: users.v3,
        v4: users.v4,
        v5: users.v5,
        av1: users.av1,
        bv2: users.bv2,
        cv3: users.cv3,
        dv4: users.dv4,
        ev5: users.ev5,
        ikb: users.ikb,
        atribut: atribut,
      }, {
        fields: [
            'no_peserta',
            'v1',
            'v2',
            'v3',
            'v4',
            'v5',
            'av1',
            'bv2',
            'cv3',
            'dv4',
            'ev5',
            'ikb',
            'atribut',
        ]
      }).then(function(response){
        resolve(response)
      }).catch(function(err){
        reject(err)
      })
    })
}

value.prototype.addLog = function(users, executor, timestamp, atribut="original"){
    return new Promise(function(resolve, reject){
      LogValue.create({
        no_peserta: users.no_peserta,
        v1: users.v1,
        v2: users.v2,
        v3: users.v3,
        v4: users.v4,
        v5: users.v5,
        av1: users.av1,
        bv2: users.bv2,
        cv3: users.cv3,
        dv4: users.dv4,
        ev5: users.ev5,
        ikb: users.ikb,
        atribut: atribut,
        executor: executor,
        timestamp: timestamp
      },{
        fields: [
          'no_peserta',
          'v1',
          'v2',
          'v3',
          'v4',
          'v5',
          'av1',
          'bv2',
          'cv3',
          'dv4',
          'ev5',
          'ikb',
          'atribut',
          'executor',
          'timestamp',
        ]
      }).then(function (response){
        resolve(response)
      }).catch(function (err) {
        reject(err)
      })
    })
  }

  module.exports = value