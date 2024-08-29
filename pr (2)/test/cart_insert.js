var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');
conn = db_connect.getConnection();

let userid = 'id01';
let itemid = 18;
let count = 2;



conn.query(db_sql.item_select_one, itemid, function (e, result, fields) {
    try {
        if(e){
            console.log('Select Error');
            throw e;
        }else{
            console.log(result[0].name);
            console.log(result[0].price);
            console.log(result[0].price*count);
            
            let values = [userid, itemid, result[0].name, result[0].price, count, result[0].price*count];

            conn.query(db_sql.cart_insert, values,function (e, result, fields) {
                try {
                    if(e){
                        console.log('insert Error');
                        throw e;
                    }else{
                        console.log('insert ok');
                    }        
                } catch (e) {
                    throw e;
                }
            });


        }        
    } catch (e) {
        console.log(e);
    } finally{
        db_connect.close(conn);
    }
});