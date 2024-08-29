module.exports = {
    go:function(req, res, obj){
        let loginid, loginname;
        if(req.user){
            loginid = req.user.id;
            loginname = req.user.name;
        }
        if(loginid != undefined){
            if(obj != undefined){
                obj.loginid = loginid;
                // {,'loginid':loginid}
                res.render('index',obj);
            }else{
                res.render('index',{'loginid':loginid});
            }
        }else{
            if(obj != undefined){
                res.render('index',obj);
            }else{
                res.render('index');
            }
        }                           
    } // end go function
}