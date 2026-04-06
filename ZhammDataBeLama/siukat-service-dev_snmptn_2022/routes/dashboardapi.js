var express = require('express');
var router = express.Router();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var db = require('../config/database');
var {cmahasiswa} = require("../services");
var moment = require('moment');


var passport = require('passport');

router.get("/data",function(request,response,next){
    cmahasiswa.dashboardSummary()
    .then(function(data){        
        response.status(200).json(data);
    }).catch(function(error){
        response.status(500);
    })
})

router.get("/meta",function(req,res,next){
    cmahasiswa.dashboardmeta()
    .then(function(data){
        res.status(200).json(data);
    })
})

module.exports = router;