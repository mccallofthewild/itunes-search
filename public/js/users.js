function SessionsService(){
    var self = this;

     function sendError(errorMessage){
        console.log(errorMessage)
        throw new Error(errorMessage)
        //  return errorMessage;
     }

     var initializeDB = ()=>{
        try{
            var localData = localStorage.getItem('_magentaDB');
            if(localData){
                return;
            }else{
                var toBeStored = {keyTable:{},userDataTable:{}}
                localStorage.setItem("_magentaDB", JSON.stringify(toBeStored));
                callback(toBeStored);
            }
        }
        catch(error){
            console.log(error);
        }
     }

     self.signup = (username, password)=>{
         initializeDB()
         var localData = localStorage.getItem('_magentaDB');
         var DB = JSON.parse(localData)
         var userExists = DB.keyTable[username]
         if(!userExists){
             var randomKey = `${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}`
             DB.keyTable[username] = sjcl.encrypt(password, randomKey);
             DB.userDataTable[randomKey] = {}
             DB.userDataTable[randomKey].songs = {};
             localStorage.setItem("_magentaDB", JSON.stringify(DB));

             var sessionInfo = {
            'key':randomKey
            }
            sessionStorage.setItem('_magentaUserSession', JSON.stringify(sessionInfo))
             
             return DB.userDataTable[randomKey].songs;
         }else{
            sendError("User already exists!")
            throw new Error("USER ALREADY EXISTS")

         }
     }


     self.login = (username, password)=>{
        initializeDB();
        var local = localStorage.getItem('_magentaDB');
        if(!local){sendError("User does not exist!"); return;}
        var DB = JSON.parse(local);
        var encryptedKey = DB.keyTable[username];
        var decryptedKey = sjcl.decrypt(password, encryptedKey);
        var userData = DB.userDataTable[decryptedKey].songs;
        var sessionInfo = {
            'key':decryptedKey
        }

        sessionStorage.setItem('_magentaUserSession', JSON.stringify(sessionInfo))
        return userData;
     }

     self.logout = ()=>{
         sessionStorage.removeItem('_magentaUserSession');
     }

     function storeKey(keyString){
         var key = keyString;
     }
     
     function update(data){
        var localData = localStorage.getItem('_magentaDB');
        var DB = JSON.parse(localData);

        var sessionData = sessionStorage.getItem('_magentaUserSession');
        var userSessionKey = JSON.parse(sessionData).key;

        DB.userDataTable[userSessionKey].songs = data;
        localStorage.setItem('_magentaDB', JSON.stringify(DB))
        console.log(DB)


     }
     
     self.updateData = (data)=>{
        update(data);
        console.log("YEW MADE IT!!!!!!")
     }
}
















SessionsController()
function SessionsController(){

    var self = this;


    var sessionService = new SessionsService();
    
    var sessionString = sessionStorage.getItem('_magentaUserSession');
    if(!!sessionString){
        var sessionJSON = JSON.parse(sessionString);
        var key = sessionJSON.key

        var DBString = localStorage.getItem('_magentaDB');
        var DBJSON = JSON.parse(DBString);

        console.log(DBString)

        var userData = DBJSON.userDataTable[key].songs;
        console.log(DBJSON.userDataTable[key])

        SongController(userData, sessionService);

    }else{ console.log("MDUSIOJ")

                   $.get('-login.html', (data)=>{
                    $('.page-container').html(data)
                    
            });
        loginPage();
    }

    
    
    function loginPage(){
        try{
            $.get('-login.html', (data)=>{
                $('.user-session-container').fadeOut(800, ()=>{
                    $('.page-container').html(data, ()=>{
                        // $('.login-page-container').hide();
                        // $('.login-page-container').fadeIn(1000);
                    });
                    
                });
            });

        }
        catch(error){
            console.log(error)
        }

    }
    function shout(words){
        window.alert(words);
    }

    $('.page-container').on('click', '.logout-btn', function(){
        sessionService.logout();
        loginPage();
    })


    $('body').on('submit', '.login-form', function(a){
        a.preventDefault()
        console.log(a.target.password.value);
        var password = a.target.password.value;
        var username = a.target.username.value;
        try{
            var userData = sessionService.login(username, password)
        }
        catch(error){
            shout("Username or Password is incorrect")
            console.log(error)
            return;
        }
        $.get('-userSession.html', (data)=>{
            $('.page-container').html(data);
        });
        SongController(userData, sessionService);
    })
    
    $('body').on("submit", '.signup-form', function(a){
        a.preventDefault()
        console.log(a.target.password.value);
        var password = a.target.password.value;
        var username = a.target.username.value;
        try{
            var userData = sessionService.signup(username, password);
            location.reload()
        }
        catch(error){
            shout(error);
            return;
        }
        console.log(songsession)
        SongController(userData, sessionService);
    })



  

}


// $('.login-form').ready(function(){

//     $('.login-form').on("submit", function great(a){
//         a.preventDefault()
//         console.log(a.target.password.value);
//         var password = a.target.password.value;
//         var username = a.target.username.value;
//         try{
//             var userData = sessionService.login(username, password)
//             // location.reload()
//         }
//         catch(error){
//             shout("Username or Password is incorrect")
//             console.log(error)
//             return;
//         }
//         SongController(userData, sessionService);
//     });


//      $('.signup-form').on("submit", function great(a){
//         a.preventDefault()
//         console.log(a.target.password.value);
//         var password = a.target.password.value;
//         var username = a.target.username.value;
//         try{
//             var userData = sessionService.signup(username, password);
//             // location.reload()
//         }
//         catch(error){
//             shout(error);
//             return;
//         }
//         console.log(songsession)
//         SongController(userData, sessionService);
//     });

// })


// $(body).on('click', '.playbuttonselector', function(){
    
// })

// $(body).on('ended', 'audio', function(){
//     var currentIndex = $('audio').indexOf(this)
//     $('audio')[currentIndex + 1].play();
// })


// var currentIndex = $('audio').indexOf($('firstthing'))

// $(document.body).on('ended', '${currentsong}')