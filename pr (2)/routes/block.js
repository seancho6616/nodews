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
    id = req.user.id;
    console.log(id);
    conn = db_connect.getConnection();
    conn.query(db_sql.cart_select_one, id, (err, result, fields) => {
        try {
            if(err) {
                console.log('Select Error');
                throw err;
            } else {
                console.log(result);
                custinfo = result;
                console.log(custinfo);
                let count =0;
                custinfo.forEach(custinfo => {
                    count+=custinfo.price
                    console.log(count);
                });
                console.log(count);
                conn.query(db_sql.cust_select_one, id, (err, result, fields) => {
                    user = result[0];
                    goto.go(req,res,{'centerpage':'block/block','custinfo':custinfo, 'user' : user, 'count':count});
                })
            }
        } catch(e) {
            console.log(e);
        } finally {
            db_connect.close(conn);
        }
    });
}).post("/addLib", (req,res) =>{
    id = req.user.id;
    conn = db_connect.getConnection();
    conn.query(db_sql.cart_select_one, id, (err, result, fields) => {
        try {
            if(err) {
                console.log('Error');
                throw err;
            } else {
                console.log(result);
                custinfo = result;
                console.log(custinfo);
                custinfo.forEach(custinfo => {
                    gamelib = [custinfo.gameName, id, custinfo.img];
                    console.log(gamelib);
                    conn.query(db_sql.lib_insert, gamelib, (err, result, fields) => {
                        console.log('Insert Ok');
                    })
                });
                console.log(custinfo);
                custinfo.forEach(custinfo => {
                    deal = [custinfo.gameName, id, custinfo.price, custinfo.img];
                    console.log(deal);
                    conn.query(db_sql.deal_insert, deal, (err, result, fields) => {
                        console.log('Deal Ok');
                    })
                });
                conn.query(db_sql.cart2_delete, id, (err, result, fields)=>{
                    try {
                        if(err){
                            console.log('Delete Error');
                            throw err;
                        }else{
                            console.log('Delete Ok');
                        }
                    }catch(err) {
                        throw err;
                    }
                });
                res.redirect('/lib?id='+id);
            }
        } catch(err) {
            console.log(err);
        } finally {


            db_connect.close(conn);
        }
    })
    
});

module.exports = router;