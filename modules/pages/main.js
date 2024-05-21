const express = require("express");
const router = express.Router();

async function youtubeFetch(target, options = { part: "snippet" }) {
  let query = `?key=${process.env.YOUTUBE_API}`;
  for (let key in options) {
    query += `${key}=${options[key]}`;
  }
  return await (
    await fetch(`https://www.googleapis.com/youtube/v3/${target}${query}`)
  ).json();
}

router.get("/youtubelist", require("../role/any"), async (req, res, next) => {
  let jsons = youtubeFetch("search", {
    q: req.query.q || "최신가요",
    part: "snippet",
    type: "video",
    location: "37.3400,126.5741",
    locationRadius: "350km",
    maxResults: req.query.results || 5,
    order: req.query.order || "relevance",
    publishedAfter: `${date.toISOString()}`,
    relavanceLanguage: "kor",
    regionCode: "KR",
    safeSearch: "none",
    videoDuration: "medium",
  });
  let videos = [];
  for (let item of jsons.items) {
    videos.push(item.id.videos);
  }
  // `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${process.env.YOUTUBE_API}&type=video&location=37.3400,126.5741&locationRadius=350km&maxResults=50&order=relevance&regionCode=KR&safeSearch=none&videoDuration=short`
  res.locals.videos = "baaNwRAhHBo,baaNwRAhHBo,baaNwRAhHBo";
  res.render("youtubelist");
});

router.get("/nextAds", require("../role/any"), async (req, res, next) => {
  let video;
  if (req.session.leftVideos) {
    let results = req.session.leftVideos;
    let index = parseInt(Math.random() * results.length);
    video = results[index];
    delete results[index];
    results = results.filter((r) => r);
    if (results.length < 1) {
      results = await (
        await fetch(
          "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=AIzaSyAB7jesp2Et9CF32yNtPuNdB2LySYGmoL4&playlistId=PLvagogV4avthbgsEv70XpQp_Y9i5XEAgU&maxResults=50",
          { method: "get" }
        )
      ).json();
      results = results.items.map((e) => e.snippet.resourceId.videoId);
    }
    req.session.leftVideos = results;
  } else {
    let results = await (
      await fetch(
        "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=AIzaSyAB7jesp2Et9CF32yNtPuNdB2LySYGmoL4&playlistId=PLvagogV4avthbgsEv70XpQp_Y9i5XEAgU&maxResults=50",
        { method: "get" }
      )
    ).json();
    results = results.items.map((e) => e.snippet.resourceId.videoId);
    let index = parseInt(Math.random() * results.length);
    video = results[index];
    delete results[index];
    results = results.filter((r) => r);
    req.session.leftVideos = results;
  }
  res.send(video);
});

router.get("/home", require("../role/any"), async (req, res, next) => {
  let video;
  if (req.session.leftVideos) {
    let results = req.session.leftVideos;
    let index = parseInt(Math.random() * results.length);
    video = results[index];
    delete results[index];
    results = results.filter((r) => r);
    if (results.length < 1) {
      results = await (
        await fetch(
          "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=AIzaSyAB7jesp2Et9CF32yNtPuNdB2LySYGmoL4&playlistId=PLvagogV4avthbgsEv70XpQp_Y9i5XEAgU&maxResults=50",
          { method: "get" }
        )
      ).json();
      results = results.items.map((e) => e.snippet.resourceId.videoId);
    }
    req.session.leftVideos = results;
  } else {
    // let results = await (await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=AIzaSyAB7jesp2Et9CF32yNtPuNdB2LySYGmoL4&playlistId=PLvagogV4avthbgsEv70XpQp_Y9i5XEAgU&maxResults=50', { method:'get' })).json();
    // results = results.items.map(e=>e.snippet.resourceId.videoId);
    // let index = parseInt(Math.random() * results.length);
    // video = results[index];
    // delete results[index];
    // results = results.filter(r=>r);
    // req.session.leftVideos = results;
  }
  res.locals.startVideo = video;

  res.render("home");
});

router.get("/login", require("../role/guest"), (req, res, next) => {
  res.render("login");
});

router.get("/signup", require("../role/guest"), (req, res, next) => {
  res.render("signup");
});

router.get("/boards", require("../role/any"), async (req, res, next) => {
  page = req.query.page || 1;
  keyword = req.query.keyword || "";
  let boards = await req.mongo.board
    .find({
      title: {
        $regex: new RegExp(`.*${keyword}.*`, "i"),
      },
      inner: {
        $regex: new RegExp(`.*${keyword}.*`, "i"),
      },
    })
    .sort({ _id: -1 })
    .skip((page - 1) * parseInt(process.env.PAGE_LIMIT))
    .limit(parseInt(process.env.PAGE_LIMIT));
  let now = new Date();
  now.setHours(now.getHours() - 24);
  let dateformat = (date) => {
    if (now.getTime() > date.getTime())
      return (
        `${(date.getMonth() + 1).toString().padStart(2, "0")}` +
        "/" +
        `${date.getDate().toString().padStart(2, "0")}`
      );
    else
      return (
        `${date.getHours().toString().padStart(2, "0")}` +
        ":" +
        `${date.getMinutes().toString().padStart(2, "0")}`
      );
  };
  let count = await req.mongo.board.countDocuments({
    title: {
      $regex: new RegExp(`.*${keyword}.*`, "i"),
    },
    inner: {
      $regex: new RegExp(`.*${keyword}.*`, "i"),
    },
  });
  let pageCount = Math.ceil(count / parseInt(process.env.PAGE_LIMIT));
  let begin =
    page - parseInt(process.env.PAGE_PADDING) < 1
      ? 1
      : page - parseInt(process.env.PAGE_PADDING);
  let end =
    begin + parseInt(process.env.PAGE_COUNT) - 1 <= pageCount
      ? begin + parseInt(process.env.PAGE_COUNT) - 1
      : pageCount;
  if (end === pageCount) {
    begin =
      end - parseInt(process.env.PAGE_COUNT) + 1 < 1
        ? 1
        : end - parseInt(process.env.PAGE_COUNT) + 1;
  }
  res.locals = {
    boards: boards,
    page: page,
    begin: begin,
    end: end,
    last: pageCount,
    keyword: keyword,
    dateformat: dateformat,
    splittoken: process.env.MEDIAPATH_SPLIT_TOKEN,
  };
  res.render("boards");
});
router.get("/board/:id", require("../role/any"), async (req, res, next) => {
  let board = await req.mongo.board.findOne({ _id: req.params.id });
  let replys = await req.mongo.reply.find({ board: board._id });
  // let replys = await req.mongo.reply.find({board:board._id, ownreply:undefined})
  //                         .sort({_id:-1})
  //                         .skip((page - 1) * parseInt(process.env.PAGE_LIMIT))
  //                         .limit(parseInt(process.env.PAGE_LIMIT));

  function replysfn(inner_replys, lpad) {
    let result = "";
    for (let reply of inner_replys) {
      result += `<details style="padding-left:${lpad}px">
                    <summary>
                        <span>${reply.author}</span>
                        <span>${reply.inner}</span>
                    </summary>
                    ${replysfn(
                      replys.filter((r) => reply._id.equals(r.ownreply)),
                      lpad
                    )}
                    <form action="${`/board/${req.params.id}`}${`?page=${page}${
        keyword ? `&keyword=${keyword}` : ""
      }`}" method="post">
                        <input type="text" hidden name="own" value="${
                          reply._id
                        }">
                        <input type="text" name="reply">
                        <button type="submit">등록</button>
                    </form>
                </details>`;
    }
    return result;
  }

  res.render("board", {
    board: board,
    page: req.query.page,
    keywrod: req.query.keyword,
    id: req.params.id,
    replys: replysfn(
      replys.filter((r) => !r.ownreply),
      20
    ),
    splittoken: process.env.MEDIAPATH_SPLIT_TOKEN,
  });
});

router.get("/boardwrite", require("../role/user"), (req, res, next) => {
  res.render("boardwrite");
});

router.get(
  "/boarddeleteTest",
  require("../role/any"),
  async (req, res, next) => {
    await req.mongo.board.deleteMany({});
    res.redirect("/home");
  }
);

router.get(
  "/boardwriteTest",
  require("../role/user"),
  async (req, res, next) => {
    for (let i = 0; i < 300; i += 1) {
      let board = new req.mongo.board();
      board.inner = "";
      board.author = req.user.id;
      board.title = "제목";
      board.writedate = new Date();
      board.type = "none";
      board.mediapath = "";
      await board.save();
    }
    res.redirect("/home");
  }
);

module.exports = router;
