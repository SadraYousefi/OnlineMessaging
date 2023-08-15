const cookies = document.cookie;
const cookiesArray = cookies.split("; ");
const mainUrl = document.URL.split("?");
const splitedUrl = mainUrl[1].split("=");
const recipientId = splitedUrl[1];

function getCookieValue(cookieName) {
  for (const cookie of cookiesArray) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

const socket = io("", {
  extraHeaders: {
    authorization: getCookieValue("token"),
  },
  query: {
    recipientId: recipientId,
  },
});

const messageInput = document.getElementById("messageInput");
const submitBtn = document.getElementById("submitBtn");
const conversationBox = document.getElementById("conversationBox");
const deleteMsgBtn = document.getElementById("deleteMsgBtn");
const pinMsgBtn = document.getElementById("pinMsgBtn");


// function forwardMsg(id) {
//   socket.emit("forwardMessage" , {
//     "messageId": id ,
//     "contactId": recipientId ,
//     "toUserId": 
//   })

// }


function unpinMsg(id) {
  socket.emit("togglePin", {
    messageId: +id,
    contactId: +recipientId,
  });
  const pinnedParagraph = document.getElementById(`pinned${id}`);
  pinnedParagraph.innerText = "";
  const unpinBtn = document.getElementById(`unpinBtn${id}`);
  unpinBtn.innerText = "Pin";
}

function pinMsg(id) {
  socket.emit("togglePin", {
    messageId: +id,
    contactId: +recipientId,
  });

  const msg = document.getElementById(`item${id}`);
  const pinTag = document.createElement("p");
  pinTag.innerText = "<************ Pinned Message ********>";
  msg.appendChild(pinTag);
  const pinBtn = document.getElementById(`pinBtn${id}`);
  pinBtn.innerText = "Unpin";
}

function createElementAndAppendToHtml(message) {
  const paragraph = document.createElement("p");
  paragraph.innerText = `${recipientId}: ${message}`;
  const deletebtn = document.createElement("button")
  const submitBtn = document.createElement("button")
  const forwardBtn = document.createElement("button")
  conversationBox.appendChild(paragraph);
}

function deleteMsg(id) {
  socket.emit("deleteMessage", {
    messageId: +id,
    contactId: +recipientId,
  });
  const msg = document.getElementById(`item${id}`);
  msg.innerText = "This message has been deleted";
}
 
submitBtn.addEventListener("click", () => {
  if (!messageInput.value || [" ", "", 0].includes(messageInput.value))
    return alert("input can't be empty");
  socket.emit("message", {
    toUser: +recipientId,
    body: {
      type: "string",
      data: btoa(messageInput.value),
    },
    isPinned: false,
    isDeleted: false,
  });
  messageInput.value = "";
});


socket.on("connect", () => {
  console.log("connected to server");
});

socket.on("disconnect", () => {
  console.log("disconnected");
});

socket.on("message", (data) => {
  createElementAndAppendToHtml(data[0]);
});
