let centrifuge, sub;
function startChat() {
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
  let centrifuge = null;

  function log(msg) {
    console.log(msg);
  }

  document.getElementById("connectBtn").addEventListener("click", async () => {
    // از سرور Django توکن بگیر
    const channels = ["public:market"];
    const id = "1234567800";
    const urls = `https://market.robinsood.com/generate-token/`;
    const response = await fetch(urls, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token 4656b9048ae1f42f2f96907d4b5ceb593ac9a647",
      },
      body: JSON.stringify({
        id: id,
        channels: channels,
      }),
    });
    const responseText = await response.text();
    log(responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      log("Error parsing JSON: " + error);
      return;
    }
    const token = data.token;
    log(token);

    centrifuge = new Centrifuge(
      `ws://${window.location.hostname}:8008/connection/websocket`,
      { token: window.token },
    );
    const url = await centrifuge.connect();

    centrifuge.on("connect", (ctx) => {
      log("✅ Connected: " + JSON.stringify(ctx));
    });

    centrifuge.on("disconnect", (ctx) => {
      log("❌ Disconnected: " + JSON.stringify(ctx));
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
      log("📨 Message: " + JSON.stringify(ctx.data));
      // const msg = ctx.data;
      // const div = document.createElement("div");
      // div.className = "msg";
      // div.innerHTML = `<b>${msg.user}</b>: ${msg.text}`;
      // chatDiv.appendChild(div);
      // chatDiv.scrollTop = chatDiv.scrollHeight;
    });
  });
}

function send() {
  const text = document.getElementById("msg").value;
  if (!text) return;

  fetch(
    `/send?room=${window.location.pathname.split("/").pop()}&user=${window.username}&text=${encodeURIComponent(text)}`,
    {
      method: "POST",
    },
  );

  document.getElementById("msg").value = "";
}
