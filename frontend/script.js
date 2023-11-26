let conversationElement = document.querySelector(".conversation-box");
let inputElement = document.querySelector(".input-container input");
let submitElement = document.querySelector(".submit-button");
let themeSwitch = document.querySelector(".theme-switch");
let audioElement = null;
let isDarkMode = false;

function displayText(message, className, responseType) {
    let messageElement = document.createElement("div");
    messageElement.classList.add(className);
    messageElement.textContent = message;

    conversationElement.appendChild(messageElement);
}
          
function handleMusic() {
    if (audioElement && !audioElement.paused) {
        audioElement.pause(); 
        audioElement = null;
    } else {
        const audioSrc = "assets/music/frets.mp3";
        if (!audioElement) {
            audioElement = new Audio(audioSrc); 
            audioElement.play(); 
        }
    }
}

function handleSelfie() {
    const imageSrc = "assets/imgs/joebiden.jpg"; 
    const messageElement = document.createElement("div");
    messageElement.classList.add("message-server");

    const imageElement = document.createElement("img");
    imageElement.src = imageSrc;
    imageElement.classList.add("selfie-image");

    messageElement.appendChild(imageElement);
    conversationElement.appendChild(messageElement);
}

function sendToServer(message) {
    const url = "http://localhost:8000"; 
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "query": message })
    };

    console.log("Sending request now...");
    fetch(url, options)
        .then(response => {
            console.log("Response status:", response.status);
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            const responseType = data.responseType;
            const innerContent = data.content;
            
            if (responseType == "story") {
                handleStoryNarration(innerContent);
            } else if (responseType == "music") {
                handleMusic();
            } else if (responseType == "selfie") {
                handleSelfie();
            }
            console.log(`Response Type ${responseType}`);
            console.log(`Returning Content ${innerContent}`);
            displayText(innerContent, "message-server");
        })
        .catch(error => {
            console.error("Fetch couldn't be completed, boss:", error);
        });
}

function toggleTheme() {
    isDarkMode=!isDarkMode;
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }
themeSwitch.addEventListener("click", toggleTheme);

submitElement.addEventListener("click", function () {
    let content = inputElement.value;
    if (content == "") {
        window.alert("Please enter something!");
    } else {
        displayText(content, "message-client");
        inputElement.value = "";
        sendToServer(content);
    }
})
