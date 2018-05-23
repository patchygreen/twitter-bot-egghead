const sleep = require('sleep');
const Twit = require('twit');
const config = require('./functions/config.js');
const bot = new Twit(config);

// const bot = new Twit({
//   consumer_key: process.env.PATCHYGREEN_TWIT_CONSUMER_KEY,
//   consumer_secret: process.env.PATCHYGREEN_TWIT_CONSUMER_SECRET,
//   access_token: process.env.PATCHYGREEN_TWIT_ACCESS_TOKEN,
//   access_token_secret: process.env.PATCHYGREEN_TWIT_ACCESS_SECRET,
//   timeout_ms: 60 * 1000
// });

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

// UnLike a Tweet
function unlikeTweet(tweet_id) {
  bot.post('favorites/destroy', {id: tweet_id}, (err, data, response) => {
    if (err) {
      console.log(err);
    } else {
    }
  });
}

// Like a Tweet
function likeTweet(tweet_id) {
  bot.post('favorites/create', {id: tweet_id}, (err, data, response) => {
    if (err) {
      return 0;
    } else {
      return 1;
    }
  });
}

//
// // Unlike tweets
function unlikeTweets(screen_name) {
  bot.get('favorites/list', {screen_name: screen_name, count: 200}, (err, data, response) => {
    if (err) {
      console.log(err);
    } else {
      data.forEach((d) => {
        console.log(d.text);
        console.log(d.user.screen_name);
        console.log(d.id_str);
        unlikeTweet(d.id_str);
        sleep.sleep(2);
        console.log('Deleted \n');
      });
    }
  });
}


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


// Streams - follow a particular user
// const stream = bot.stream('statuses/filter', {follow: '@javascript'});
function startStream() {
  let likeCount = 1;
  const MAX_LIKES = 20;
  console.log('Starting stream...');
  // Streams - track a particular word or search term
  const stream = bot.stream('statuses/filter', {track: ' squarespace, #squarespace, #reactjs, #webdev, #100daysofcode, #learntocode, #westbrom, #thequietus', filter: 'safe'});

  stream.on('tweet', (tweet) => {
    if (tweet.lang === "en") {
      console.log(`${tweet.text}`);
      // Like the tweet
      bot.post('favorites/create', {id: tweet.id_str}, (err, data, response) => {
        if (err) {
          console.log(`error liking tweet: move on to next tweet in stream.\n\n`);
        } else {
          console.log(`tweet ${likeCount} liked\n\n`);
          likeCount++;
        }
      });

      // Stop when we hit the Max Tweets
      if (likeCount >= MAX_LIKES) {
        console.log('Stopping stream...')
        stream.stop();
      }
    } else {
      console.log(`Skip non English tweets - lang: ${tweet.lang} \n\n`);
    }
  });

}

unlikeTweets('patchygreen');
// sleep.sleep(5);
// startStream();



