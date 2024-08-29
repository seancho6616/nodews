var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');

conn = db_connect.getConnection();
let id = '1';
let name = '바지3';
let price = 59000;
let imgname = 'p.jpg';
let values = [name,price,imgname,id];

conn.query(db_sql.item_update, values, (e, result, fields) => {
    if(e){
        console.log('Update Error');
        console.log(e);
    }else{
        console.log('Update OK !');
    }
    db_connect.close(conn);
});