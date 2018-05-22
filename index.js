const Twit = require('twit');
const sleep = require('sleep');

const bot = new Twit({
  consumer_key: process.env.PATCHYGREEN_TWIT_CONSUMER_KEY,
  consumer_secret: process.env.PATCHYGREEN_TWIT_CONSUMER_SECRET,
  access_token: process.env.PATCHYGREEN_TWIT_ACCESS_TOKEN,
  access_token_secret: process.env.PATCHYGREEN_TWIT_ACCESS_SECRET,
  timeout_ms: 60*1000
});

// Post Example
// bot.post('statuses/update', {status: 'Hello World!'}, (err, data, response) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(`${data.text} was tweeted`);
//   }
// });


// Get Followers List
// bot.get('followers/list', {screen_name: 'patchygreen', count: 200}, (err, data, response) => {
//   if (err) {
//     console.log(err);
//   } else {
//     let i = 1;
//     data.users.forEach((user) => {console.log(`${i++}: ${user.screen_name}`)});
//   }
// });

// get List of People we are following.
// bot.get('friends/list', {screen_name: 'patchygreen', count: 200}, (err, data, response) => {
//   if (err) {
//     console.log(err);
//   } else {
//     let i = 1;
//     data.users.forEach((user) => {console.log(`${i++}: ${user.screen_name}`)});
//   }
// });

// Get connections so you can see if you should follow / unfollow?
// bot.get('friendships/lookup', {screen_name: 'squarespace'}, (err, data, response) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// });


// Send a DM - be aware of Twitter Guidelines.
// bot.post('direct_messages/new', {screen_name: 'brightskydigi', text: 'Hi Hun! from your personal TwitterBot!'}, (err, data, response) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// });

// Check you Timeline
// bot.get('statuses/home_timeline', {count: 5}, (err, data, response) => {
//   if (err) {
//     console.log(err);
//   } else {
//     data.forEach((d) => {
//       console.log(d.text);
//       console.log(d.user.screen_name);
//       console.log(d.id_str, '\n');
//     });
//   }
// });

// // Like a Tweet
// bot.post('favorites/create', {id: '998547338602995712'}, (err, data, response) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// });

// Like a Tweet
function likeTweet(tweet_id) {
  bot.post('favorites/create', {id: tweet_id}, (err, data, response) => {
    if (err) {
      console.log('Error, so reduce likeCount');
      likeCount--;
    }
  });
}
//
// // Unlike 100 tweets
// bot.get('favorites/list', {screen_name: 'patchygreen', count: 100}, (err, data, response) => {
//   if (err) {
//     console.log(err);
//   } else {
//     data.forEach((d) => {
//       console.log(d.text);
//       console.log(d.user.screen_name);
//       console.log(d.id_str);
//       unlikeTweet(d.id_str);
//       sleep.sleep(2);
//       console.log('Deleted \n');
//     });
//   }
// });

// Get a Total Number of Likes. (Max 200)
// function totalLikes(screen_name) {
//   bot.get('favorites/list', {screen_name: screen_name, count: 200}, (err, data, response) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(Object.keys(data).length);
//     }
//   })
// }
//
// totalLikes('patchygreen');

// Search by relevance over the last 7 days.
// bot.get('search/tweets', {q: 'javascript filter:safe', count: 20, result_type: 'popular'}, (err, data, response) => {
//   if (err) {
//     console.log(err);
//   } else {
//     data.statuses.forEach((s) => {
//       console.log(s.text);
//       console.log(s.user.screen_name, '\n');
//     });
//   }
// });

let likeCount = 1;
// Streams - track a particular word or search term
const stream = bot.stream('statuses/filter', {track: '#javascript, #westbrom, #nme', filter: 'safe'});

// Streams - follow a particular user
// const stream = bot.stream('statuses/filter', {follow: '@javascript'});

function startStream() {
  stream.on('tweet', (tweet) => {
    console.log(`${likeCount}:  ${tweet.text} \n`);
    likeTweet(tweet.id_str);
    likeCount++;
    if (likeCount > 20) {
      console.log('Stopping stream...')
      stream.stop();
    }
  });
}

startStream();



