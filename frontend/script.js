let conversationElement = document.querySelector(".conversation-box");
let inputElement = document.querySelector(".input-container input");
let submitElement = document.querySelector(".submit-button");
let themeSwitch = document.querySelector(".theme-switch");
let mainPage = document.querySelector(".talk-with-joe");
let narratePage = document.querySelector(".story-with-joe");
let mainContainer = document.querySelector(".narrate-body");
let audioElement = null;
let isDarkMode = false;
let imageCount = 3;
let musicCount = 2;

    function displayText(message, className, responseType) {
        let messageElement = document.createElement("div");
        messageElement.classList.add(className);
        messageElement.textContent = message;

        conversationElement.appendChild(messageElement);
        conversationElement.scrollTop = conversationElement.scrollHeight;
    }

    function handleStories(content) {
        let stories = JSON.parse(sessionStorage.getItem('stories')) || [];
        stories.push(content);
        sessionStorage.setItem('stories', JSON.stringify(stories));
        console.log('Story added to sessionStorage:', content);
    }
            
    function handleMusic() {
        if (audioElement && !audioElement.paused) {
            audioElement.pause(); 
            audioElement = null;
        } else {
            let audioSrc;
            if (musicCount > 0) {
                audioSrc = `assets/music/music${musicCount}.mp3`;
            } else {
                audioSrc = `assets/music/perm.mp3`;
            }
            musicCount--;
            if (!audioElement) {
                audioElement = new Audio(audioSrc); 
                audioElement.play(); 
            }
        }
    }

    function handleSelfie() {
        let imageSrc;
        if (imageCount > 0) {
            imageSrc = `assets/imgs/sleep${imageCount}.jpeg`
        } else {
            imageSrc = `jodebiden.jpeg`;
        }
        imageCount--;
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
                    handleStories(innerContent);
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

        function displayStories() {
            let stories = JSON.parse(sessionStorage.getItem("stories")) || [];
        
            stories.forEach((story, index) => {
                // Create a paragraph element to display the story text
                let storyElement = document.createElement("p");
                storyElement.classList.add("story-text");
        
                console.log(`Created Story Elemen ${storyElement}`);
                // Abbreviate long texts for display purposes
                if (story.length > 50) {
                    storyElement.textContent = story.substring(0, 50) + "...";
                } else {
                    storyElement.textContent = story;
                }
        
                // Add click event to narrate the story using Chrome narrator
                storyElement.addEventListener("click", () => {
                    let speech = new SpeechSynthesisUtterance(story);
                    speech.rate = 1 // Speed of speech (1 is normal)
                    speech.pitch = 1; // Pitch of the voice (1 is normal)
                    speech.volume = 1; // Volume (0 to 1)
                    
                    // Additional parameters for more natural speech
                    speech.lang = 'en-US'; // Specify the language (adjust as needed)
                    speech.voiceURI = 'Google US English'; // Select a specific voice URI
                    speech.voice = speechSynthesis.getVoices().find(voice => voice.name === "Google UK English Female"); // Specify a particular voice
                
                    if (speechSynthesis.speaking) {
                        speechSynthesis.pause();
                    } else {
                        speechSynthesis.speak(speech);
                    }
                });
        
                mainContainer.appendChild(storyElement);
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

    window.addEventListener('load', displayStories);
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
    mainPage.addEventListener("click", function() {
        console.log("Main Triggered!");
        window.location.href = "index.html";
    });
    narratePage.addEventListener("click", function() {
        console.log("Narrate Triggered!");
        if (window.location.pathname !== '/narrate.html') {
            window.location.href = "narrate.html";
        }
    });
