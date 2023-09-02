import moment from "moment/moment";
import io from "socket.io-client";
const socket = io("");

const clientsTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

// function for socket
const sendMessage = () => {
  if (!messageInput.value) return;
  console.log(messageInput.value);
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dataTime: new Date(),
  };
  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
};

const addMessageToUI = (isOwnMsg, data) => {
  clearFeedback();
  const ele = `<li class='${isOwnMsg ? "message-right" : "message-left"}'>
                    <p class='message'> ${data.message}</p>
                    <span> ${data.name} - ${moment(
                      data.dataTime
                    ).fromNow()}</span>
                 </li>
                    `;

  messageContainer.innerHTML += ele;
  scrollToBottom();
};
const scrollToBottom = () => {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
};
const clearFeedback = () => {
  document.querySelectorAll("li.message-feedback").forEach((e) => {
    e.parentNode.removeChild(e);
  });
};

socket.on("chat-message", (data) => {
  addMessageToUI(false, data);
});
socket.on("feedback", (data) => {
  clearFeedback();
  const ele = `<li class='message-feedback'>
                    <p class='feedback'> ${data.feedback}</p>
                 </li>
                    `;
  messageContainer.innerHTML += ele;
});

// DOM Event
if (messageForm) {
  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
  });
}

if (messageInput) {
  messageInput.addEventListener("focus", (e) => {
    socket.emit("feedback", {
      feedback: `${nameInput.value} is typing a message`,
    });
  });
  messageInput.addEventListener("keypress", (e) => {
    socket.emit("feedback", {
      feedback: `${nameInput.value} is typing a message`,
    });
  });
  messageInput.addEventListener("blur", (e) => {
    socket.emit("feedback", {
      feedback: ``,
    });
  });
}

socket.on("clients-total", (data) => {
  clientsTotal.innerText = `Total clients: ${data}`;
});
