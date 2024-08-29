const express=require('express');
const app = express();
const router = express.Router();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser'); 
var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');
var goto = require('../util/goto');

router
.get("/",(req,res)=>{ 
    let id = req.user.id;
    conn = db_connect.getConnection();

    conn.query(db_sql.lib_select_one, id, function (e, result, fields) {
        try{
            if(e){
                console.log('Select Error');
                throw e;
            }else{
                goto.go(req,res,{'centerpage':'lib/list','list':result});
            }
        } catch(e){
            console.log(e);
        } finally{
            db_connect.close(conn);
        }
        
    });
    
}); 

module.exports = router;