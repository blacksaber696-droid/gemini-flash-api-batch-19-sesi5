document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  userInput.addEventListener("keydown", (e) => {
    userInput.classList.add("typing");

    // Enter = kirim, Shift+Enter = baris baru
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.requestSubmit(); // kirim form
    }
  });

  userInput.addEventListener("keyup", () => {
    if (!userInput.value) userInput.classList.remove("typing");
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

  // Lottie
  const lottieEl = document.getElementById("floating-lottie");
  lottie.loadAnimation({
    container: lottieEl,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "Loading animation.json",
  });

  let x = Math.random() * (window.innerWidth - lottieEl.offsetWidth);
  let y = Math.random() * (window.innerHeight - lottieEl.offsetHeight);
  let dx = 2 + Math.random() * 3;
  let dy = 2 + Math.random() * 3;

  function animateLottie() {
    x += dx;
    y += dy;

    if (x <= 0 || x >= window.innerWidth - lottieEl.offsetWidth) dx *= -1;
    if (y <= 0 || y >= window.innerHeight - lottieEl.offsetHeight) dy *= -1;

    lottieEl.style.left = x + "px";
    lottieEl.style.top = y + "px";

    requestAnimationFrame(animateLottie);
  }

  animateLottie();
});
