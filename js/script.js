console.log("run javascript");
let curentSong = new Audio();
let crrFolder;
let crrAlubmsFolders;
let album_name;
let albumSongNo;
let curentSongAlbumeOrNot = false;
let curentSongFevOrNot = false;
let rendomSongSelect;
let albums;
let albumFolders;
let favorites = [];
let favoriteButtons;

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedSecs = secs < 10 ? "0" + secs : secs;
  return `${mins}:${formattedSecs}`;
}

async function getSong(folder) {
  crrFolder = folder;
  // Use relative path instead of absolute URL
  let a = await fetch(folder);
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

  return song;
}

async function getSongAlbums(folder) {
  crrAlubmsFolders = folder;
  // Use relative path instead of absolute URL
  let a = await fetch(folder);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  // let ahrf = Array.from(div.getElementsByTagName("a"));
  let ahrf = div.getElementsByTagName("a");

  console.log(ahrf);

  let song = [];

  for (let i = 0; i < ahrf.length; i++) {
    if (ahrf[i].href.endsWith(".mp3")) {
      song.push(ahrf[i].href.split(`${crrAlubmsFolders}`)[1]);
    }
  }

  return song;
}

const playMusic = (track, pause = false) => {
  if (curentSong) {
    curentSong.pause();
  }

  curentSong = new Audio(`songs/` + track);
  if (!pause) {
    curentSong.play();
    play.src = "items svg/pause.svg";
  }

  const trackParts = track.replaceAll("%20", " ").split("-");
  const artistName =
    trackParts.length > 1
      ? trackParts[1].replace(".mp3", "")
      : "Unknown Artist";
  document.querySelector(
    ".now-playing"
  ).children[1].firstElementChild.innerHTML = decodeURI(
    track.split("/")[track.split("/").length - 1]
  );

  document.querySelector(
    ".now-playing"
  ).children[1].lastElementChild.innerHTML = artistName;

  curentSong.addEventListener("loadedmetadata", () => {
    document.querySelector(".current-time").innerHTML = formatTime(
      curentSong.currentTime
    );
    document.querySelector(".total-time").innerHTML = formatTime(
      curentSong.duration
    );
    document.querySelector(".progress").style.width = "0%";
  });

  curentSong.ontimeupdate = () => {
    // console.log(curentSong.currentTime, curentSong.duration);
    document.querySelector(".current-time").innerHTML = formatTime(
      curentSong.currentTime
    );
    document.querySelector(".total-time").innerHTML = formatTime(
      curentSong.duration
    );

    document.querySelector(".progress").style.width =
      (curentSong.currentTime / curentSong.duration) * 100 + "%";
  };
};

async function displayAlbums() {
  // Use relative path instead of absolute URL
  let a = await fetch(`songs/albums/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let ahrf = div.getElementsByTagName("a");
  let albumsContainer = document.querySelector(".featured-grid");
  let arr = Array.from(ahrf);
  
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (element.href.includes("/songs/albums/")) {
      albumFolders = element.href.split("/").slice(-2)[1];
      // Use relative path instead of absolute URL
      console.log("albumFolders:", albumFolders);
      let a = await fetch(`songs/albums/${albumFolders}/info.json`);
      let response = await a.json();

      albumsContainer.innerHTML =
        albumsContainer.innerHTML +
        `
      <div data-album="${albumFolders}" class="track-card albums-song">
        <div class="track-image"><img src="songs/albums/${albumFolders}/${response.image}" alt=""></div>
        <div class="track-info">
          <div class="track-title">${response.title}</div>
          <p class="track-artist">${response.description}</p>
        </div>
      </div>
    `;
    }
  }

  let alubms;
  Array.from(document.getElementsByClassName("albums-song")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      album_name = item.currentTarget.dataset.album;
      alubms = await getSongAlbums(`/songs/albums/${album_name}/`);

      console.log(album_name);
      curentSongAlbumeOrNot = true;

      let alubmSongAdd = document.getElementById("alubmSongAdd");
      let alubm_songs_adds = "";
      albums = Array.from(alubms);

      for (let i = 0; i < albums.length; i++) {
        let alubm = albums[i];
        let songu = alubm.replaceAll("%20", " ");
        let songTitle = songu;
        let songArtist =
          songu.split("-")[1]?.replace(".mp3", "") || "Unknown Artist";

        alubm_songs_adds += `
  <li class="playSong">
    <div class="songNameInfo flex">
      <img class="invert-color song_icon" src="items svg/music.svg" alt="">
      <div class="albums_song_play">
        <div class="track-title elips-title">${songTitle}</div>
        <div class="track-artist">${songArtist}</div>
      </div>
    </div>
    <img class="invert-color" src="items svg/play.svg" alt="">
    <img class="invert-color like-button favoritesSongs" src="items svg/favorite.svg" alt="">
  </li>
`;
      }

      alubmSongAdd.innerHTML = alubm_songs_adds;

      Array.from(
        document.getElementById("alubmSongAdd").querySelectorAll(".playSong")
      ).forEach((e, index) => {
        e.addEventListener("click", () => {
          rendomSongSelect = index;

          playMusic(
            `albums/${album_name}/` +
              e.querySelector(".albums_song_play").firstElementChild.innerHTML
          );
          console.log(
            "song clicked:",
            `albums/${album_name}/` +
              e.querySelector(".albums_song_play").firstElementChild.innerHTML,
            index
          );
        });
      });

      console.log(alubms);
    });
  });
}

function addToFavoritesSong(favoritesSong) {
  const favoriteIndex = favorites.indexOf(favoritesSong);
  if (favorites.includes(favoritesSong)) {
    favorites.splice(favoriteIndex, 1); // Remove
    console.log(`remove to favorites: ${favoritesSong}`);
  } else {
    favorites.push(favoritesSong); // Add
    console.log(`Added to favorites: ${favoritesSong}`);
  }
  console.log("Current favorites:", favorites);
}

function removeFromFavoritesSong(song) {
  const index = favorites.indexOf(song);
  if (index > -1) {
    favorites.splice(index, 1);
    console.log(`Removed from favorites: ${song}`);
  }
}

function getFavoritesSongs() {
  let songFevAdd = document.getElementById("songfevAdd");
  let songs_fev_adds = "";

  for (const song of favorites) {
    let songu = song.split("/").pop().replaceAll("%20", " ");
    let songTitle = songu;
    let songArtist =
      songu.split("-")[1]?.replace(".mp3", "") || "Unknown Artist";

    songs_fev_adds += `
      <div class="track-card">
        <div class="track-image"></div>
        <img class="invert-color like-button-for-div-song" src="items svg/favorite.svg" alt="">
        <div class="track-info">
          <div class="track-title">${songTitle}</div>
          <div class="track-artist">${songArtist}</div>
        </div>
      </div>
    `;
  }

  songFevAdd.innerHTML = songs_fev_adds;

  let all_songs = Array.from(
    document.querySelector("#songfevAdd").querySelectorAll(".track-card")
  );
  // console.log(all_songs);
  all_songs.forEach((e, index) => {
    e.addEventListener("click", () => {
      curentSongAlbumeOrNot = false;
      curentSongFevOrNot = true;
      rendomSongSelect = index;
      playMusic(favorites[index]);
      console.log(
        "song clicked:" + e.querySelector(".track-title").innerHTML,
        index
      );
    });
  });

  console.log(all_songs);
}

function getSharedSongsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const songList = params.get("songs");
  if (!songList) return [];
  return songList.split(",").map(decodeURIComponent);
}

async function shortenUrl(longUrl) {
  const response = await fetch(`https://api.tinyurl.com/create`, {
    method: "POST",
    headers: {
      Authorization:
        "Bearer i5pb74jmspzw8Cz6kWKpLUy5eveIa52faU8g0LvE5AJXGnL5rcR2fPi4O28g",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: longUrl }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Shortened URL:', data.data.tiny_url);
  
  return data.data.tiny_url;
}

async function main() {

  window.addEventListener("DOMContentLoaded", () => {
    const sharedSongs = getSharedSongsFromURL();
    console.log("Shared songs:", sharedSongs);

    for (const song of sharedSongs) {
      if (!favorites.includes(song)) {
        favorites.push(song);
      }
    }
    console.log("Favorites after sharing:", favorites);
  });

  // Use relative path instead of absolute URL
  let songs = await getSong("songs/song_add/");

  console.log(albums);

  console.log(curentSong.src);
  displayAlbums();
  getFavoritesSongs();

  rendomSongSelect = Math.round(Math.random() * (songs.length - 1));
  console.log(rendomSongSelect);

  // let songAdd = document.querySelector(".songList").firstElementChild;

  let songAdd = document.getElementById("songAdd");

  let songs_adds = "";

  for (const song of songs) {
    let songu = song.replaceAll("%20", " ");

    let songTitle = songu;
    let songArtist =
      songu.split("-")[1]?.replace(".mp3", "") || "Unknown Artist";
    songs_adds += `
    <div class="track-card">
      <div class="track-image"></div>
      <img class="invert-color like-button-for-div-song" src="items svg/favorite.svg" alt="">
      <div class="track-info">
        <div class="track-title">${songTitle}</div>
        <div class="track-artist">${songArtist}</div>
      </div>
    </div>
  `;
  }

  songAdd.innerHTML = songs_adds;

  let all_songs = Array.from(
    document.querySelector(".track-grid").querySelectorAll(".track-card")
  );
  // console.log(all_songs);
  all_songs.forEach((e, index) => {
    e.addEventListener("click", () => {
      rendomSongSelect = index;
      curentSongAlbumeOrNot = false;
      curentSongFevOrNot = false;
      playMusic(
        "song_add/" + e.querySelector(".track-info").firstElementChild.innerHTML
      );
      console.log(
        "song clicked:" + e.querySelector(".track-title").innerHTML,
        index
      );
    });
  });

  playMusic("song_add/" + songs[rendomSongSelect], true); //play first song


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

  // REMOVE THIS ENTIRE BLOCK
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
    if (curentSongAlbumeOrNot) {
      if (rendomSongSelect > 0) {
        rendomSongSelect--;
        playMusic(`albums/${album_name}/` + albums[rendomSongSelect]);
      } else {
        rendomSongSelect = albums.length - 1;
        playMusic(`albums/${album_name}/` + albums[rendomSongSelect]);
      }
      console.log("previous song clicked");
    } else if (curentSongFevOrNot) {
      if (rendomSongSelect > 0) {
        // playMusic(songs[index + 1]);
        rendomSongSelect--;
        playMusic(favorites[rendomSongSelect]);
        console.log(rendomSongSelect);
      } else {
        // playMusic(songs[0]);
        rendomSongSelect = favorites.length - 1;
        playMusic(favorites[rendomSongSelect]);
      }
    } else {
      if (rendomSongSelect > 0) {
        rendomSongSelect--;
        playMusic("song_add/" + songs[rendomSongSelect]);
      } else {
        rendomSongSelect = songs.length - 1;
        playMusic("song_add/" + songs[rendomSongSelect]);
      }
      console.log("previous song clicked");
    }
  });

  forward_song.addEventListener("click", () => {
    // let index = songs.indexOf(
    //   curentSong.src.split("${folder}")[1]
    // );

    if (curentSongAlbumeOrNot) {
      if (rendomSongSelect < albums.length - 1) {
        // playMusic(songs[index + 1]);
        rendomSongSelect++;
        playMusic(`albums/${album_name}/` + albums[rendomSongSelect]);
        console.log(rendomSongSelect);
      } else {
        // playMusic(songs[0]);
        rendomSongSelect = 0;
        playMusic(`albums/${album_name}/` + albums[rendomSongSelect]);
      }
    } else if (curentSongFevOrNot) {
      if (rendomSongSelect < favorites.length - 1) {
        // playMusic(songs[index + 1]);
        rendomSongSelect++;
        playMusic(favorites[rendomSongSelect]);
        console.log(rendomSongSelect);
      } else {
        // playMusic(songs[0]);
        rendomSongSelect = 0;
        playMusic(favorites[rendomSongSelect]);
      }
    } else {
      if (rendomSongSelect < songs.length - 1) {
        // playMusic(songs[index + 1]);
        rendomSongSelect++;
        playMusic("song_add/" + songs[rendomSongSelect]);
        console.log(rendomSongSelect);
      } else {
        // playMusic(songs[0]);
        rendomSongSelect = 0;
        playMusic("song_add/" + songs[rendomSongSelect]);
      }
    }
  });


  favoriteButtons = document.querySelector(".favoritesSongs");
  console.log(
    "favoriteButtons:",
    favoriteButtons,
    "length:",
    favoriteButtons.length
  );

  favoriteButtons.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent the click from propagating to the parent element
    if (curentSongAlbumeOrNot) {
      const currentSongPath =
        `albums/${album_name}/` + albums[rendomSongSelect];
      addToFavoritesSong(currentSongPath);
    } else {
      const currentSongPath = "song_add/" + songs[rendomSongSelect];
      addToFavoritesSong(currentSongPath);
    }

    getFavoritesSongs();
  });

  copyFavoriteSong.addEventListener("click", async () => {
    // e.preventDefault();
    const baseURL = window.location.origin + window.location.pathname; // change to your site
    const query = favorites.map(encodeURIComponent).join(",");
    const shareLink = await shortenUrl(`${baseURL}?songs=${query}`);

    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        alert("Share link copied to clipboard:\n" + shareLink);
      })
      .catch((err) => {
        alert("Failed to copy share link."+err);
      });
  });
}

main();