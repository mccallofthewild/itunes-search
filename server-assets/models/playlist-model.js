let dataAdapter = require('./data-adapter'),
  uuid = dataAdapter.uuid,
  schemator = dataAdapter.schemator,
  DS = dataAdapter.DS,
  formatQuery = dataAdapter.formatQuery;


let Playlist = DS.defineResource({
  name: 'playlist',
  endpoint: 'playlists',
  filepath: __dirname + '/../data/playlist.db'
})
function myPlaylist(playlist){
    return {
        id: playlist.id || uuid.v4(),
        name: playlist.name,
        downVotes:playlist.downVotes||0,
        upVotes:playlist.upVotes||0,
        songs: playlist.songs,
        owner: playlist.owner
  }
}
function create(playlist, cb) {
  let playlistObj = myPlaylist(playlist)
  Playlist.create(playlistObj).then(cb).catch(cb)
}

// Updates/overwrites all properties(except id) in an object
function updateAll(id, playlist, cb){
    playlist.id = id;
    getById(id, "", (original)=>{
        Playlist.update(id, myPlaylist(playlist))
        .then(cb)
        .catch(cb)
    })
}

function updateOne(id, idk){

}


function getAll(cb) {
  let sortedPlaylists = (playlists)=>{cb(playlists
          .filter((a)=>{return JSON.stringify(a).includes('preview' && 'artist')})
          .sort((a,b)=>{return (b.upVotes-b.downVotes)-(a.upVotes-a.downVotes)})
          )}
  Playlist.findAll({}).then(sortedPlaylists).catch(cb)
}

function getById(id, query, cb) {
  Playlist.find(id).then(cb).catch(cb)
}

var destroy;

module.exports = {
  create,
  getAll,
  getById,
  updateAll,
  destroy
}

