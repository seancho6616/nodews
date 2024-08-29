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
    goto.go(req,res,{'centerpage':'chart/chart'});
    
});



module.exports = router;