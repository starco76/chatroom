let centrifuge, sub;
const startChat = async () => {
  // centrifuge = new Centrifuge(
  //   `ws://${window.location.hostname}:8008/connection/websocket`,
  //   { token: window.token },
  // );

  // sub = centrifuge.newSubscription(window.location.pathname.split("/").pop());

  // const typingDiv = document.getElementById("typing");
  // const chatDiv = document.getElementById("chat");

  // sub.on("publication", function (ctx) {
  //   const msg = ctx.data;
  //   const div = document.createElement("div");
  //   div.className = "msg";
  //   div.innerHTML = `<b>${msg.user}</b>: ${msg.text}`;
  //   chatDiv.appendChild(div);
  //   chatDiv.scrollTop = chatDiv.scrollHeight;
  // });

  // // کاربر در حال تایپ
  // const input = document.getElementById("msg");
  // input.addEventListener("input", function () {
  //   centrifuge.publish(window.location.pathname.split("/").pop(), {
  //     typing: window.username,
  //   });
  // });

  // sub.subscribe();
  // centrifuge.connect();

  // // دریافت وضعیت تایپ
  // sub.on("publication", function (ctx) {
  //   const msg = ctx.data;
  //   if (msg.typing && msg.typing !== window.username) {
  //     typingDiv.innerText = msg.typing + " is typing...";
  //     setTimeout(() => {
  //       typingDiv.innerText = "";
  //     }, 2000);
  //   }
  // });
  centrifuge = new Centrifuge(
    `ws://${window.location.hostname}:8008/connection/websocket`,
    { token: window.token },
  );
  await centrifuge.connect();

  centrifuge.on("connect", (ctx) => {
    console.log("✅ Connected: " + JSON.stringify(ctx));
  });

  centrifuge.on("disconnect", (ctx) => {
    console.log("❌ Disconnected: " + JSON.stringify(ctx));
  });

  centrifuge.on("subscribing", function (ctx) {
    console.log("subscribing");
  });

  centrifuge.on("subscribed", function (ctx) {
    console.log("subscribed");
  });

  centrifuge.on("unsubscribed", function (ctx) {
    console.log("unsubscribed");
  });
  centrifuge.on("publication", (ctx) => {
    console.log("📨 Message: " + JSON.stringify(ctx.data));
    // const msg = ctx.data;
    // const div = document.createElement("div");
    // div.className = "msg";
    // div.innerHTML = `<b>${msg.user}</b>: ${msg.text}`;
    // chatDiv.appendChild(div);
    // chatDiv.scrollTop = chatDiv.scrollHeight;
  });
};

function send() {
  const text = document.getElementById("msg").value;
  if (!text) return;

  centrifuge.send(
    `/send?room=${window.location.pathname.split("/").pop()}&user=${window.username}&text=${encodeURIComponent(text)}`,
    {
      method: "POST",
    },
  );

  document.getElementById("msg").value = "";
}
