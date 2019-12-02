var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '908471',
  key: '7bddecf086e8511e771e',
  secret: 'e3b80a3d4a907c03dcbe',
  cluster: 'mt1',
  useTLS: true
});

pusher.trigger('first-app-development', 'my-event', {
  "message": "testing"
});