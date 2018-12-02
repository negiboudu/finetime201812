// Initialize Firebase
var config = {
  apiKey: "xxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx"
};
firebase.initializeApp(config);

// setting event handler
document.getElementById("startbutton").onclick = function(){
  // firebaseへの書き込み
  var nickname = document.getElementById("nickname").value;
  var userref = firebase.database().ref('users').child(nickname);
  userref.set({score: 0});
  for (i=1; i<=15; i++) {
    userref.child('q' + i).set({ans: ''});
  }
  // 画面遷移
  document.getElementById("loginform").className = "nodisp";
  document.getElementById("buttons").className = "";
};

var buttons = document.getElementsByClassName("answerbutton");
for (var elm of buttons){
  elm.onclick = function(){
    var buttonval = this.value;
    // 現在の問題Noを取得
    firebase.database().ref('qnow').once('value', function(snapshot){
      var qnow = snapshot.val();
      // 解答内容を書き込み
      var nickname = document.getElementById("nickname").value;
      firebase.database().ref('users').child(nickname).child('q' + qnow).set({ans: buttonval});
    })
  };
}
