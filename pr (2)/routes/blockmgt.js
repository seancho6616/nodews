const express=require('express');
const app = express();
const router = express.Router();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser'); 

// Database 연동
var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');

// My Util
var goto = require('../util/goto');


//  /html
// http://127.0.0.1/html
router
    .get("/",(req,res)=>{  
        goto.go(req,res,{'centerpage':'block/list'});
    });
    // .get("/block2",(req,res)=>{   
    //     let id = req.query.id;
    //     conn = db_connect.getConnection();
    //     conn.query(db_sql.cust_select_one, id, (err, result, fields) => {
    //         try{
    //             if(err){
    //                 console.log('Select Error');
    //                 throw err;
    //             }else{
    //                 console.log(result);
    //                 custinfo = result[0];
    //                 console.log(custinfo);
    //                 goto.go(req,res,{'centerpage':'block/block2','custinfo':custinfo});
    //             }
    //         }catch(e){
    //             console.log(e);
    //         }finally{
    //             db_connect.close(conn);
    //         }
    //     });
    // })
    
    
    

module.exports = router;