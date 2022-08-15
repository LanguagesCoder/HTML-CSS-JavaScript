const wrapper = document.querySelector(".wrapper"),
      musicImg = wrapper.querySelector(".img-area img"),
      musicName = wrapper.querySelector(".song-details .name"),
      musicArtist = wrapper.querySelector(".song-details .artist"),
      mainAudio = wrapper.querySelector("#main-audio"),
      playPauseBtn = wrapper.querySelector(".play-pause"),
      prevBtn = wrapper.querySelector("#prev"),
      nextBtn = wrapper.querySelector("#next"),
      progressArea = wrapper.querySelector(".progress-area"),
      progressBar = wrapper.querySelector(".progress-bar"),
      repeatBtn = wrapper.querySelector('#repeat-plist'),
      musicList = wrapper.querySelector('.music-list'),
      showMoreBtn = wrapper.querySelector("#more-music"),
      hideMoreBtn = musicList.querySelector("#close"),
      ulTag = wrapper.querySelector("ul");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
});

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src =  `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src =  `songs/${allMusic[indexNumb - 1].img}.mp3`;
};

function playMusic() {
    wrapper.classList.add('paused');
    playPauseBtn.querySelector('i').innerText = "pause";
    mainAudio.play();
};

function pauseMusic() {
    wrapper.classList.remove('paused');
    playPauseBtn.querySelector('i').innerText = "play_arrow";
    mainAudio.pause();
};

function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
};

function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
};

playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

nextBtn.addEventListener('click', () => {
    nextMusic();
});

prevBtn.addEventListener('click', () => {
    prevMusic();
});

mainAudio.addEventListener('timeupdate', (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector('.current'),
        musicDuration = wrapper.querySelector('.duration');

    mainAudio.addEventListener("loadeddata", () => {
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);

        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }

        if(totalMin < 10){
            totalMin = `0${totalMin}`;
        }

        musicDuration.innerText = `${totalMin}:${totalSec}`
    });
    let CurrentMin = Math.floor(currentTime / 60);
    let CurrentSec = Math.floor(currentTime % 60);

    if(CurrentSec < 10){
        CurrentSec = `0${CurrentSec}`;
    }

    if(CurrentMin < 10){
        CurrentMin = `0${CurrentMin}`;
    }

    musicCurrentTime.innerText = `${CurrentMin}:${CurrentSec}`
});

progressArea.addEventListener('click', (e) => {
    let progressWidthVal = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
    playMusic();
});

repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;

    switch(getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song Looped")
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback Shuffled")
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist Looped")
            break;
    };
});

mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;

    switch(getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randText = Math.floor((Math.random() * allMusic.length) + 1)
            do {
                randText = Math.floor((Math.random() * allMusic.length) + 1)
            }while(musicIndex == randText);
            musicIndex = randText;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    };
});

showMoreBtn.addEventListener('click', () => {
    musicList.classList.toggle("show");
});

hideMoreBtn.addEventListener('click', () => {
    showMoreBtn.click();
});

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}"  src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`
    
    ulTag.insertAdjacentHTML("beforeend", liTag)

    let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`)
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`)

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);

        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }

        if(totalMin < 10){
            totalMin = `0${totalMin}`;
        }

        liAudioDurationTag.innerText = `${totalMin}:${totalSec}`
        liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`)
    })
}

const allLiTags = ulTag.querySelectorAll("li");

function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector('.audio-duration')

        if(allLiTags[j].classList.contains('playing')){
            allLiTags[j].classList.remove('playing');
            let adDuration = audioTag.getAttribute('t-duration');
            audioTag.innerHTML = adDuration;
        }

        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add('playing');
            audioTag.innerText = "Playing"
        }
    
        allLiTags[j].setAttribute("onclick", "clicked(this)")
    }
};

function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}