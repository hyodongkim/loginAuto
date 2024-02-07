let videos = document
.querySelector("#youtubePlayer")
.dataset.videos.split(",");
for(let video of videos){
    youtubeAPI(video,"#youtubePlayer");
}