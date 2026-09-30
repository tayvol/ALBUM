const library=window.ALBUM_LIBRARY||[];
const $=s=>document.querySelector(s);
const albumGrid=$("#albumGrid"),emptyState=$("#emptyState"),albumCount=$("#albumCount"),search=$("#search");
const heroCover=$("#heroCover"),playerCover=$("#playerCover"),playerAlbum=$("#playerAlbum"),playerArtist=$("#playerArtist"),playerTrack=$("#playerTrack");
const lyricsTitle=$("#lyricsTitle"),lyricsBox=$("#lyricsBox"),lyricsLink=$("#lyricsLink"),bars=$("#bars"),progress=$("#progress"),playBtn=$("#playBtn"),prevBtn=$("#prevBtn"),nextBtn=$("#nextBtn"),visualizer=document.querySelector(".visualizer-card");
const tracklistBox=$("#tracklistBox"),tracklistTitle=$("#tracklistTitle"),trackCount=$("#trackCount");
const sorterTitle=$("#sorterTitle"),sorterProgress=$("#sorterProgress"),sorterIntro=$("#sorterIntro"),sorterMatchup=$("#sorterMatchup"),sorterResults=$("#sorterResults"),startSorterBtn=$("#startSorterBtn"),restartSorterBtn=$("#restartSorterBtn"),choiceA=$("#choiceA"),choiceB=$("#choiceB"),choiceATitle=$("#choiceATitle"),choiceBTitle=$("#choiceBTitle"),choiceADuration=$("#choiceADuration"),choiceBDuration=$("#choiceBDuration"),resultsTitle=$("#resultsTitle"),rankingList=$("#rankingList");
let selectedAlbum=library[0]||null,selectedTrackIndex=0,playing=false,progressTimer=null;
let sorter={active:false,sorted:[],queue:[],current:null,low:0,high:0,comparisons:0};

function createBars(){bars.innerHTML="";for(let i=0;i<34;i++){const b=document.createElement("span");b.className="bar";b.style.setProperty("--h",(0.55+Math.random()*1.7).toFixed(2));b.style.animationDelay=(i*.025).toFixed(2)+"s";bars.appendChild(b)}}

function renderAlbums(query=""){
  const q=query.trim().toLowerCase();
  const matches=library.filter(a=>{
    const x=(a.title+" "+a.artist).toLowerCase().includes(q);
    const t=(a.tracks||[]).some(s=>s.title.toLowerCase().includes(q));
    return x||t;
  });
  albumGrid.innerHTML="";
  albumCount.textContent=`${matches.length} / ${library.length}`;
  matches.forEach(a=>{
    const card=document.createElement("article");
    card.className="album-card"+(selectedAlbum?.id===a.id?" active":"");
    card.innerHTML=`<div class="cover"><img src="${a.cover}" alt="${escapeHtml(a.title)} cover" loading="lazy"></div><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.artist)}</p><div class="year">${escapeHtml(a.year||"")} · ${(a.tracks||[]).length} TRACKS</div><button class="sort-album-btn" type="button">SORT SONGS</button>`;
    card.onclick=()=>selectAlbum(a.id);
    card.querySelector(".sort-album-btn").onclick=e=>{e.stopPropagation();selectAlbum(a.id);startSorter();};
    albumGrid.appendChild(card);
  });
  emptyState.hidden=matches.length!==0;
}

function renderTracklist(){
  if(!selectedAlbum){tracklistTitle.textContent="Choose an album";trackCount.textContent="";tracklistBox.innerHTML="";return}
  const tracks=selectedAlbum.tracks||[];
  tracklistTitle.textContent=selectedAlbum.title;
  trackCount.textContent=`${tracks.length} TRACKS`;
  tracklistBox.innerHTML=tracks.map((track,i)=>`
    <button class="track-row ${i===selectedTrackIndex?"active":""}" data-track="${i}">
      <span class="track-number">${String(track.number||i+1).padStart(2,"0")}</span>
      <span class="track-name">${escapeHtml(track.title)}</span>
      <span class="track-duration">${escapeHtml(track.duration||"")}</span>
    </button>`).join("");
  tracklistBox.querySelectorAll(".track-row").forEach(row=>row.addEventListener("click",()=>selectTrack(Number(row.dataset.track))));
}

function selectAlbum(id){
  selectedAlbum=library.find(a=>a.id===id);
  if(!selectedAlbum)return;
  selectedTrackIndex=0;
  heroCover.src=selectedAlbum.cover;
  updatePlayer();
  renderAlbums(search.value);
  document.querySelector("#visualizer").scrollIntoView({behavior:"smooth",block:"center"});
}

function selectTrack(i){
  if(!selectedAlbum?.tracks?.length)return;
  selectedTrackIndex=(i+selectedAlbum.tracks.length)%selectedAlbum.tracks.length;
  updatePlayer();
  document.querySelector("#tracklist").scrollIntoView({behavior:"smooth",block:"start"});
}

function updatePlayer(){
  if(!selectedAlbum)return;
  const tracks=selectedAlbum.tracks||[],track=tracks[selectedTrackIndex];
  playerCover.src=selectedAlbum.cover;
  playerAlbum.textContent=selectedAlbum.title;
  playerArtist.textContent=selectedAlbum.artist;
  if(!track){
    playerTrack.textContent="No tracks loaded.";
    lyricsTitle.textContent="Choose a song";
    lyricsBox.innerHTML='<p class="lyrics-placeholder">Select a track to open its external music/lyrics source.</p>';
    lyricsLink.href=selectedAlbum.lyricsUrl||selectedAlbum.spotify||"#";
  }else{
    playerTrack.textContent=track.title+(track.duration?" · "+track.duration:"");
    lyricsTitle.textContent=track.title;
    lyricsBox.innerHTML='<p class="lyrics-placeholder">Lyrics are not reproduced here. Use the official music/lyrics source for this track.</p>';
    lyricsLink.href=track.lyricsUrl||selectedAlbum.lyricsUrl||selectedAlbum.spotify||"#";
  }
  lyricsLink.style.visibility="visible";
  renderTracklist();
}

function togglePlaying(){
  playing=!playing;
  visualizer.classList.toggle("playing",playing);
  playBtn.textContent=playing?"Ⅱ":"▶";
  clearInterval(progressTimer);
  if(playing){
    let v=0;
    progressTimer=setInterval(()=>{
      v+=.6;progress.style.width=v+"%";
      if(v>=100){
        clearInterval(progressTimer);progress.style.width="0%";playing=false;
        visualizer.classList.remove("playing");playBtn.textContent="▶";
      }
    },100);
  }
}

function escapeHtml(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

search.addEventListener("input",()=>renderAlbums(search.value));
playBtn.addEventListener("click",togglePlaying);
prevBtn.addEventListener("click",()=>selectTrack(selectedTrackIndex-1));
nextBtn.addEventListener("click",()=>selectTrack(selectedTrackIndex+1));
createBars();renderAlbums();updatePlayer();