const functions = require('firebase-functions');
const admin = require('firebase-admin');
const secrets = require('./secret_constants')
const request = require('request');

admin.initializeApp(functions.config().firebase);

exports.sendInvitationRequest = functions.database.ref('/invitationRequests/{inviteId}')
.onWrite(event => {
  
  const invitation = event.data.val();
  
  const options = {
    uri: 'https://gdg-nl.slack.com/api/users.admin.invite',
    method: "POST",
    headers: {
        "Content-Type" : "application/json; charset=utf-8",
        "Authorization" : "Bearer " + secrets.SLACK_API_TOKEN
    },
    json: {
      "email" : invitation.email, 
      "first_name" : invitation.firstName, 
      "last_name" : invitation.lastName, 
      "token" : secrets.SLACK_API_TOKEN
    }
  };

  console.log('Sending Slack invitation');
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log('Succesfully sent invitation', body);
    } else {
        console.log('Invitation failed', error);
    }
  });  
  return null;
});