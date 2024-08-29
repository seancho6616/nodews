// 라이브러리, 선언등

require('dotenv').config();
const express=require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser')  
const app = express();
const port = process.env.SERVER_PORT || 3000;

// MYSQL Database Connection
var db_connect = require('./db/db_connect');
var db_sql = require('./db/db_sql');

// session 저장소 지정(메모리)
// 라이브러리  (로그인처리)
const session = require('express-session');
const MemoryStore = require("memorystore")(session);
const passport = require("passport"),
LocalStrategy = require("passport-local").Strategy;

// My util
var goto = require('./util/goto');


// CORS 지정
const cors = require("cors");
app.use(cors());
// HTML 파일 위치 views
nunjucks.configure('views',{
    express:app,
});


app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));


// -----------------------------------------------------------------------------------------------------------------------------
// 파일 업로드



// -----------------------------------------------------------------------------------------------------------------------------
// Login 처리

// Session 선언
app.use(
    session({
        secret: "secret key",
        resave: false,
        saveUninitialized: true,
    
        store: new MemoryStore({
            checkPeriod: 86400000, // 24 hours (= 24 * 60 * 60 * 1000 ms)
        })
    })
);

// passport 초기화 및 session 연결
app.use(passport.initialize());
app.use(passport.session());

// login이 최초로 성공했을 때만 호출되는 함수
// done(null, user.id)로 세션을 초기화 한다.
passport.serializeUser(function (req, user, done) {
    console.log('serializeUser'+user);
    console.log('serializeUser'+user.id);
    console.log('serializeUser'+user.name);
    console.log('serializeUser'+user.acc);

    done(null, user);
});

// 사용자가 페이지를 방문할 때마다 호출되는 함수
// done(null, id)로 사용자의 정보를 각 request의 user 변수에 넣어준다.
passport.deserializeUser(function (req, user, done) {
    console.log('Login User'+user.name+' '+user.id);
    done(null, user);
});

// local login 전략을 세우는 함수
// client에서 전송되는 변수의 이름이 각각 id, pw이므로 
// usernameField, passwordField에서 해당 변수의 값을 받음
// 이후부터는 username, password에 각각 전송받은 값이 전달됨
// 위에서 만든 login 함수로 id, pw가 유효한지 검출
// 여기서 로그인에 성공하면 위의 passport.serializeUser 함수로 이동

passport.use(
    new LocalStrategy(
        {
            usernameField: "id",
            passwordField: "pwd",
        },
        function (userid, password, done) {
            console.log('--------------------------'+userid);
            console.log('--------------------------'+password);

            conn = db_connect.getConnection();
            conn.query(db_sql.cust_select_one, [userid], (err, row, fields) => {
            
                if(err) throw err;
                
                let result = 0;

                if(row[0] == undefined){
                    return done(null, false, { message: "Login Fail " });
                }else if(row[0]['pw'] != password){
                    return done(null, false, { message: "Login Fail " });
                }else{
                    let name = row[0]['name'];
                    let email = row[0]['email'];
                    let acc = row[0]['acc'];
                    return done(null, { id: userid, name: name, acc:acc });
                }

            });

        }
    )
);

// login 요청이 들어왔을 때 성공시 / 로, 실패시 /login 으로 리다이렉트
app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/loginerror",
    })
);

app.get('/loginerror', (req,res)=>{
    res.render('index',{
        'centerpage':'loginerror'
    })
})

app.get('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/');
})


// -----------------------------------------------------------------------------------------------------------------------------
// 실행 코드

// http://127.0.0.1/
app.get('/', (req,res)=>{
    conn = db_connect.getConnection();

    conn.query(db_sql.glist_select, function (e, result, fields) {
        try{
            if(e){
                console.log('Select Error');
                throw e;    
            }else{
                console.log(result);
                goto.go(req,res,{'glist' : result});
            }
        } catch(e){
            console.log(e);
        } finally{
            db_connect.close(conn);
        }
    });
});

app.get('/login', (req,res)=>{
    goto.go(req,res,{'centerpage':'login'});
    //res.render('index',{'centerpage':'login'});
});

app.get('/register', (req,res)=>{
    goto.go(req,res,{'centerpage':'register'});
    //res.render('index',{'centerpage':'register'});
});

app.post('/registerimpl', (req,res)=>{
    let id = req.body.id;
    let pw = req.body.pw;
    let name = req.body.name;
    let email = req.body.email;
    let acc = req.body.acc;
    console.log(id,pw,name,email,acc);

    conn = db_connect.getConnection();
    let values = [id,pw,name,email,acc];

    conn.query(db_sql.cust_insert, values, (e, result, fields) => {
        try {
            if(e){
                console.log('Insert Error');
                throw e;
            }else{
                console.log('Insert OK !');
                goto.go(req,res,{'centerpage':'registerok'});
            }
        } catch (e) {
            goto.go(req,res,{'centerpage':'registerfail'});
            console.log(e);
        } finally {
            db_connect.close(conn);
        }
        
    });
});
app.post("/updateimpl", (req,res)=>{
    let id = req.body.id;
    let pw = req.body.pw;
    let name = req.body.name;
    let email = req.body.email
    let acc = req.body.acc;

    let values= [pw,name,email,acc,id];
    conn = db_connect.getConnection();

    conn.query(db_sql.cust_update, values, function (e, result, fields) {
        try {
            if(e){
                console.log('Select Error');
                throw e;
            } else {
                res.redirect('/detail?id='+id);
            }
        } catch(e) {
            console.log(e);
        } finally {
            db_connect.close(conn);
        }
    });
});
app.get("/deleteimpl",(req,res)=>{  
    let id = req.query.id;
    conn = db_connect.getConnection();

    conn.query(db_sql.cust_delete, id, function(e, result, fields){
        try {
            if(e){
                console.log('Delete Error');
                throw e;
            }else{
                console.log('Delete OK !');
                res.redirect('/userdetail');
            }
        } catch (e) {
            console.log(e);
        } finally {
            db_connect.close(conn);
        }
        
    });
});
app.get("/detail", (req,res)=>{
    let id = req.query.id;
    console.log(id);
    conn = db_connect.getConnection();
    conn.query(db_sql.cust_select_one, id, function (e, result, fields) {
        try {
            if(e){
                console.log('Select Error');
                throw e;
            } else {
                goto.go(req,res,{'centerpage':'detail','cust':result[0]});
                console.log(result);
            }
        } catch(e) {
            console.log(e);
        } finally {
            db_connect.close(conn);
        }
    });
});
app.get("/userdetail", (req,res)=>{
    conn = db_connect.getConnection();
    conn.query(db_sql.cust_select, function (e, result, fields) {
        try {
            if(e){
                console.log('Select Error');
                throw e;
            } else {
                goto.go(req,res,{'centerpage':'userdetail','cust':result});
                console.log(result);
            }
        } catch(e) {
            console.log(e);
        } finally {
            db_connect.close(conn);
        }
    });
});
app.get('/gamedetail', (req,res)=>{
    let id = req.query.id;
    console.log("id  " + id);
    conn = db_connect.getConnection();
    conn.query(db_sql.glist_select_one, id, function(e, result, fields){
        try{
            if(e){
                console.log("Error");
                throw e;
            }else{
                console.log(result);
                goto.go(req,res,{'centerpage' : 'gamedetail', 'game': result[0]});
            }
        }catch{
            console.log(e);
        }finally{
            db_connect.close(conn);
        }
    //res.render('index', {'centerpage':'item/item2'});
    });
});
app.post("/addcart", (req,res) =>{
    let userid = req.body.userid;
    let itemid = req.body.itemid;
    console.log(userid+" "+itemid);
    // 데이터베이스에 사용자 id, 상품id, 상품이름, 상품금액, 상품총금액, 날짜
    conn = db_connect.getConnection();
    conn.query(db_sql.glist_select_one, itemid, function(e, result, fields){
        try{
            if(e){
                console.log("Error");
                throw e;
            }else{
                //console.log("1" + userid);
                let values = [ userid,  result[0].name, result[0].price, result[0].img]
                console.log("2" + values);
                conn.query(db_sql.cart_insert, values, function(e, result, fields){
                    try{
                        if(e){
                            console.log("Error");
                            throw e;
                        }else{
                            console.log(result);
                            res.redirect('/');
                        }
                    }catch{
                        console.log(e);
                    }});
            }
        }catch{
            console.log(e);
        }finally{
            db_connect.close(conn);
        }
    });
});
app.get("/update",(req,res)=>{ 
    goto.go(req,res,{'centerpage':'update'});
});

const lib = require('./routes/lib');
const deal = require('./routes/deal');
const cart = require('./routes/cart');
const cartm = require('./routes/cartmgt');
const glistmgt = require('./routes/glistmgt');
const blockmgt = require('./routes/blockmgt');
const chart = require('./routes/chart');
const block = require('./routes/block');

app.use('/lib', lib);
app.use('/deal', deal);
app.use('/cart', cart);
app.use('/cartmgt', cartm);
app.use('/glistmgt', glistmgt);
app.use('/blockmgt', blockmgt);
app.use('/chart', chart);
app.use('/block', block);


// -----------------------------------------------------------------------------------------------------
// Server Start
app.listen(port,()=>{
    console.log(`server start port:${port}`)
});


