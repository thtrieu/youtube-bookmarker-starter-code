(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];


    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;
    
        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        } else if (type === "PLAY") {
            youtubePlayer.currentTime = value;
        } else if (type == "DELETE") {
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
            chrome.storage.sync.set({
                [currentVideo]: JSON.stringify(currentVideoBookmarks)
            });

            response(currentVideoBookmarks)
        } else if (type == "FEED") {
            const thumbnails = document.getElementsByClassName('ytd-thumbnail no-transition');
            console.log(thumbnails);
            console.log(thumbnails.length);
            console.log(thumbnails);
            for (i = 0; i < thumbnails.length; ++i) {
                const thumbnail = thumbnails[i];
                console.log(thumbnail);
                thumbnail.innerHTML = '';
            }
        }
    });

    const fetchBookmarks = () => {
        // promise object takes in a function(resolve(), reject())
        // if success, then resolve() is called on the object to return.
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                // chrome.storage.get takes in two arg, first the key, second default(dict)=>...
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]): []);
            })
        })
    }

    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmarks = await fetchBookmarks();

        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];
            
            youtubeLeftControls.appendChild(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    }

    const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };
        
        currentVideoBookmarks = await fetchBookmarks();

        // console.log(currentVideoBookmarks);

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    }
   
    // newVideoLoaded();
})();

const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substring(11, 11+8);
}