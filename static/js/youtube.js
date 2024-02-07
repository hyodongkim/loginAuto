var count = 0;

function youtubeAPI(videoId, selector="#playerable",
options ={},
events ={}){
                let body = document.querySelector(selector);
                let child = document.createElement("div");
                body.appendChild(child);
                child.id = btoa(`afsdfsd(#asdfaf)${count}afsdfsd(#asdfaf)${count * count}`);
                count +=1;
                body.innerHTML = `<div id="${targetId}"></div>`;
                new YT.Player(child.id, {
                    height:options.height || 360, width:options.width || 640, videoId:videoId,
                    playerVars:{
                        'mute':options.mute || 1,
                        'controls':options.controls || 1,
                        'autoplay':options.autoplay || 0,
                    events:{
                        'onReady':events.ready,
                        'onstateChange':  events.state.change,
                        'onError':events.error
                        }
                    }
                });
            }
            youtubeAPI(document.getElementById("youtube_player").dataset.begin);
     