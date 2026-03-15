// گرفتن room از آدرس
const room = window.location.pathname.split("/").pop();

// Base URL داینامیک
const baseURL = window.location.origin;

// WebSocket Centrifugo
const centrifuge = new Centrifuge(
  `${baseURL.replace(/^http/, "ws")}/connection/websocket`,
);
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

  fetch(`/send?room=${room}&user=guest&text=${text}`, {
    method: "POST",
  });
}
