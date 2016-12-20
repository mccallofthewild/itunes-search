function SongService(storedSongs, SessionService){
    var self = this;
    var _mySongs = storedSongs || {};
    var _songLibrary = {};
    var _songDictionary = {};
    var sessionService = SessionService



        function parseData(songsArr, callback){
            var tempSongs = songsArr;
            console.log("parsing data...")
            for(var i = 0; i<tempSongs.length; i++){
                var cp = tempSongs[i]
                cp.inMyLibrary = false;
                _songLibrary[cp.id] = cp;
                dictionarify(cp)
            }
            // callback(_songLibrary)
            return;
        }



        self.getJSON = {
            getMusicByArtist: function(artist, cb) {
            
            var url = 'https://bcw-getter.herokuapp.com/?url=';
            var url2 = 'https://itunes.apple.com/search?term=' + artist;
            var apiUrl = url + encodeURIComponent(url2);
                    
            return $.getJSON(apiUrl).then(function(response){
                var songList = response.results.map(function (song) {
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
                console.log(songList)
                console.log("LISTING SONGS")
                parseData(songList)
                return songList;
            })
            }
        }



    function dictionarify(song){
        var propnames = Object.getOwnPropertyNames(song);
        for(var i = 0; i < propnames.length; i++){
            var currentpropname = propnames[i];
            var dictionaryProp = _songDictionary[currentpropname];
            var songCurrentProp = song[currentpropname];
            if(!!_songDictionary[currentpropname]){
                if(!!dictionaryProp[songCurrentProp]){
                        _songDictionary[currentpropname][songCurrentProp].push(song);
                }else{
                        dictionaryProp[songCurrentProp] = [song]
                }
            }else{
                _songDictionary[currentpropname] = {};
                _songDictionary[currentpropname][songCurrentProp] = [song];

            }
        }
    }
    self.createTeam = (name)=>{
        var team = new Team(name);
        return team;
    }
    self.createSong = (song)=>{
        song.inMyLibrary = true;
        _mySongs[song.id] = song;
        console.log(sessionService)
        sessionService.updateData(_mySongs);
        
    }
    self.destroySong = (song)=>{
        delete _mySongs[song.id];
        console.log(_mySongs[song.id])
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
    self.getSongs=()=>{
        return _nflSongs;
    }
    self.getsongLibrary = ()=>{
        return _songLibrary
    }
    self.getSongsByX = (x, query)=>{
        new ReferenceError("That Property Does Not Exist.")
        return _songLibrary[x][query]
    }
    self.filterNfl = (query)=>{
        var tempObj = {};
        for(var a in _nflSongs){
            (JSON.stringify(_songLibrary['id'][a]).toLowerCase().includes(query.toLowerCase()))? tempObj[a] = _songLibrary['id'][a] : null;
        }
        console.log(tempObj)
        return tempObj;

    }




}