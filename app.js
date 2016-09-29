// Initializes time array to use below
var keyTime = [0]
function getMusic(){
  // pushes time when key is pressed while typing into input.
  keyTime.unshift(Date.now());

  function musicGetter(){
    var artist = document.getElementById('artist').value;
      itunes.getMusicByArtist(artist).then(drawSongs);
  }

  // Checks if user has stopped typing for more than half a second. 
  // If so, search and draw the songs. Runs once every half second.
  var intVl = setInterval(()=>{
    if(Date.now() - keyTime[0] > 500){
      musicGetter();
      clearInterval(intVl);
  }
  },500)
}

function drawSongs(songList){
  var totalLength = songList.length;
  var index = totalLength +1;
  var delay = 0;
  document.getElementById('songs').innerHTML = songList.map((a)=>{
    index--
    return `
        <div class="song" style="z-index:${index};" id="${index}">\
        <div class="artwork-container">\
        <img src="${a.albumArt}" alt="${a.collection}">\
        <div class="img-overlay"></div>\
        </div>\
        <div class="info-container">\
        <div class="song-title">\
        <h3>${a.title}</h3>\
        </div><div class="song-artist">\
        <h4>${a.artist}</h2>\
        </div></div>\
        <div class="controls-container">\
        <audio id="audio${index}" preload="none">\
      <source src="${a.preview}" type="audio/aac">\
        </audio>\ 
        <div class="control back">\
        <a href="#${index-1}" onclick="$('#${index} .fa-pause').click(); $('#${index-1} .fa-play').click()"><i class="fa fa-step-backward fa-3x"></i></a>\
        </div>\
        <div class="control play">\
        <i class="fa fa-play fa-5x" onclick="document.getElementById('audio${index}').load(); document.getElementById('audio${index}').play(); $(this).toggle(); $(this).next().toggle();" id="play${index}"></i>\
        <i class="fa fa-pause fa-5x" style="display:none;" onclick="document.getElementById('audio${index}').pause(); $(this).toggle(); $(this).prev().toggle();" id="play${index}"></i>\
        </div>\
        <div class="control forward">\
        <i class="fa fa-step-forward fa-3x"></i>\
        <span name="${index}"></span>
        </div>\
        </div>\
        </div>`
  }).join('');


  // If user scrolls, do this!
  $(window).scroll(
    ()=>{

      // Runs search bar exit animation
      secondSearchBtn();
      $('.search-bar').css({'width':'0%', 'opacity':'0.0'});

      // Consistent variables that don't need to be checked once for every element
      var scrollTop = $(window).scrollTop()
      var scrollpos = scrollTop+window.innerHeight;
      var height = $('.song').height();

      // Loops through all the songs in HTML and checks if they are within 300px of being visible.
        // If they are, they will be passed through the animateTiles function.
      for(var a=1; a <= $('.song').length; a++){
        var top = $('#'+ a).offset().top;
        var bottom = top + height;
          if(!(top > scrollpos+300 || bottom < scrollTop-300)){
            animateTiles(a)
          }
      }
    })

  // closing drawSongs function
}

// Gives tiles the "ferris wheel" effect
function animateTiles(id){
  // Converts id to jQuery object
  var num = `#${id}`;
  var el = $(num);

  // Finds how far song tile is from the top
  var offset = el.offset().top;

  // Finds how many px from the top of the window the center of the song tile is
  var elCenterPos = (a)=>{return (($(a).height()/2 + offset) - $(window).scrollTop());}

  // Divides the distance from the top of the window to center of tile by the total height of the window to get a decimal <= 1
  var percent = (elCenterPos(num) / window.innerHeight);

  // Subtracts 0.5 from current percent so that the center of the page (50%) is where the variable equals zero.
  // Squares percent to essentially put each tile on a parabola.
  // Google "graph x^2" if this is confusing.
  var parabolaPercent = ((percent-0.5)**2);

  // Normally distributes the tile's rotation. Ended up being too steep.
  // var guassianPercent = Math.E**((-(percent-0.5))**2)

  // Multiplies the decimal by total desired rotation. Rounds result for CSS parsing.
  var rotateX = Math.round(parabolaPercent*180);

  // var rotateX = Math.round(1-guassianPercent)*90;

  // var scale = (1**percent);

  // Changes position relative to scroll.
  var transforms = `${-((Math.abs(percent**2)))*80}%`;
  // var element = $(id);

  // Applies variables as css attributes. Used transitions in css file for smooth animation. 
   el.css({'bottom': transforms, 'transform': `rotateX(${rotateX}deg)`})
}


// Form animation to open search
function firstSearchBtn(){
  $('body').scrollTop(0);
  document.getElementById('artist').value = "";
  $('.search-bar').css({'width':'100%','opacity':'1.0'});
  $('.search-container').css({'height':'100%', 'background':'linear-gradient(to bottom, #0E1555, #0E1555, #0E1555, transparent)'});
  $('.songs-container').css({'transform': 'translateY(100%)'});
  $('input#artist').select();

}

// Form animation to close search
function secondSearchBtn(){
  $('.search-container').css({'height':'15%'})
  setTimeout(()=>{$('.search-container').css({'background':'transparent'});}, 1000);
  $('.songs-container').css({'transform':'translateY(10px)'});

}

// Hides songs on until all are loaded. Prevents glitchy css.
// $('.songs-container').load(function(){
//  $('.songs-container').css('opacity','1.0')
// });



// Something I didn't finish
function songProgress(a){
  var song = $(`#${a} audio`)[0];
  setInterval(
    ()=>{
      var position = song.currentTime / song.duration

    },0
  )
}