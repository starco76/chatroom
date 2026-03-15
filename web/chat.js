const urlParams = new URLSearchParams(window.location.search);
const room = urlParams.get("room");

const centrifuge = new Centrifuge("ws://localhost:8000/connection/websocket");

const sub = centrifuge.newSubscription(room);

sub.on("publication", function (ctx) {
  let msg = ctx.data;

  let div = document.createElement("div");
  div.innerText = msg.user + ": " + msg.text;

  document.getElementById("chat").appendChild(div);
});

sub.subscribe();
centrifuge.connect();

function send() {
  let text = document.getElementById("msg").value;

  fetch(`http://localhost:5000/send?room=${room}&user=guest&text=${text}`, {
    method: "POST",
  });
}
