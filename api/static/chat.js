const room = window.location.pathname.split("/").pop();

// 1️⃣ ابتدا JWT از API بگیر
async function getToken() {
  const res = await fetch(`/token?user=guest&room=${room}`);
  const data = await res.json();
  return data.token;
}

// 2️⃣ سپس Centrifuge را با JWT بساز
getToken().then((token) => {
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

  // ارسال پیام
  window.sendMessage = function (text) {
    fetch(`/send?room=${room}&user=guest&text=${text}`, {
      method: "POST",
    });
  };
});
