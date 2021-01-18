const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../db/sqlMap');
const db = require('../db/db');
// Connect to the database
const conn = mysql.createPool(db.mysql);
// conn.connect();
const jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: 'operation failed'
        });
    } else {
        res.json(ret);
    }
};

// Adding User Interface
router.get('/get-parcel-list', (req, res) => {

    var params = req.body;
    // console.log(params);
    function getParcelList() {

        return promise = new Promise( function(resolve, reject) {
            var sql = $sql.parcel.getList;
            conn.query(sql, function (err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
       })
    }
    function getParcelTanksList(id) {

        return promise = new Promise( function(resolve, reject) {
            var sql = $sql.parcel.getParcelTanks;
            conn.query(sql, id,  function (err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
       })
    }
    var arr = [];
    getParcelList()
    .then(function (result) {
        arr = result;
        return getParcelTanksList(arr[0].id);
    }).then(function (result) {
        arr[0].slots = result;
        return getParcelTanksList(arr[1].id);
    }).then(function (result) {
        arr[1].slots = result;
        return getParcelTanksList(arr[2].id);
    }).then(function (result) {
        arr[2].slots = result;
        return getParcelTanksList(arr[3].id);
    }).then(function (result) {
        arr[3].slots = result;
        return getParcelTanksList(arr[4].id);
    }).then(function (result) {
        arr[4].slots = result;
        return getParcelTanksList(arr[5].id);
        jsonWrite(res, arr);
    }).then(function (result) {
        arr[5].slots = result;
        return getParcelTanksList(arr[6].id);
    }).then(function (result) {
        arr[6].slots = result;
        jsonWrite(res, arr);
    });
    // conn.query(sql, [params.name, params.price], function(err, result) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     if (result) {
    //         var sql2 = $sql.parcel.getParcelTanks;
    //         var arr = result;
    //         console.log('1');
    //         for (let el of result) {
    //             conn.query(sql2,[el.id, arr], function(err, result) {
    //                 if (err) {
    //                     console.log(err);
    //                 }
    //                 if (result) {

    //                     arr[el.id].slots = result;
    //                     console.log('2');
    //                 }
    //                 if(el.id == result.length){
    //                     console.log('3');
    //                     jsonWrite(res, arr);
    //                 }
    //             });
    //         }

    //     }
    // })
});
router.get('/get-parcel-tanks/:id', (req, res) => {
    var sql = $sql.parcel.getParcelTanks;
    // var params = req.body;
    // console.log(params);
    conn.query(sql, req.params.id, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

module.exports = router;