var redis = require("redis");
var subscriber = redis.createClient();

subscriber.on("message", function (channel, message) {
  console.log("Message: " + message + " on channel: " + channel + " is arrive!");
});
console.log("try subscribe");

subscriber.subscribe("notification");

console.log("subscribe done");
