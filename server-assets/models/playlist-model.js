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

function update(id, playlist, cb){
    playlist.id = id;
    getById(id, "", (original)=>{
        Playlist.update(id, myPlaylist(playlist))
        .then(cb)
        .catch(cb)
    })
}

function destroy(id, cb){
    Playlist.reap(Playlist)


}

function getAll(cb) {
  Playlist.findAll({}).then(cb).catch(cb)
}

function getById(id, query, cb) {
  Playlist.find(id).then(cb).catch(cb)
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  destroy
}

