

function User(db) {
    this.db = db;
}

User.prototype.userLogin = function(params,callback) {
    var sql = "SELECT * FROM user " +
            "WHERE " +
            "email = ? ";
    //io.logger.log("debug", "Socket.io-mysql-session: query: " + io.db.format(sql, params));
    //logger.log("debug", "Socket.io-mysql-session: query: " + db.format(sql, params));
    this.db.query(sql, [params.email], function(error, results, fields){
            // console.log(results[0]);
        if(error || !results[0]){

            console.log('userGet-empty');
            callback(null);

        } else {
            user = results[0];

            var bcrypt = require('bcrypt');
            //console.log('bcrypt: ',bcrypt.compareSync(params.password, user.password));

            
            bcrypt.compare(params.password, user.password, function(err, matches) {
                if (err){
                    console.log('Error while checking password');
                    console.log('userGet-error password check ');
                    callback(null);

                }else if (matches){
                    console.log('The password matches!');
                    //unset pass hash from user object
                    console.log('userGet-ok');
                    callback(user);

                }else{
                    console.log('The password does NOT match!');
                    console.log('userGet-wrong password');
                    callback(null);
                }
            });


            // if(bcrypt.compareSync(params.password, user.password)===true){
            //     console.log('userGet-ok');
            //     callback(user);

            // } else {
            //     console.log('userGet-wrong password');
            //     callback(null);

            // }


            //console.log(user);
            
        }

    }); 
        //return sql;
};
User.prototype.userExistByEmail = function(params,callback) {
    var sql = "SELECT * FROM user " +
            "WHERE " +
            "email = ?";
    //io.logger.log("debug", "Socket.io-mysql-session: query: " + io.db.format(sql, params));
    //logger.log("debug", "Socket.io-mysql-session: query: " + db.format(sql, params));
    this.db.query(sql, params, function(error, results, fields){
            // console.log(results[0]);
        if(error || !results[0]){

            console.log('userExistByEmail=0');
            callback(0);

        } else {
            user = results[0];
            //console.log(user);
            console.log('userExistByEmail=1');
            callback(1);
        }

    }); 
        //return sql;
};
User.prototype.userAdd = function(params,callback) {
    
    params.status = 0;

    var bcrypt = require('bcrypt');

    // bcrypt.hash(params.password, 10, function(err, hash) {
    //     console.log('hash' , hash);

    //     params.password = hash;
    //     var query = this.db.query('INSERT INTO user SET ?', params, function (error, results, fields) {
    //       if (error) {

    //         console.log('userAdd=0 db-insert-err: '+error);
    //         callback(0);
    //       } else {
    //         console.log('userAdd=1 db-insert-ok');
    //         callback(1);
    //       }
          
    //     });


    // });


    params.password = bcrypt.hashSync(params.password, 10);
    var query = this.db.query('INSERT INTO user SET ?', params, function (error, results, fields) {
      if (error) {
        console.log('userAdd=0 db-insert-err: '+error);
        callback(0);
      } else {
        console.log('userAdd=1 db-insert-ok');
        callback(1);
      }
      
    });

};

module.exports = User;

// class User {
//     constructor(db){
//         this.db = db;
//     }

//     login(){

//     }
// }