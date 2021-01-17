const musicContainer = document.getElementById('music-container');

const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const soundBtn = document.getElementById('sound');

const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');

const title = document.getElementById('title');
const cover = document.getElementById("cover");

const form = document.getElementById('form');
const text = document.getElementById('text');
const list = document.getElementById('list');

const localStoragePlayList = JSON.parse(localStorage.getItem('playList'));
let playList = localStoragePlayList !== null ? localStoragePlayList : ['ROIvbbg8jMQ'];

// let playList = ['bW3XExLBf7A', 'ROIvbbg8jMQ', 'afqVd6WUmzA'];

let playListIndex = 0;
let player;
let isMuted = false;

function onYouTubeIframeAPIReady() {
        player = new YT.Player('youtube-container', {
        width: '320',
        height: '200',
        videoId: playList[playListIndex],
        playerVars: {rel: 0},//추천영상 안보여주게 설정
        events: {
          'onReady': onPlayerReady, //로딩할때 이벤트 실행
          'onStateChange': onPlayerStateChange //플레이어 상태 변화시 이벤트실행
        }
    });//youTubePlayer1셋팅
}


function onPlayerReady(event) {
    event.target.playVideo();
    cover.src = `https://img.youtube.com/vi/${playList[playListIndex]}/default.jpg`;
}

function onPlayerStateChange(event) {    
    if (event.data === YT.PlayerState.PLAYING) {
        playMusic();
        progressInterval = setInterval(updateProgress, 1000);
    } else if (event.data === YT.PlayerState.ENDED) {
        clearInterval(progressInterval);
        nextMusic();
    } else if (event.data === YT.PlayerState.PAUSED) {
        pauseMusic();
        clearInterval(progressInterval);
    } else if (event.data === -1) {
        playMusic();
    }
}

function changeMusic() {
    player.loadVideoById(playList[playListIndex], 0, 'small');
}

function playMusic() {
    cover.src = `https://img.youtube.com/vi/${playList[playListIndex]}/default.jpg`;
    const musicTitle = player.getVideoData().title;
    title.innerText = musicTitle;

    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');    

    player.playVideo();   
}

function pauseMusic() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    playBtn.querySelector('i.fas').classList.add('fa-play');

    player.pauseVideo();
}

function previousMusic() {
    playListIndex--;
    playListIndex < 0 ? playListIndex = playList.length - 1 : playListIndex;

    changeMusic();
}

function nextMusic() {
    playListIndex++;
    playListIndex > playList.length - 1 ? playListIndex = 0 : playListIndex;

    changeMusic();
}

function selectedMusic(musicId) {    
    playListIndex = playList.indexOf(musicId);
    changeMusic();
}

function addPlayList(e) {
    e.preventDefault();

    const result = parseURL(text.value);

    if(result.host === "www.youtube.com" || result.host === "youtu.be") {
        const musicId = result.searchObject.v;
        playList.push(musicId);
        addPlayListDOM(musicId);
        updateLocalStorage();
    
        text.value = '';
    } else {
        alert('youtube 링크만 입력가능 합니다.');
    }
    
}

function removePlayList(musicId) {    
    playList = playList.filter(item => item !== musicId);
    updateLocalStorage();
    init();
}

function addPlayListDOM(musicId) {
    const item = document.createElement('li');

    item.innerHTML = `<img onclick="selectedMusic('${musicId}')" src='https://img.youtube.com/vi/${musicId}/default.jpg' class='img-li'>
                    <button class="delete-btn" onclick="removePlayList('${musicId}')">
                    <i class="fa fa-times" aria-hidden="true"></i></button>`;
    list.appendChild(item);
}


function updateLocalStorage() {
    localStorage.setItem('playList', JSON.stringify(playList));
}

function updateProgress() {
    const duration = player.getDuration();
    const currentTime = player.getCurrentTime();
    const progressPercent = (currentTime / duration) * 100;
    
    progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = player.getDuration();

    const moveTime = (clickX/ width) * duration;
    player.seekTo(moveTime);
}

function toggleMute() {
    if(isMuted) {
        isMuted = false;
        soundBtn.querySelector('i.fas').classList.remove('fa-volume-mute');
        soundBtn.querySelector('i.fas').classList.add('fa-volume-up');
        player.unMute();
    } else {
        isMuted = true;
        soundBtn.querySelector('i.fas').classList.remove('fa-volume-up');
        soundBtn.querySelector('i.fas').classList.add('fa-volume-mute');
        player.mute();
    }

}

function init() {
    list.innerHTML = '';
    playList.forEach(value => {
        addPlayListDOM(value);
    });
}

play.addEventListener('click', ()=> {
    const isPlaying = musicContainer.classList.contains('play');

    if(isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

init();

form.addEventListener('submit', addPlayList);
prevBtn.addEventListener('click', previousMusic);
nextBtn.addEventListener('click', nextMusic);
soundBtn.addEventListener('click', toggleMute);
progressContainer.addEventListener('click', setProgress);