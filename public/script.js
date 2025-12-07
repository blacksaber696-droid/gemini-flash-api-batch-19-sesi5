document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  userInput.addEventListener("keydown", () => {
    userInput.classList.add("typing");
  });

  userInput.addEventListener("keyup", () => {
    if (!userInput.value) {
      userInput.classList.remove("typing"); // hilang kalau input kosong
    }
  });

  const addMessage = (text, sender = "user") => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = text;

    messageElement.style.opacity = 0;
    messageElement.style.transform = "translateY(10px)";

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
      messageElement.style.opacity = 1;
      messageElement.style.transform = "translateY(0)";
    }, 10);

    return messageElement;
  };

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMessageText = userInput.value.trim();
    if (!userMessageText) return;

    // user message
    addMessage(userMessageText, "user");
    userInput.value = "";
    userInput.classList.remove("typing");

    const botMessageElement = addMessage("", "bot");
    botMessageElement.classList.add("typing");

    const spinner = document.createElement("span");
    spinner.classList.add("spinner");
    const textSpan = document.createElement("span");
    textSpan.textContent = "*Sigh*..let me think....";

    botMessageElement.appendChild(spinner);
    botMessageElement.appendChild(textSpan);

    chatBox.scrollTop = chatBox.scrollHeight;

    // Fetch bot response
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: [{ role: "user", text: userMessageText }],
        }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      //spinner
      botMessageElement.classList.remove("typing");
      botMessageElement.textContent = data?.response
        ? `Sasy Bot: ${data.response}`
        : "Sasy Bot: Sorry, I got literally nothing. Tragic.";

      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
      console.error(error);
      botMessageElement.classList.remove("typing");
      botMessageElement.textContent = "Sasy Bot: Ugh, server error. Try again.";
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });
});
