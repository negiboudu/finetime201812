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

// 初回読み込み時のみ実行
firebase.database().ref('qnow').once('value', function(snapshot) {
  dispQno(snapshot.val());
})

// setting event handler
document.getElementById("nextbutton").onclick = function(){
    // 現在の問題Noを取得
    firebase.database().ref('qnow').once('value', function(snapshot){
      
      // 正解を取得
      var qnowval = snapshot.val();
      firebase.database().ref('answers').child('q' + qnowval).once('value', function(ansss) {
        var seikai = ansss.val();
        // 全員分を採点
        firebase.database().ref('users').once('value', function(users){
          var topranker = {name:'', score:0};
          users.forEach(function(user){
            // 正解していたら加点
            if (seikai == user.child('q' + qnowval).child('ans').val()){
              var newscore = user.child('score').val() + 1;
              firebase.database().ref('users').child(user.key).update({score: newscore});
              // トップランカーを更新
              if (topranker.score < newscore) {
                topranker.score = newscore;
                topranker.name = user.key;
                document.getElementById('topranker').innerText = "　現在「" + topranker.name + "」さんが " + topranker.score + " 点でTOP!"
               }
            }
          })
        })
      })
            
      // 問題Noをcountup
      var newno = snapshot.val() + 1;
      firebase.database().ref().update({qnow: newno});
      dispQno(newno);
    })
};

// // realtime database listener
firebase.database().ref('users').on('value', function(snapshot){
  var dt = document.getElementById("datatable");
  var t = "";
  // 見出し行
  t += "<table class='datatable'>";
  t += "<tr class='titlerow'>";
  t += "<td>おなまえ</td>";
  for (i=1; i<=15; i++) {
    t += "<td>第" + i + "問</td>";
  }
  t += "<td class='scoretd'>SCORE</td>";
  t += "</tr>";
  // データ行
  snapshot.forEach(function(user){
    t += "<tr class='datarow'>";
    t += "<td>" + user.key; + "</td>";
    for (i=1; i<=15; i++) {
      t += "<td>" + user.child('q' + i).child('ans').val() + "</td>";
    }
    t += "<td>" + user.child('score').val() + "</td>";
    t += "</tr>";
  });
  t += "</table>";
  dt.innerHTML = t;
})

// 現在の問題番号表示を更新
function dispQno(qno) {
  document.getElementById("qnowarea").innerText = "第" + qno + "問";
}
