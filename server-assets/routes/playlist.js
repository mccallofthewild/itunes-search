const router = require('express').Router();
const Playlist = require('../models/playlist-model');
module.exports.mountPath = '/playlists'
module.exports.router = router;

router.route('/:id?')
  .get(function (req, res, next) {
    if (req.params.id) {
      Playlist.getById(req.params.id, req.query.include, function (playlist) {
        if(playlist.stack) { return next(playlist) }
        return res.send(playlist)
      })
    } else {
      Playlist.getAll(function (playlists) {
        if(playlists.stack) { return next(playlists) }
        return res.send(playlists);
      });
    }
  })
  .post(function (req, res, next) {
    Playlist.create(req.body.playlist, function (playlist) {
      return res.send(playlist)
    })
  })
  .put(function (req, res, next) {
    if(req.body.playlist){
        Playlist.updateAll(req.params.id, req.body.playlist, (playlist)=>{
          res.send(playlist)
        })
    }else if(req.body.like){

    }
  })
  .delete(function (req, res, next) {
    Playlist.destroy(req.body.playlist, (response)=>{
        res.send(response)
    })
  })
