Issues = new Mongo.Collection("issues");

if (Meteor.isClient) {

  Template.body.helpers({

          issuesInDatabase: function () {
            return Issues.find({});
          }

  });

  Template.body.events ({
      "submit .issue-form": function (event) {
          // Prevent default browser form submit
          event.preventDefault();

          // Get values from form element
          var titleText = event.target.title.value;
          var bodyText = event.target.body.value;



          Meteor.call('postIssue', titleText, bodyText, function(error, results) {
            console.log(error);
            console.log(results.statusCode);
          });

          Meteor.call('storeIssuesInDatabase', titleText, bodyText);

          event.target.title.value = "";
          event.target.body.value = "";
      }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("Server started")
  });
  Meteor.methods({
        postIssue: function (issueTitle, issueBody) {
            console.log("postIssues called")
                return Meteor.http.call("POST", "https://api.github.com/repos/mlin2/meteor-issue-creator/issues",
                {headers: {"User-Agent": "Meteor/1.0"}, data: {"title": issueTitle, "body": issueBody},
                auth: "mlin2:qm?|4FIYr}HUx2Dx9^[wt@/BG"});
        },
        storeIssuesInDatabase: function (issueTitle, issueBody) {
            Issues.insert({
              title: issueTitle,
              body: issueBody
            });
        },
        listIssuesInDatabase: function () {
            var issuesInDatabase = Issues.find({}).fetch();
            console.log(issuesInDatabase);
            return issuesInDatabase;
        }
    })
}
