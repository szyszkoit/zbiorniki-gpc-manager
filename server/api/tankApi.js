var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = require('../db/db');
const $sql = require('../db/sqlMap');
const userMiddleware = require('../middleware/users.js');
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
router.get('/get-manufacturer-list', userMiddleware.isLoggedIn, (req, res) => {
    var sql = $sql.manufacturer.getList;
    var params = req.body;
    console.log(params);
    conn.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.get('/get-capacity-list', userMiddleware.isLoggedIn, (req, res) => {
    var sql = $sql.capacity.getList;
    var params = req.body;
    console.log(params);
    conn.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.get('/get-owner-list', userMiddleware.isLoggedIn, (req, res) => {
    var sql = $sql.owner.getList;
    var params = req.body;
    console.log(params);
    conn.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.get('/get-valve-list', userMiddleware.isLoggedIn, (req, res) => {
    var sql = $sql.valve.getList;
    var params = req.body;
    console.log(params);
    conn.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.get('/get-tanks-list', userMiddleware.isLoggedIn, (req, res) => {
    var sql = $sql.tank.getActiveTanksList;
    var params = req.body;
    console.log(params);
    conn.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.get('/get-exported-tanks', userMiddleware.isLoggedIn, (req, res) => {
    var sql = $sql.onTheRoad.getList;
    var params = req.body;
    console.log(params);
    conn.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

router.post('/get-delivered-tanks', userMiddleware.isLoggedIn, (req, res) => {
    var sql;
    var params = req.body;
    console.log(params);
    if(params.from == null && params.to == null){
        sql = $sql.history.getList;
    } else if(params.from == null){
        params.from = new Date();
        sql = $sql.history.getListBetween;
    } else if(params.to == null) {
        params.to = new Date();
        sql = $sql.history.getListBetween;
    }else{
        sql = $sql.history.getListBetween;
    }
    conn.query(sql,
        [
            params.from,
            params.to,
        ], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.get('/get/:id', userMiddleware.isLoggedIn, (req, res) => {
    var sql = $sql.tank.get;
    var params = req.body;
    console.log(params);
    conn.query(sql, req.params.id, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.post('/add', userMiddleware.isLoggedIn, (req, res) => {
    var sql = $sql.tank.add;
    var params = req.body;
    console.log(params);
    addTank(params, sql, res);

});
router.post('/edit', userMiddleware.isLoggedIn, (req, res) => {
    var sql = $sql.tank.edit;
    var params = req.body;
    console.log(params);
    editTank(params, sql, res);
});
router.post('/export', userMiddleware.isLoggedIn, (req, res) => {
    var sql = $sql.tank.export;
    var params = req.body;
    exportDate = new Date(params.exportDate);
    // exportDate.setHours(exportDate.getHours()+1);
    console.log(params);
    conn.query(sql,
        [
            params.isExported,
            params.city,
            params.street,
            exportDate,
            params.id,
        ], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.post('/deliver', userMiddleware.isLoggedIn, (req, res) => {
    var sql = $sql.tank.deliver;
    var params = req.body;
    console.log(params);
    conn.query(sql,
        [
            params.deliverDate,
            params.installation,
            params.transportComment,
            params.id,
        ], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
router.post('/move', userMiddleware.isLoggedIn, (req, res) => {
    var sql = $sql.tank.move;
    var params = req.body;
    console.log(params);
    conn.query(sql,
        [
            params.moveTo.parcelId,
            params.moveTo.slotId,
            params.currentSlot.parcelId,
            params.currentSlot.slotId,
        ], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
function addTank(params, sql, res){
    if(typeof params.manufacturerId == 'string'){
        addManufacturer(params.manufacturerId)
        .then((result)=>{
            params.manufacturerId = result;
            console.log(params.manufacturerId);
            addTank(params, sql, res);
        });
    }else if(typeof params.capacityId == 'string'){
        addCapacity(params.capacityId)
        .then((result)=>{
            params.capacityId = result;
            console.log(result);
            addTank(params, sql, res);
        });
    }else if(typeof params.ownerId == 'string'){
        addOwner(params.ownerId)
        .then((result)=>{
            params.ownerId = result;
            console.log(result);
            addTank(params, sql, res);
        });;
    }else if(typeof params.valveId == 'string'){
        addValve(params.valveId)
        .then((result)=>{
            params.valveId = result;
            console.log(result);
            addTank(params, sql, res);
        });
    }else{
    console.log('paramsy'+params.manufacturerId);
    conn.query(sql,
        [
            params.name,
            params.parcelId,
            params.slotId,
            params.manufacturerId,
            params.capacityId,
            params.ownerId,
            params.valveId,
            params.pin,
            params.productionYear,
            params.comment,
            params.workComment,
            params.backgroundColor,
            params.invoice,
        ], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            console.log(result+'jyjty');
            jsonWrite(res, result);
        }
    })
    }
}
function editTank(params, sql, res){
    if(typeof params.manufacturerId == 'string'){
        addManufacturer(params.manufacturerId)
        .then((result)=>{
            params.manufacturerId = result;
            console.log(params.manufacturerId);
            editTank(params, sql, res);
        });
    }else if(typeof params.capacityId == 'string'){
        addCapacity(params.capacityId)
        .then((result)=>{
            params.capacityId = result;
            console.log(result);
            editTank(params, sql, res);
        });;
    }else if(typeof params.ownerId == 'string'){
        addOwner(params.ownerId)
        .then((result)=>{
            params.ownerId = result;
            console.log(result);
            editTank(params, sql, res);
        });;
    }else if(typeof params.valveId == 'string'){
        addValve(params.valveId)
        .then((result)=>{
            params.valveId = result;
            console.log(result);
            editTank(params, sql, res);
        });
    }else{
    console.log('paramsy'+params.manufacturerId);
    conn.query(sql,
        [
            params.name,
            params.parcelId,
            params.slotId,
            params.manufacturerId,
            params.capacityId,
            params.ownerId,
            params.valveId,
            params.pin,
            params.productionYear,
            params.comment,
            params.workComment,
            params.backgroundColor,
            params.invoice,
            params.id,
        ], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            console.log(result+'jyjty');
            jsonWrite(res, result);
        }
    })
    }
}
function addManufacturer(value) {
    return promise = new Promise( function(resolve, reject) {
        var sql = $sql.manufacturer.add;
        conn.query(sql, value,  function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(JSON.stringify(result)).insertId);
        }
      });
   })
};
function addCapacity(value) {
    return promise = new Promise( function(resolve, reject) {
        var sql = $sql.capacity.add;
        conn.query(sql, value,  function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(JSON.stringify(result)).insertId);
        }
      });
   })
};
function addOwner(value) {
    return promise = new Promise( function(resolve, reject) {
        var sql = $sql.owner.add;
        conn.query(sql, value,  function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(JSON.stringify(result)).insertId);
        }
      });
   })
};
function addValve(value) {
    return promise = new Promise( function(resolve, reject) {
        var sql = $sql.valve.add;
        conn.query(sql, value,  function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(JSON.stringify(result)).insertId);
        }
      });
   })
};

module.exports = router;