
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

// curl -X POST \
//  -H "X-Parse-Application-Id: AR6NF8FvJQFx0zurn9snBroZi2S68SCRBIRMudo7" \
//  -H "X-Parse-REST-API-Key: ajmBURZkjuoxSKavw1xZnKpGFMypVP5j3JNVFks8" \
//  -H "Content-Type: application/json" \
//  -d '{}' \
//  https://api.parse.com/1/functions/pushMe

Parse.Cloud.define("login", function(request, response) {
    Parse.User.logIn("aakash", "isAPussy", {
    succes: function(user) {
      response.success("Sucess log");
    },
    error: function(user, error) {
      response.success("fail log");
    }
  });
  response.success("login");
});

Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("initQuestion", function(request, response) {
  var ClassSession = Parse.Object.extend("ClassSession");
  var query = new Parse.Query(ClassSession);
  query.equalTo("name", "Math");
  query.find({
    success: function(results) {
      var cSession = results[0];
      var currentQuestion = cSession.get("currentQuestion");
      var questions = cSession.get("questions");
      var newQuestion = questions[currentQuestion];
      newQuestion["numCorrectAnswers"] = 0;
      newQuestion["numIncorrectAnswers"] = 0;
      cSession.set("questions", questions);
      var answers = newQuestion.answers;
      var currentAnswers = {}
      for(var i = 0; i < answers.length; i++) {
        currentAnswers[answers[i]] = 0;
      }
      var currentAnswersArray = [];
      currentAnswersArray.push(currentAnswers);
      cSession.set("currentQuestionAnswers", currentAnswersArray);
      cSession.save();
      response.success(currentAnswers);
    },
    error: function(error) {
      response.success(error);
    }
  });
});

Parse.Cloud.define("sendAnswer", function(request, response) {
  var ClassSession = Parse.Object.extend("ClassSession");
  var query = new Parse.Query(ClassSession);
  query.equalTo("name", "Math");
  query.find({
    success: function(results) {
      var cSession = results[0];
      var currentQuestion = cSession.get("currentQuestion");
      var questions = cSession.get("questions");
      var newQuestion = questions[currentQuestion];
      var currentAnswersArray = cSession.get("currentQuestionAnswers");
      var key = request.params.answerChoice;
      currentAnswersArray[0][key]++;
      cSession.set("currentQuestionAnswers", currentAnswersArray);
      cSession.save();
      response.success(currentAnswersArray[0]);
    },
    error: function(error) {
      response.success(error);
    }
  });
});

Parse.Cloud.define("answersForCurrentQuestion", function(request, response) {
  var ClassSession = Parse.Object.extend("ClassSession");
  var query = new Parse.Query(ClassSession);
  query.equalTo("name", "Math");
  query.find({
    success: function(results) {
      var cSession = results[0];
      var currentQuestion = cSession.get("currentQuestion");
      var questions = cSession.get("questions");
      var newQuestion = questions[currentQuestion];
      var currentAnswersArray = cSession.get("currentQuestionAnswers");
      response.success(currentAnswersArray[0]);
    },
    error: function(error) {
      response.success(error);
    }
  });
});

//Math[{"165":3,"170":5,"180":2,"190":1}]


Parse.Cloud.define("questions", function(request, response) {
  var ClassSession = Parse.Object.extend("ClassSession");
  var query = new Parse.Query(ClassSession);
  query.equalTo("name", "Math");
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function(error) {
      response.success(error);
    }
  });
});

Parse.Cloud.define("endSubmissions", function(request, response) {
  var ClassSession = Parse.Object.extend("ClassSession");
  var query = new Parse.Query(ClassSession);
  query.equalTo("name", "Math");
  query.find({
    success: function(results) {
      var cSession = results[0];
      cSession.set("answerDisplayed", true);
      cSession.save();
      response.success("Updated Display");
    },
    error: function(error) {
      response.success("error");
    }
  });
});

Parse.Cloud.define("getScoresQuestion", function(request, response) {
  var ClassSession = Parse.Object.extend("ClassSession");
  var query = new Parse.Query(ClassSession);
  query.equalTo("name", "Math");
  query.find({
    success: function(results) {
      var cSession = results[0];
      var questions = cSession.get("questions");
      var returnArray = [];
      for(var i = 0; i < questions.length; i++) {
        var questionsCorrect = questions[i]["numCorrectAnswers"]
        var questionsIncorrect = questions[i]["numIncorrectAnswers"]
        var scoreObject = {
          "id": i,
          "correct": questionsCorrect,
          "incorrect": questionsIncorrect
        }
        returnArray.push(scoreObject);
      }
      
      response.success(returnArray);
    },
    error: function(error) {
      response.success(error);
    }
  });
})

Parse.Cloud.define("topStudents", function(request, response) {
  var query = new Parse.Query(Parse.User);
  query.equalTo("role", "Student");
  query.find({
    success: function(results) {
      var scores = [];
      
      for(var i = 0; i < results.length; i++) {
        var tempScore = results[i].get("score");
        scores.push(tempScore);
      }
      
      for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < (results.length - i - 1); j++) {
          if(results[j].get("score") > results[j + 1].get("score")) {
            var tmp = results[j];
            results[j] = results[j + 1];
            results[j + 1] = tmp;
          }
        }
      }
      
      results.reverse();
      
      // scores.sort();
      // scores.reverse();
      // var returnArray = [];
      // console.log("asdfasdf");
      // for(var i = 0; i < scores.length; i++) {
      //   // var tempScore = results[i].get("score");
      //   for(var j = 0; j < results.length; j++) {
      //     var tempScore = results[j].get("score");
      //     console.log("TempScore => " + tempScore + " Score => " + scores[i]);
      //     if(tempScore === scores[i]) {
      //       returnArray.push(results[j]);
      //     }
      //   }
      // }
      
      response.success(results);
    },
    error: function(error) {
      response.success("error");
    }
  });
});

Parse.Cloud.define('incrementCorrectOrIncorrect', function(request, response) {
  var ClassSession = Parse.Object.extend("ClassSession");
  var query = new Parse.Query(ClassSession);
  query.equalTo("name", "Math");
  query.find({
    success: function(results) {
      var cSession = results[0];
      var index = cSession.get("currentQuestion");
      var questions = cSession.get("questions");
      var current = questions[index];
      if(request.params.answerChoice == true) {
        current["numCorrectAnswers"]++;
      } else {
        current["numIncorrectAnswers"]++;
      }
      questions[index] = current;
      cSession.set("questions", questions);
      cSession.save()
      response.success(cSession.get("questions")[index]);
    }, error : function(error) {
      response.success("error");
    }
  })
});

Parse.Cloud.define("changeCurrentQuestion", function(request, response) {
  var ClassSession = Parse.Object.extend("ClassSession");
  var query = new Parse.Query(ClassSession);
  query.equalTo("name", "Math");
  query.find({
    success: function(results) {
      var cSession = results[0];
      var current = cSession.get("currentQuestion");
      if(current >= 2) {
        current = 0
      } else {
        current++;
      }
      cSession.set("currentQuestion", current);
      cSession.set("answerDisplayed", false);
      cSession.save();
      response.success("Updated Question");
    },
    error: function(error) {
      response.success("error");
    }
  });
});


Parse.Cloud.define("populate", function(request, response){
  var Class = Parse.Object.extend("Class");
  var ClassSession_Beta = Parse.Object.extend("ClassSession_Beta");
  var classSession = new ClassSession_Beta();
  var query = new Parse.Query(Class);
  query.equalTo("name", "Math");
  query.find({
    success: function(results) {
      var tempClass = results[0];
      var classRelation = classSession.relation("class");
      classRelation.add(tempClass);
      classSession.save();
      var Question = Parse.Object.extend("Question");
      var questionQuery = new Parse.Query(Question);
      questionQuery.get("lL0MbYlKlM", {
        success: function(question) {
          var questionRelation = classSession.relation("questions");
          questionRelation.add(question);
          classSession.set("answerDisplayed", false);
          classSession.set("currentQuestion", 0);
          classSession.save();
          response.success("made session");
        }, 
        error: function(object, error) {
          console.log("error question");
          response.success("made error");
        }
      });
    },
    error: function(object, error) {
      console.log("Fail find class");
      response.success("made error");
    }
  });
  
})

Parse.Cloud.define("pushMe", function(request, response) {
  Parse.Cloud.useMasterKey();
  Parse.Push.send({
    channels: ["global"],
    data : {
      alert: "I want to cry."
    }
  }, {
    success: function() {
      console.log("Success push");
      response.success("Yas!");
    },
    error: function(error) {
      console.log(error);
      response.success(error);
    }
  });
});

Parse.Cloud.define("isTeacher", function(request, response) {
    if(!req.params.username) {
        response.error("Username not provided");
    }
    
    var queryRole = new Parse.Query(Parse.Role);
    queryRole.equalTo('name', 'Teacher');
    
    queryRole.first({
        success: function(r) {
            var role = r;
            var relation = new Parse.Relation(role, 'users');
            var teachers = relation.query();
            
            teachers.equalTo('username', req.params.username);
            teachers.first({
                success: function(u) {
                    var user = u;
                    
                    if(user) {
                        response.success('User is teacher');
                    } else {
                        response.error('User is not teacher');
                    }
                },
                error: function() {
                    response.error('Error on user Lookup');
                }
            })
        },
        error: function() {
            response.error('User admin check failed');
        }
    });
});