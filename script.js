console.log("run javascript");
let curentSong = new Audio();
let crrFolder;

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedSecs = secs < 10 ? "0" + secs : secs;
  return `${mins}:${formattedSecs}`;
}

async function getSong(folder) {
  crrFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  // let ahrf = Array.from(div.getElementsByTagName("a"));
  let ahrf = div.getElementsByTagName("a");

  console.log(ahrf);

  let song = [];

  for (let i = 0; i < ahrf.length; i++) {
    if (ahrf[i].href.endsWith(".mp3")) {
      song.push(ahrf[i].href.split(`${crrFolder}`)[1]);
    }
  }

  // ahrf.forEach((element) => {
  //   if (element.href.endsWith(".mp3")) {
  //     song.push(element.href.split("${folder}")[1]);
  //   }
  // });

  //also a format for find .mp3 song in file
  // let song = ahrf
  // .filter(el => el.href.endsWith(".mp3"))
  // .map(el => el.href);

  return song;
}

const playMusic = (track, pause = false) => {
  if (curentSong) {
    curentSong.pause();
  }

  curentSong = new Audio(`${crrFolder}` + track);
  if (!pause) {
    curentSong.play();
    play.src = "items svg/pause.svg";
  }

  document.querySelectorAll(".track-info").forEach((el) => {
    if (el.firstElementChild) {
      el.firstElementChild.innerHTML = decodeURI(track);
      el.lastElementChild.innerHTML = track
        .replaceAll("%20", " ")
        .split("-")[1]
        .replace(".mp3", "");
    }
  });

  // curentSong.addEventListener("timeupdate", () => {
  //   console.log(curentSong.currentTime, curentSong.duration);
  // });

  curentSong.addEventListener("loadedmetadata", () => {
    document.querySelector(".current-time").innerHTML = `${formatTime(
      curentSong.currentTime
    )}`;
    document.querySelector(".total-time").innerHTML = `${formatTime(
      curentSong.duration
    )}`;
    document.querySelector(".progress").style.width = "0%";
  });

  curentSong.ontimeupdate = () => {
    // console.log(curentSong.currentTime, curentSong.duration);
    document.querySelector(".current-time").innerHTML = `${formatTime(
      curentSong.currentTime
    )}`;
    document.querySelector(".total-time").innerHTML = `${formatTime(
      curentSong.duration
    )}`;

    document.querySelector(".progress").style.width =
      (curentSong.currentTime / curentSong.duration) * 100 + "%";
  };

  // document.querySelector("track-info").lastElementChild.innerHTML=track.replaceAll("%20", " ").split("-")[1].replace(".mp3", "")
};

async function main() {
  let songs = await getSong("/songs/song_add/");
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
                <img class="invert-color song_icon" src="items svg/music.svg" alt="">
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

  let rendomSongSelect = Math.round(Math.random() * (songs.length - 1));
  console.log(rendomSongSelect);

  playMusic(songs[rendomSongSelect], true); //play first song

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

  document.querySelector(".progress-bar").addEventListener("click", (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const barWidth = rect.width;
    console.log(
      "clickX:",
      clickX,
      "barWidth:",
      barWidth,
      "rect:",
      rect.left,
      "clientX:",
      e.clientX
    );

    const percentage = Math.max(0, Math.min(clickX / barWidth, 1)); // clamp between 0 and 1
    const seekTime = percentage * curentSong.duration;

    curentSong.currentTime = seekTime;
    document.querySelector(".progress").style.width = percentage * 100 + "%";
  });


  let clamped = 0.5; // default volume level
  curentSong.volume = clamped; // set initial volume
  document.querySelector(".volume-level").style.width = "50%";

  document.querySelector(".volume-bar").addEventListener("click", (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const barWidth = rect.width;
    console.log(clickX, barWidth, rect.left, e.clientX);

    const percent = clickX / barWidth;
    clamped = Math.min(Math.max(percent, 0), 1);
    curentSong.volume = clamped;

    document.querySelector(".volume-level").style.width = clamped * 100 + "%";
  });

  volume_muit_unmuit.addEventListener("click", () => {
    if (curentSong.volume > 0) {
      curentSong.volume = 0;
      document.querySelector(".volume-level").style.width = "0%";
      document.querySelector(".volume-icon img").src =
        "items svg/volume-mute.svg";
    } else {
      curentSong.volume = clamped; // reset to default volume level
      document.querySelector(".volume-level").style.width = clamped * 100 + "%";
      document.querySelector(".volume-icon img").src = "items svg/volume.svg";
    }
  });



  let invertImg = false;
  // hamburger menu show and hide
  document.querySelector(".hamburger-btn").addEventListener("click", () => {
    document.querySelector(".left").classList.toggle("hamburger-btn-manu");

    if (invertImg) {
      document.querySelector(".hamburger-btn img").src =
        "items svg/hamburger.svg";
      document.querySelector(".hamburger-btn").style.transform = "rotate(0deg)";
      invertImg = false;
    } else {
      document.querySelector(".hamburger-btn img").src = "items svg/plas.svg";
      document.querySelector(".hamburger-btn").style.transform =
        "rotate(45deg)";
      invertImg = true;
    }
  });

  // previous song and next song
  previous_song.addEventListener("click", () => {
    if (rendomSongSelect > 0) {
      rendomSongSelect--;
      playMusic(songs[rendomSongSelect]);
    } else {
      rendomSongSelect = songs.length - 1;
      playMusic(songs[rendomSongSelect]);
    }
    console.log("previous song clicked");
  });

  forward_song.addEventListener("click", () => {
    console.log("previous song clicked");
    // let index = songs.indexOf(
    //   curentSong.src.split("${folder}")[1]
    // );

    if (rendomSongSelect < songs.length - 1) {
      // playMusic(songs[index + 1]);
      rendomSongSelect++;
      playMusic(songs[rendomSongSelect]);
      console.log(rendomSongSelect);
    } else {
      // playMusic(songs[0]);
      rendomSongSelect = 0;
      playMusic(songs[rendomSongSelect]);
    }
  });
}

main();
