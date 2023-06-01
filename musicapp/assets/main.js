const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'V Player';

const btnmain = $(".btn-main");
const heading = $(".title-heading");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-play");
const progress = $("#progress");
const nextBtn = $(".btn-forward");
const preBtn = $(".btn-backward");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist-music")
var isPlaying = false;
var isRandom = false;
var isRepeat = false;

const app = {
  currentindex: 0,
  config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setconfig:function(key,value){
    this.config[key]=value;
    localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))

  },
  songs: [
    {
      name: "Không thể cùng nhau suốt kiếp",
      singer: "Hòa minzy",
      path: "./assets/musiclink/Kothecungnhausuotkiep.m4a",
      img: "./assets/img/Kothecungnhausuotkiep.jpg",
    },
    {
      name: "What do you mean",
      singer: "Justin Bieber",
      path: "./assets/musiclink/Whatdoyoumean.mp3",
      img: "./assets/img/whatdoyoumean.jpg",
    },
    {
      name: "Thuận theo ý trời",
      singer: "Bùi Anh Tuấn",
      path: "./assets/musiclink/Thuantheoytroi.mp3",
      img: "./assets/img/Thuantheoytroi.jpg",
    },
    {
      name: "Đưa em về nhàa",
      singer: "Chillies",
      path: "./assets/musiclink/Duaemvenhaa.mp3",
      img: "./assets/img/Duaemvenhaa.jpg",
    },
    {
      name: "Nếu lúc đó",
      singer: "Tlinh",
      path: "./assets/musiclink/neulucdo.mp3",
      img: "./assets/img/Neulucdo.jpg",
    },
    {
      name: "Hoa nở không màu",
      singer: "Hoài Lâm",
      path: "./assets/musiclink/Hoanokhongmau.mp3",
      img: "./assets/img/Hoanokhongmau.jpg",
    },
    {
      name: "Giữa đại lộ đông tây",
      singer: "Uyên Linh",
      path: "./assets/musiclink/Giuadailodongtay.mp3",
      img: "./assets/img/Giuadailodongtay.jpg",
    },
  ],
  render: function () {
    _this = this;
    const htmls = this.songs.map((song,index) => {
      return `
      <div class="playlist-music-item ${index === _this.currentindex ?'active' :''}" data-index="${index}">
                <div class = "playlist-music--img" style="background-image: url('${song.img}')" alt=""></div>
                <div class="playlist-music--heading">
                    <div class="playlist-music--name">
                    ${song.name}
    
                    </div>
                    <div class="playlist-music--singer">
                    ${song.singer}
        
                    </div>
                </div>
                <div class="playlist-music--detail">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
        `;
    });
    $(".playlist-music").innerHTML = htmls.join("\n");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentsong", {
      get: function () {
        return this.songs[this.currentindex];
      },
    });
    
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    // Xử lí CD quay / dừng
   const cdThumbAnimation = cdThumb.animate([
        {
            transform:'rotate(360deg)'
        }
    ],{
        duration:10000, // 10 seconds
        iterations: Infinity 
    });
    
    
    document.onscroll = function () // Thu nhỏ cd khi scroll
    {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    // xử lí khi click play
    btnmain.onclick = function () {
      if (isPlaying === false) {
        audio.play();
      } else {
        audio.pause();
      }
    };
    // khi audio đang play
    audio.onplay = function () {
      cdThumbAnimation.play();
      btnmain.classList.remove("btn-pause");
      btnmain.classList.add("btn-play");
      isPlaying = true;
    };
    // khi audio đang pause
    audio.onpause = function () {
        cdThumbAnimation.pause();
      btnmain.classList.remove("btn-play");
      btnmain.classList.add("btn-pause");
      isPlaying = false;
    };
    // khi tiến độ bài hát thay đổi ( khi dùng ontimeupdate sẽ lấy được currentime ...)
    audio.ontimeupdate = function()
    {
        if(audio.duration)
        {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent;
        }

    }
    // xử lí khi tua song
    progress.onchange = function(e)
    {
        
        const seekTime = (audio.duration*e.target.value)/100;
        audio.currentTime = seekTime;

    }
    // Khi next song
    nextBtn.onclick = function()
    {
      if (isRandom === true)
      {
        _this.playRandom();

      }else {
        _this.nextSong();
      }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
    } // Khi pre song
    preBtn.onclick = function()
    {
      if (isRandom === true)
      {
        _this.playRandom();

      }else {
        _this.preSong();
      }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
    }
    // xử lí bật tắt random
    randomBtn.onclick = function()
    {
      
      isRandom = !isRandom;
      _this.setconfig('isRandom',isRandom)
       randomBtn.classList.toggle('active',isRandom)

       
    }
    repeatBtn.onclick = function()
    {
      isRepeat = !isRepeat;
      _this.setconfig('isRepeat',isRepeat)
      repeatBtn.classList.toggle('active',isRepeat);
      

    }
    // Xử lí next song khi audio ended
    audio.onended = function()
    {
      if (isRandom === true && isRepeat === false)
      {
        _this.playRandom();

      }else if (isRandom === false && isRepeat === true)
      {
        _this.LoadCurrentSong();

      }
      else {
        _this.nextSong();
      }
        audio.play();
    }
    // Lắng nghe hành vi click vào playList
    playList.onclick = function(e) // e trả về chính phần tử mà click vào
    {
      
      const songNode = e.target.closest('.playlist-music-item:not(.active)')
      if(songNode || e.target.closest('.playlist-music--detail'))
      {
         if ( songNode)
         {
          _this.currentindex= Number(songNode.dataset.index);
         _this.LoadCurrentSong();
         _this.render();
         audio.play();
         }else {
          console.log('more detail')
         }

        

      }

    }

  },
  scrollToActiveSong:function()
  {
    setTimeout(()=>
    {
      $(".playlist-music-item.active").scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    },500)

  },
  LoadCurrentSong: function () {
    heading.textContent = this.currentsong.name;
    cdThumb.style.backgroundImage = `url('${this.currentsong.img}')`;
    audio.src = this.currentsong.path;
    

    
  },
  loadConfig:function()
  {
    
    isRandom = this.config.isRandom;
    isRepeat = this.config.isRepeat;
    
  }
  ,
  nextSong: function()
  {
     const _this = this;
     this.currentindex++;
     if (this.currentindex >= this.songs.length)
     {
        _this.currentindex = 0;
     }
     _this.LoadCurrentSong();

     
     
  },
  preSong: function()
  {
     const _this = this;
     this.currentindex--;
     if (this.currentindex < 0)
     {
        _this.currentindex = this.songs.length;
     }
     _this.LoadCurrentSong();

     
     
  },
  playRandom: function()
  {
    _this = this;
    var newIndex;
    do{
      newIndex = Math.floor(Math.random() * _this.songs.length)
    }while(newIndex === _this.currentindex)
     _this.currentindex = newIndex;
     this.LoadCurrentSong();  


  },
  
  start: function () {
    // Gán cấu hình từ Config vào object
    this.loadConfig();
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();
    // Lắng nghe và xử lí các sự kiện
    this.handleEvents();
    this.LoadCurrentSong(); // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    //Render playlist
    this.render();
    repeatBtn.classList.toggle('active',isRepeat);
    randomBtn.classList.toggle('active',isRandom);
  },
 
};

app.start();
