console.log("run javascript");
let curentSong = new Audio();

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedSecs = secs < 10 ? "0" + secs : secs;
  return `${mins}:${formattedSecs}`;
}

async function getSong() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  // let ahrf = Array.from(div.getElementsByTagName("a"));
  let ahrf = div.getElementsByTagName("a");

  console.log(ahrf);

  let song = [];

  for (let i = 0; i < ahrf.length; i++) {
    if (ahrf[i].href.endsWith(".mp3")) {
      song.push(ahrf[i].href.split("/songs/")[1]);
    }
  }

  // ahrf.forEach((element) => {
  //   if (element.href.endsWith(".mp3")) {
  //     song.push(element.href.split("/songs/")[1]);
  //   }
  // });

  //also a format for find .mp3 song in file
  // let song = ahrf
  // .filter(el => el.href.endsWith(".mp3"))
  // .map(el => el.href);

  return song;
}

const playMusic = (track,pause = false) => {
  if (curentSong) {
    curentSong.pause();
  }

  curentSong = new Audio("/songs/" + track);
  if(!pause){
  curentSong.play();
  play.src = "items svg/pause.svg";
  }

  document.querySelectorAll(".track-info").forEach((el) => {
    if (el.firstElementChild) {
      el.firstElementChild.innerHTML = decodeURI(track);
    }
  });

  // curentSong.addEventListener("timeupdate", () => {
  //   console.log(curentSong.currentTime, curentSong.duration);
  // }); 

  curentSong.ontimeupdate = () => {
    console.log(curentSong.currentTime, curentSong.duration);
    document.querySelector(".current-time").innerHTML = `${formatTime(
      curentSong.currentTime
    )}`;
    document.querySelector(".total-time").innerHTML = `${formatTime(
      curentSong.duration
    )}`;  
  };

  // document.querySelector("track-info").lastElementChild.innerHTML=track.replaceAll("%20", " ").split("-")[1].replace(".mp3", "")
};

async function main() {
  let songs = await getSong();
  console.log(songs);


  console.log(curentSong.src);

  let songAdd = document.querySelector(".songList").firstElementChild;
  console.log(songAdd);
  for (const song of songs) {
    // songAdd.innerHTML = songAdd.innerHTML+`<li>${decodeURIComponent(song)}</li>`;
    // songAdd.innerHTML = songAdd.innerHTML+`<li>${song.replace(/%20/g," ")}</li>`;
    let songu = song.replaceAll("%20", " ");
    songAdd.innerHTML =
      songAdd.innerHTML +
      `
        <li>
            <div class=" songNameInfo flex">
                <img class="invert-color" src="items svg/music.svg" alt="">
                <div>
                    <div class="track-title" >${songu}</div>
                    <div class="track-artist">${songu
                      .split("-")[1]
                      .replace(".mp3", "")}</div>
                </div>
            </div>

                <img class="invert-color" src="items svg/play.svg" alt="">
        </li>
        `;
  }

  //atuch song

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playMusic(
        e.querySelector(".songNameInfo").lastElementChild.firstElementChild
          .innerHTML
      );
    });
  });


  playMusic(songs[0] , true); //play first song

  //play fast song

  // var audio = new Audio(songs[4]);
  // audio.play();

  // audio.addEventListener("loadeddata", () => {
  //   let duration = audio.duration;
  //   console.log(duration);
  // });
  play.addEventListener("click", () => {
    if (curentSong.paused) {
      curentSong.play();
      play.src = "items svg/pause.svg";
    } else {
      curentSong.pause();
      play.src = "items svg/play.svg";
    }
  });
}

main();
