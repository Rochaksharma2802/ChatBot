const showPopup = document.querySelector('#icon-btn');
    const popupContainer = document.querySelector('.popup-container');
    const chatOption = document.querySelector('.chat-btn');
    const closeBtn = document.querySelector('.close-btn');
    const chatbotClose = document.querySelector('#close-btn2');
    const removechat = document.querySelector('#removechat');
    const voiceChat = document.querySelector('.voice-btn');

    // voiceChat.onclick = ()=>{
    //     popupContainer.classList.remove('active');
    //     popupContainer.classList.add('conatiner2');
    // }

    document.addEventListener('DOMContentLoaded', () => {
        const popupContainer = document.querySelector('.popup-container');
        const voiceBtn = document.querySelector('.voice-btn');
        const container2 = document.querySelector('.container2');
    
        voiceBtn.addEventListener('click', () => {
            popupContainer.classList.remove('active');
            // container2.classList.add('active');
        });});

    chatbotClose.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    chatOption.addEventListener("click", () => document.body.classList.add("show-chatbot"));
    removechat.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    
    chatOption.onclick = () => {
        popupContainer.classList.remove('active');
    }
    
    showPopup.onclick = () => {
        popupContainer.classList.add('active');
    }
    
    closeBtn.onclick = () => {
        popupContainer.classList.remove('active');
    }
    
    // MY CODE
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");
    const chatbox = document.querySelector(".chatbox");
    
    const apiEndpoint = "https://nhbli32qjd.execute-api.us-east-1.amazonaws.com/llama-test/teating"; 
    
    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing"
            ? `<p></p>`
            : `<span><img src="https://d3rsl9g9lql4s2.cloudfront.net/proptechlogo.png" alt="oops.." id="chaticon"></span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    }
    
    const appendMessage = (message, className) => {
        const chatLi = createChatLi(message, className);
        chatbox.appendChild(chatLi);
        chatbox.scrollTop = chatbox.scrollHeight;
    }
    
    const sendMessage = async () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;
    
        appendMessage(userMessage, 'outgoing');
        chatInput.value = '';
    
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_prompt: userMessage })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            if (data.body) {
                appendMessage(data.body, 'incoming');
            } else {
                appendMessage('Unexpected response structure.', 'incoming');
            }
        } catch (error) {
            console.error('Error:', error);
            appendMessage('Sorry, there was an error.', 'incoming');
        }
    }
    
    sendChatBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });







// -------------------------------JS FOR VOICE--------------------------------


const popupBox = document.querySelector('.popup-box');
const voicePopup = document.querySelector('.voice-popup');
const audioPlayer = document.getElementById('audioPlayer'); // Access the audio player

// Function to show voice popup and hide popup box
const showVoicePopup = () => {
    popupContainer.classList.add('active'); // Optionally add an 'active' class to the container if needed
    popupBox.style.display = 'none'; // Hide the popup box
    voicePopup.classList.add('open-voice'); // Show the voice popup
}

// Function to hide voice popup and show popup box
const hideVoicePopup = () => {
    // Stop the audio playback if it's playing
    if (!audioPlayer.paused) {
        audioPlayer.pause(); // Pause the audio
        audioPlayer.currentTime = 0; // Reset audio to the beginning
    }

    popupBox.style.display = 'block'; // Show the popup box
    voicePopup.classList.remove('open-voice'); // Hide the voice popup
}

// Add event listener to voice button
voiceChat.addEventListener('click', showVoicePopup);

// Optional: Add event listener to close the voice popup and show popup box
document.querySelector('.closevoice-btn').addEventListener('click', hideVoicePopup);

// ----------------------JS FOR VOICE INPUT/OUTPUT----------------------

const startButton = document.getElementById('startButton');
const statusText = document.getElementById('status');
     
// const speechConfig = {
//     subscriptionKey: '0643e6b741d24a9597e6fee4c45ff46c',
//     region: 'eastus',
//     openAiEndpoint: 'https://az-cloudful-openai.openai.azure.com/',
//     openAiApiKey: 'f76ef8aa6f3e4201965df9f1b3c3badd',
//     openAiApiVersion: '2024-04-01-preview',
//     openAiDeployment: 'az-openai-test-deployment'
// };
     
// startButton.addEventListener('click', () => {
//     startRecognition();
// });
     
// function startRecognition() {
//     // Ensure the Speech SDK is loaded
//     if (typeof window.SpeechSDK === 'undefined') {
//         console.error('SpeechSDK is not loaded');
//         return;
//     }
    
//     const SpeechSDK = window.SpeechSDK;
//     const speechConfigInstance = SpeechSDK.SpeechConfig.fromSubscription(speechConfig.subscriptionKey, speechConfig.region);
//     const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    
//     const recognizer = new SpeechSDK.SpeechRecognizer(speechConfigInstance, audioConfig);
    
//     recognizer.recognizeOnceAsync(result => {
//         if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
//             statusText.textContent = `Recognized: ${result.text}`;
//             generateTextAndSpeak(result.text);
//         } else {
//             statusText.textContent = "Speech not recognized.";
//             console.error('Speech recognition error:', result.errorDetails);
//         }
//         recognizer.close();
//     }, error => {
//         console.error('Recognition error:', error);
//         statusText.textContent = "Error during recognition.";
//         recognizer.close();
//     });
// }
     
// async function generateTextAndSpeak(text) {
//     try {
//         const response = await fetch(`${speechConfig.openAiEndpoint}/openai/deployments/${speechConfig.openAiDeployment}/completions?api-version=${speechConfig.openAiApiVersion}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'api-key': speechConfig.openAiApiKey
//             },
//             body: JSON.stringify({
//                 prompt: text,
//                 max_tokens: 128,
//                 model: speechConfig.openAiDeployment
//             })
//         });

//         if (!response.ok) throw new Error('Network response was not ok');

//         const result = await response.json();
//         const responseText = result.choices[0].text.trim();

//         const ttsResponse = await fetch(`https://${speechConfig.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/ssml+xml',
//                 'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
//                 'Ocp-Apim-Subscription-Key': speechConfig.subscriptionKey
//             },
//             body: `
//             <speak version="1.0" xml:lang="en-US">
//                 <voice xml:lang="en-US" xml:gender="Female" name="en-US-JessaNeural">
//                     ${responseText}
//                 </voice>
//             </speak>`
//         });

//         if (ttsResponse.ok) {
//             const audioData = await ttsResponse.arrayBuffer();
//             const blob = new Blob([audioData], { type: 'audio/wav' });
//             const url = URL.createObjectURL(blob);
//             audioPlayer.src = url;
//             audioPlayer.play();
//         } else {
//             console.error("Error in TTS response:", ttsResponse.statusText);
//             statusText.textContent = "Error generating speech.";
//         }
//     } catch (error) {
//         console.error('Error in generateTextAndSpeak:', error);
//         statusText.textContent = "Error generating speech.";
//     }
// }

    
     