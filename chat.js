
        // JavaScript functionality
        const showPopup = document.querySelector('#icon-btn');
        const popupContainer = document.querySelector('.popup-container');
        const chatOption = document.querySelector('.chat-btn');
        const closeBtn = document.querySelector('.close-btn');
        const chatbotClose = document.querySelector('#close-btn2');
        const removechat = document.querySelector('#removechat');
        const voiceChat = document.querySelector('.voice-btn');
        const popupBox = document.querySelector('.popup-box');
        const voicePopup = document.querySelector('.voice-popup');
        const audioPlayer = document.getElementById('audioPlayer');
        const statusText = document.getElementById('status');
        const loader = document.getElementById('loader');
        const stopAudioBtn = document.getElementById('stopAudioBtn');
        const pauseAudioBtn = document.getElementById('pauseAudioBtn');

        const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");
    const chatbox = document.querySelector(".chatbox");
    
    const apiEndpoint = "https://nhbli32qjd.execute-api.us-east-1.amazonaws.com/llama-test/teating"; 
    
    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing"
            ? `<p></p>`
            : `<span><img src="robot.svg" alt="oops.." id="chaticon"></span><p></p>`;
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

        const speechConfig = {
            subscriptionKey: '0643e6b741d24a9597e6fee4c45ff46c',
            region: 'eastus',
            openAiEndpoint: 'https://az-cloudful-openai.openai.azure.com/',
            openAiApiKey: 'f76ef8aa6f3e4201965df9f1b3c3badd',
            openAiApiVersion: '2024-04-01-preview',
            openAiDeployment: 'az-openai-test-deployment'
        };

        // Function to show loader animation
        const startLoader = () => {
            loader.classList.remove('stopped'); // Start animation
        };

        // Function to stop loader animation
        const stopLoader = () => {
            loader.classList.add('stopped'); // Stop animation but keep loader visible
        };

        // Show and hide popups
        chatOption.onclick = () => popupContainer.classList.remove('active');
        showPopup.onclick = () => popupContainer.classList.add('active');
        closeBtn.onclick = () => popupContainer.classList.remove('active');
        chatOption.addEventListener("click", () => document.body.classList.add("show-chatbot"));
        removechat.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

        // Show voice popup and start recording
        const showVoicePopup = () => {
            popupContainer.classList.add('active');
            popupBox.style.display = 'none';
            voicePopup.classList.add('open-voice');
            startRecognition();
        };

        // Hide voice popup and stop audio playback
        const hideVoicePopup = () => {
            if (!audioPlayer.paused) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
            popupBox.style.display = 'block';
            voicePopup.classList.remove('open-voice');
        };

        // Add event listener to voice button
        voiceChat.addEventListener('click', showVoicePopup);

        // Add event listener to close the voice popup
        document.querySelector('.closevoice-btn').addEventListener('click', hideVoicePopup);

        // Add event listeners for stop and pause buttons
        // Add event listener for stopAudioBtn to have the same functionality as closevoice-btn
        stopAudioBtn.addEventListener('click', hideVoicePopup);


        pauseAudioBtn.addEventListener('click', () => {
            if (!audioPlayer.paused) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
                pauseAudioBtn.querySelector('img').src = 'a.svg'; // Change to pause icon
            }else {
                audioPlayer.pause();
                pauseAudioBtn.querySelector('img').src = 'c.svg'; // Change to play icon
            }
            
            startRecognition(); // Start recording again
        });

        // Start speech recognition and handle recording
        function startRecognition() {
            if (typeof window.SpeechSDK === 'undefined') {
                console.error('SpeechSDK is not loaded');
                return;
            }

            const SpeechSDK = window.SpeechSDK;
            const speechConfigInstance = SpeechSDK.SpeechConfig.fromSubscription(speechConfig.subscriptionKey, speechConfig.region);
            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

            const recognizer = new SpeechSDK.SpeechRecognizer(speechConfigInstance, audioConfig);
            statusText.textContent = 'Listening...';

            // Show loader while recording
            startLoader();

            // Set a timer to stop recognition after 5 seconds
            const stopRecognitionTimeout = setTimeout(() => {
                recognizer.stopContinuousRecognitionAsync(() => {
                    statusText.textContent = 'Analyzing...';
                    startLoader(); // Show loader during analyzing
                    stopLoader(); // Hide loader after analyzing
                }, (err) => {
                    console.error('Error stopping recognition:', err);
                    statusText.textContent = 'Error.';
                    stopLoader();
                });
            }, 5000); // 5000 milliseconds = 5 seconds

            recognizer.recognized = (s, e) => {
                if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                    const recognizedText = e.result.text;
                    statusText.textContent = `Recognized: ${recognizedText}`;
                    generateTextAndSpeak(recognizedText);
                    clearTimeout(stopRecognitionTimeout); // Clear the timer if speech is recognized before 5 seconds
                    recognizer.stopContinuousRecognitionAsync(() => {
                        statusText.textContent = 'Analyzing...';
                        startLoader(); // Show loader during analyzing
                        stopLoader(); // Hide loader after analyzing
                    });
                }
            };

            recognizer.startContinuousRecognitionAsync();
        }

        // Generate response and play it as audio
        async function generateTextAndSpeak(text) {
            try {
                const response = await fetch(`${speechConfig.openAiEndpoint}/openai/deployments/${speechConfig.openAiDeployment}/completions?api-version=${speechConfig.openAiApiVersion}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': speechConfig.openAiApiKey
                    },
                    body: JSON.stringify({
                        prompt: text,
                        max_tokens: 128,
                        model: speechConfig.openAiDeployment
                    })
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const result = await response.json();
                const responseText = result.choices[0].text.trim();

                const ttsResponse = await fetch(`https://${speechConfig.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/ssml+xml',
                        'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
                        'Ocp-Apim-Subscription-Key': speechConfig.subscriptionKey
                    },
                    body: `
                    <speak version="1.0" xml:lang="en-US">
                        <voice xml:lang="en-US" xml:gender="Female" name="en-US-AvaMultilingualNeural">
                            ${responseText}
                        </voice>
                    </speak>`
                });

                if (ttsResponse.ok) {
                    const audioData = await ttsResponse.arrayBuffer();
                    const blob = new Blob([audioData], { type: 'audio/wav' });
                    const url = URL.createObjectURL(blob);
                    audioPlayer.src = url;
                    audioPlayer.play();

                    // Update status and show loader while audio is playing
                    statusText.textContent = 'Done';
                    startLoader(); // Show loader

                    // Resume loader animation if the audio is played or paused
                    audioPlayer.onplay = () => {
                        loader.classList.remove('stopped'); // Resume animation
                    };

                    // Start recording again after the audio finishes playing
                    audioPlayer.onended = () => {
                        stopLoader(); // Hide loader
                        startRecognition();
                    };

                    // Stop the loader animation if the audio is paused
                    audioPlayer.onpause = stopLoader;
                } else {
                    console.error("Error in TTS response:", ttsResponse.statusText);
                    statusText.textContent = "Error generating speech.";
                    stopLoader();
                }
            } catch (error) {
                console.error('Error in generateTextAndSpeak:', error);
                statusText.textContent = "Error generating speech.";
                stopLoader();
            }
        }

        
const micText = document.getElementById('micText');

// Update micText when starting and stopping recognition
function startRecognition() {
    if (typeof window.SpeechSDK === 'undefined') {
        console.error('SpeechSDK is not loaded');
        return;
    }

    const SpeechSDK = window.SpeechSDK;
    const speechConfigInstance = SpeechSDK.SpeechConfig.fromSubscription(speechConfig.subscriptionKey, speechConfig.region);
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfigInstance, audioConfig);
    statusText.textContent = 'Listening...';

    // Show loader and update micText while recording
    startLoader();
    micText.textContent = '⚫⚫⚫';

    // Set a timer to stop recognition after 5 seconds
    const stopRecognitionTimeout = setTimeout(() => {
        recognizer.stopContinuousRecognitionAsync(() => {
            statusText.textContent = 'Analyzing...';
            startLoader(); // Show loader during analyzing
            stopLoader(); // Hide loader after analyzing
            micText.textContent = 'Tap to interrupt';
        }, (err) => {
            console.error('Error stopping recognition:', err);
            statusText.textContent = 'Error.';
            stopLoader();
        });
    }, 5000); // 5000 milliseconds = 5 seconds

    recognizer.recognized = (s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
            const recognizedText = e.result.text;
            statusText.textContent = `Recognized: ${recognizedText}`;
            generateTextAndSpeak(recognizedText);
            clearTimeout(stopRecognitionTimeout); // Clear the timer if speech is recognized before 5 seconds
            recognizer.stopContinuousRecognitionAsync(() => {
                statusText.textContent = 'Analyzing...';
                startLoader(); // Show loader during analyzing
                stopLoader(); // Hide loader after analyzing
                micText.textContent = 'Tap to interrupt';
            });
        }
    };

    recognizer.startContinuousRecognitionAsync();
}

// Also update micText when audio is paused or played
audioPlayer.onplay = () => {
    loader.classList.remove('stopped'); // Resume animation
    micText.textContent = 'Tap to interrupt';
};

audioPlayer.onended = () => {
    stopLoader(); // Hide loader
    micText.textContent = 'Tap to interrupt';
    startRecognition();
};

audioPlayer.onpause = stopLoader;

const micBtn = document.getElementById('micBtn');
micBtn.addEventListener('click', () => {
    if (!audioPlayer.paused) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }

    startRecognition(); // Start recording again
});

