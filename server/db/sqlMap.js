var sqlMap = {
    parcel: {
        getList: 'select id, name, size from parcel',
        getParcelTanks:'SELECT id, name, slotId, pin, backgroundColor FROM tank where parcelId = ? and isExported = 0',
    },
    user: {
        getUsersList: 'select id, username, userRole from user',
        getUserGroupsList: 'select id, name from dictionary_user_roles'
    },
    manufacturer: {
        getList: 'select id, name from dictionary_manufacturer where deleted = 0',
        add: 'insert into dictionary_manufacturer (name) values (?)'
    },
    capacity: {
        getList: 'select id, name from dictionary_capacity where deleted = 0',
        add: 'insert into dictionary_capacity (name) values (?)'
    },
    owner: {
        getList: 'select id, name from dictionary_owner where deleted = 0',
        add: 'insert into dictionary_owner (name) values (?)'
    },
    valve: {
        getList: 'select id, name from dictionary_valve where deleted = 0',
        add: 'insert into dictionary_valve (name) values (?)'
    },
    tank: {
        add:"INSERT INTO tank(name, parcelId, slotId, manufacturerId, capacityId, ownerId, valveId, pin, productionYear, comment, workComment, backgroundColor, invoice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        edit: "UPDATE tank SET name=?, parcelId=?, slotId=?, manufacturerId = ?, capacityId = ?, ownerId = ?, valveId = ?, pin = ?, productionYear = ?, comment = ?, workComment = ?, backgroundColor = ?, invoice = ? WHERE id = ?",
        export:"UPDATE tank SET isExported = ?, city = ?, street = ?, exportDate = ? WHERE id = ?",
        deliver:"UPDATE tank SET isDelivered = 1, deliverDate = ?, installation = ?, transportComment = ? WHERE id = ?",
        move:"UPDATE tank SET parcelId = ?, slotId = ? WHERE parcelId = ? AND slotId = ?",
        // get:"select * from tank where tank.id = ?",
        get:
        'SELECT t.id, '+
        't.name, '+
        't.parcelId, '+
        't.slotId, '+
        'dm.id as manufacturerId, '+
        'dm.name as manufacturerName, '+
        'dc.id as capacityId, '+
        'dc.name as capacityName, '+
        'do.id as ownerId, '+
        'do.name as ownerName, '+
        'dv.name as valveId, '+
        't.pin, '+
        't.productionYear, '+
        't.comment, '+
        't.workComment, '+
        't.backgroundColor, '+
        't.invoice, '+
        't.transportComment '+
        'FROM tank t '+
        'LEFT JOIN dictionary_manufacturer dm ON dm.id = t.manufacturerId '+
        'LEFT JOIN dictionary_capacity dc ON dc.id = t.capacityId '+
        'LEFT JOIN dictionary_owner do ON do.id = t.ownerId '+
        'LEFT JOIN dictionary_valve dv ON dv.id = t.valveId '+
        'WHERE t.id = ?',
        getActiveTanksList:
        'SELECT t.id, '+
        't.name, '+
        'p.name as parcel, '+
        't.slotId, '+
        'dm.id as manufacturerId, '+
        'dm.name as manufacturerName, '+
        'dc.id as capacityId, '+
        'dc.name as capacityName, '+
        'do.id as ownerId, '+
        'do.name as ownerName, '+
        'dv.id as valveId, '+
        'dv.name as valveName, '+
        't.pin, '+
        't.productionYear, '+
        't.comment, '+
        't.workComment, '+
        't.backgroundColor, '+
        't.invoice, '+
        't.transportComment '+
        'FROM tank t '+
        'LEFT JOIN dictionary_manufacturer dm ON dm.id = t.manufacturerId '+
        'LEFT JOIN dictionary_capacity dc ON dc.id = t.capacityId '+
        'LEFT JOIN dictionary_owner do ON do.id = t.ownerId '+
        'LEFT JOIN dictionary_valve dv ON dv.id = t.valveId '+
        'LEFT JOIN parcel p ON p.id = t.parcelId '+
        'WHERE t.isExported = 0 AND t.isDelivered = 0'
    },
    onTheRoad: {
        getLis: 'select id, name, city, street from tank where isExported = 1 and isDelivered = 0',
        getList:
        'SELECT t.id, '+
        't.name, '+
        't.city, '+
        't.street, '+
        't.exportDate, '+
        'dm.name as manufacturer '+
        'FROM tank t '+
        'LEFT JOIN dictionary_manufacturer dm ON dm.id = t.manufacturerId '+
        'WHERE t.isExported = 1 and t.isDelivered = 0',
    },
    history: {
        getList: 'select * from tank where isDelivered = 1',
        getListBetween: " select * from tank where isDelivered = 1 AND deliverDate BETWEEN ? AND ?",
    }
}
module.exports = sqlMap;