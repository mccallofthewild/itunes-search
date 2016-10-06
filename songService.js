function SongService(storedSongs, SessionService){
    var self = this;
    var _mySongs = {} || storedSongs;
    var _songLibrary = {};

    var sessionService = SessionService


        // var debugFlag;
        // try{
        //     var localData = localStorage.getItem('magentaDB');
        //     function parseData(){
        //         var localData = localStorage.getItem('magentaDB');
        //         var tempSongs = JSON.parse(localData);
        //         console.log(tempSongs.splice(0, 20))
        //         for(var i = 0; i<tempSongs.length; i++){
        //             var cp = tempSongs[i]
        //             cp.id = window.btoa(window.btoa(`${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}`)).slice(0,50)
        //             cp.onMyTeam = false;
        //             _songLibrary[cp.id] = cp;
        //             dictionarify(cp)
        //         }
        //         callback(_songLibrary)
        //         return;
        //     }
        //     if(localData){
        //         parseData();
        //     }else{
        //         var bcwProxy = "https://bcw-getter.herokuapp.com/?url=";
        //         var pullURL = bcwProxy + encodeURIComponent(URI);
        //         $.getJSON(pullURL, (data)=>{
        //             var toBeStored = data.body.songs
        //             if(debugFlag){
        //                 console.log("Song Data Ready");
        //                 console.log("Writing Song Data to local  storage...");
        //             }
        //             localStorage.setItem("magentaDB", JSON.stringify(toBeStored));
        //             if(debugFlag){console.log("completed writing song data to local storage!");}
        //             callback(toBeStored);
        //             parseData()
        //         })
        //     }
        // }
        // catch(error){
        //     console.log(error);
        // }




        function parseData(){
            var localData = localStorage.getItem('magentaDB');
            var tempSongs = JSON.parse(localData);
            console.log(tempSongs.splice(0, 20))
            for(var i = 0; i<tempSongs.length; i++){
                var cp = tempSongs[i]
                cp.id = window.btoa(window.btoa(`${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}${Math.floor(Math.random()*9999999999999999)}`)).slice(0,50)
                cp.onMyTeam = false;
                _songLibrary[cp.id] = cp;
                dictionarify(cp)
            }
            callback(_songLibrary)
            return;
        }



        self.getJSON = {
            getMusicByArtist: function(artist, cb) {
            
            var url = '//bcw-getter.herokuapp.com/?url=';
            var url2 = 'https://itunes.apple.com/search?term=' + artist;
            var apiUrl = url + encodeURIComponent(url2);
                    
            return $.getJSON(apiUrl).then(function(response){
                var songList = response.results.map(function (song) {
                    return song;
                        return {
                            title: song.trackName,
                            albumArt: song.artworkUrl60,
                            artist: song.artistName,
                            collection: song.collectionName,
                            price: song.collectionPrice,
                            preview: song.previewUrl,
                            id: song.trackId
                            };
                        })
                return songList;
            })
            }
        }



    function dictionarify(player){
        var propnames = Object.getOwnPropertyNames(player);
        for(var i = 0; i < propnames.length; i++){
            var currentpropname = propnames[i];
            var dictionaryProp = _playersDictionary[currentpropname];
            var playerCurrentProp = player[currentpropname];
            if(!!_playersDictionary[currentpropname]){
                if(!!dictionaryProp[playerCurrentProp]){
                        _playersDictionary[currentpropname][playerCurrentProp].push(player);
                }else{
                        dictionaryProp[playerCurrentProp] = [player]
                }
            }else{
                _playersDictionary[currentpropname] = {};
                _playersDictionary[currentpropname][playerCurrentProp] = [player];

            }
        }
    }
    self.createTeam = (name)=>{
        var team = new Team(name);
        return team;
    }
    self.createSong = (song)=>{
        song.onMyTeam = true;
        _mySongs[song.elias_id] = [song];
        sessionService.updateData(_mySongs)
        
    }
    self.destroySong = (song)=>{
        delete _mySongs[song.elias_id];
        console.log(_mySongs[song.elias_id])
        sessionService.updateData(_mySongs);
        console.log("removing song forevverrr")
    }
    self.getMySongs = ()=>{
        return _mySongs
    }
    self.sortNflSongs = (songs)=>{
        for(var i in songs){
            dictionarify(i)
        }
    }
    self.getNflSongs=()=>{
        return _nflSongs;
    }
    self.getSongsDictionary = ()=>{
        return _songsDictionary
    }
    self.getSongsByX = (x, query)=>{
        new ReferenceError("That Property Does Not Exist.")
        return _songsDictionary[x][query]
    }
    self.filterNfl = (query)=>{
        var tempObj = {};
        for(var a in _nflSongs){
            (JSON.stringify(_songsDictionary['id'][a]).toLowerCase().includes(query.toLowerCase()))? tempObj[a] = _songsDictionary['id'][a] : null;
        }
        console.log(tempObj)
        return tempObj;

    }




}