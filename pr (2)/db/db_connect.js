const mysql = require('mysql2');
const config = require('./db_config');

module.exports = {
  getConnection:function(){
    return mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database
    });
  },
  close:function(conn){
    console.log('Close..');
    conn.end();
  }

}

