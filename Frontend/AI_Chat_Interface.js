const sendButton = document.getElementById('sendButton');
const userInput = document.getElementById('userInput');
const fileInput = document.getElementById('fileInput');
const chatBubbles = document.getElementById('chatBubbles');

const API_URL = 'http://localhost:3000/chat'; // ✅ Pastikan sesuai backend port

// Fungsi kirim chat/text & gambar
async function sendChat() {
  const message = userInput.value.trim();
  const file = fileInput.files[0]; // ✅ ambil file gambar

  if (!message && !file) {
    console.warn("⚠️ Pesan kosong & ga ada gambar!");
    return;
  }

  // Tampilkan pesan user di chat bubble
  if (message) {
    createChatBubble(message, true);
  } else if (file) {
    createChatBubble('📎 Image sent!', true);
  }

  // Reset input user & file
  userInput.value = '';
  fileInput.value = '';

  const loadingBubble = createChatBubble('Processing...', false, true); // loading feedback

  try {
    let base64Image = null;
    let mimeType = null;

    function toBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }      

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message || '',
        image: base64Image,
        mimeType: mimeType
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    chatBubbles.removeChild(loadingBubble);

    const aiReply = data.reply || 'No reply from AI.';
    createChatBubble(aiReply, false); // Tampilkan balasan AI di bubble

  } catch (error) {
    chatBubbles.removeChild(loadingBubble);
    console.error('❌ Error kirim ke backend:', error);
    createChatBubble('Error processing your request.', false);
  }
}


sendButton.addEventListener('click', sendChat);


userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendChat();
  }
});


function createChatBubble(message, isUser, isLoading = false) {
  const bubble = document.createElement('div');
  bubble.className = isUser ? 'chat-bubble user-bubble' : 'chat-bubble ai-bubble';


  const htmlMessage = parseMarkdown(message);

  bubble.innerHTML = htmlMessage;

  if (isLoading) {
    bubble.style.opacity = 0.6;
    bubble.style.fontStyle = 'italic';
  }

  chatBubbles.appendChild(bubble);
  chatBubbles.scrollTop = chatBubbles.scrollHeight;

  return bubble;
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result.split(',')[1]; 
      resolve(base64String);
    };

    reader.onerror = (error) => {
      console.error("❌ Error convert file ke base64:", error);
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

function parseMarkdown(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
