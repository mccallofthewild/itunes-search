// var itunes = {
//     getMusicByArtist: function(artist, cb) {
      
//       var url = '//bcw-getter.herokuapp.com/?url=';
//       var url2 = 'https://itunes.apple.com/search?term=' + artist;
//       var apiUrl = url + encodeURIComponent(url2);
            
//       return $.getJSON(apiUrl).then(function(response){
//         var songList = response.results.map(function (song) {
//                   return {
//                       title: song.trackName,
//                       albumArt: song.artworkUrl60,
//                       artist: song.artistName,
//                       collection: song.collectionName,
//                       price: song.collectionPrice,
//                       preview: song.previewUrl,
//                       id: song.trackId
//                     };
//                 })
//         return songList;
//       })
//     }
// }