const urlParams = new URLSearchParams(window.location.search);
const room = window.location.pathname.split("/").pop();
const username = urlParams.get("user");
const token = urlParams.get("token"); // اگر token را query فرستادیم

const centrifuge = new Centrifuge(
  `ws://${window.location.host}:8008/connection/websocket`,
  {
    token: token,
  },
);

const sub = centrifuge.newSubscription(room);

sub.on("publication", function (ctx) {
  const msg = ctx.data;
  const div = document.createElement("div");
  div.innerText = msg.user + ": " + msg.text;
  document.getElementById("chat").appendChild(div);
});

sub.subscribe();
centrifuge.connect();

function send() {
  const text = document.getElementById("msg").value;
  fetch(
    `/send?room=${room}&user=${encodeURIComponent(username)}&text=${encodeURIComponent(text)}`,
    {
      method: "POST",
    },
  );
  document.getElementById("msg").value = "";
}
