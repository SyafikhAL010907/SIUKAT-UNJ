var express = require('express');
var router = express.Router();
var passport = require('passport');
var db = require('../config/database');
var Admin = require('../models/admin');

const Sequelize = require('sequelize');
const Op = Sequelize.Op

router.post('/datatable', passport.authenticate('jwt', { session: false }), function(req, res){
  let perPage = parseInt(req.body.perPage, 10),
      object  = {
        currentPage: req.body.page,
        perPage: perPage,
        keyword: req.body.keyword
      }
  return db.transaction(function (t) {
    if(req.body.keyword === ""){
        Admin.findAndCountAll({
            limit: perPage,
            offset: (req.body.page-1)*perPage
        }).then(admin => {
            Object.assign(admin, object)
            res.status(200).json(admin)
        })
    }else{
        Admin.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        username: {
                            [Op.like]: req.body.keyword+'%'
                        }
                    },
                    {
                        nama_lengkap: {
                            [Op.like]: '%'+req.body.keyword+'%'
                        }
                    }
                ]
            },
            limit: perPage,
            offset: (req.body.page-1)*perPage
        }).then(admin => {
          Object.assign(admin, object)
          res.status(200).json(admin)
        })
    }
  }).catch(function (err) {
    res.status(500).json("Error: RollBack")
  })
})

router.get('/username/:username', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    Admin.findOne({where: {username: req.params.username}}).then(admin => {
      res.send(admin)
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

router.post('/save', function(req, res){
  return db.transaction(function (t) {
    Admin.findOne({where: {username: req.body.username_lama}}).then((admin) => {
        if(admin !== null){
            return Admin.update(req.body, {where: {username: req.body.username_lama}})
        }else{
            return Admin.create(req.body, {
                fields: [
                  'username',
                  'nama_lengkap',
                  'no_telepon',
                  'role'
                ]
              })
        }
    }).then(admin => {
      res.json("Data telah dimasukkan!")
    }).catch(function (err) {
      res.status(500).json("Gagal memasukkan data!")
    })
  }).catch(function (err) {
    res.status(500).json("Gagal memasukkan data!")
  })
})

router.delete('/delete/:username', passport.authenticate('jwt', { session: false }), function(req, res){
  return db.transaction(function (t) {
    Admin.destroy({where: {username: req.params.username}}).then(admin => {
      res.json("Data telah dihapus!")
    })
  }).catch(function (err) {
    res.status(500).json(err)
  })
})

module.exports = router;
