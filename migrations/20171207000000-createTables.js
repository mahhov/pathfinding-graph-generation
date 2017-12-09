let async = require('async');

let dbm;
let type;
let seed;

exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db, callback) {
    return db.createTable('visitor', {
        date: 'TIMESTAMP'
    });
};

exports.down = function (db, callback) {
    return db.dropTable('visitor');
};

exports._meta = {
    'version': 1
};
