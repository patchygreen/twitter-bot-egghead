const functions = require('firebase-functions');
const Twit = require('twit');
const config = require('./config.js');
const bot = new Twit(config);

let likeCount = 1;
const MAX_LIKES = 20;

// https://firebase.google.com/docs/functions/write-firebase-functions
exports.likeStuff = functions.https.onRequest((request, response) => {
  console.log('Starting stream...');
  // Streams - track a particular word or search term
  const stream = bot.stream('statuses/filter',
      {
        track: ' squarespace, #squarespace, #reactjs, #webdev, #100daysofcode, #learntocode, #westbrom, #thequietus',
        filter: 'safe'
      });

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
        response.send(`Liked ${likeCount} tweets. Sleepy time...`);
        return;
      }
    } else {
      console.log(`Skip non English tweets - lang: ${tweet.lang} \n\n`);
    }
  });
});
