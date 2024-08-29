var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');
conn = db_connect.getConnection();

let userid = 'id01';

conn.query(db_sql.cart_select_one, userid, function (e, result, fields) {
    try {
        if(e){
            console.log('Select Error');
            throw e;
        }else{
            console.log(result);
        }        
    } catch (e) {
        console.log(e);
    } finally{
        db_connect.close(conn);
    }
    
});