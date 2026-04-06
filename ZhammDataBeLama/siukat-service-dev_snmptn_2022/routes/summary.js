var express = require('express');
var router = express.Router();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var db = require('../config/database');
var {summarydata} = require("../services");

router.get("/fakultas",function(req,res,next){
    summarydata.fetchByFakultas()
    .then((data)=>{
        res.status(200).json(data)
    }).catch((err)=>{
        res.status(500).json(err)
    })
})
router.get("/prodi",function(req,res,next){
    summarydata.fetchByProdi()
    .then((data)=>{
        res.status(200).json(data)
    }).catch((err)=>{
        res.status(500).json(err)
    }) 
})

var passport = require('passport');

module.exports = router;
