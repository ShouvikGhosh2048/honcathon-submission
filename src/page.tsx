import { css, Style } from "hono/css";
import { html } from "hono/html";

const globalClass = css`
    :-hono-global {
        html {
            font-family: "Inter", Arial, Helvetica, sans-serif;
            font-size: 16px;
        }
    }
`;

export default function Home() {
    return (
        <html class={globalClass}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
                <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"/>
                <Style/>
                {html`
                    <script>
                        let baseTopicInput = null;
                        let imageContainer = null;
                        let guessInput = null;
                        let guessesText = null;
                        let statusText = null;
                        let previous = [];

                        let topic = null;
                        let guesses = 0;

                        function generateNewTopic() {
                            if (!baseTopicInput.value) {
                                topic = null;
                                return;                            
                            }

                            guesses = 0;
                            guessesText.innerText = 'Guesses: ' + guesses;
                            statusText.innerText = '';
                            guessInput.value = '';
                            imageContainer.innerText = "Loading...";
                            prefetchImage = null;

                            fetch('/api/topic?baseTopic=' + baseTopicInput.value + '&skip=' + previous.join(","))
                                .then(res => res.text())
                                .then(generatedTopic => {
                                    topic = generatedTopic.toLowerCase();
                                    previous.push(topic);
                                    generateNewImage();
                                })
                                .catch(err => console.log(err));
                        }

                        function generateNewImage() {
                            if (topic) {
                                imageContainer.innerText = "Loading...";
                                fetch('/api/image?topic=' + topic)
                                    .then(img => img.text())
                                    .then(img => {
                                        // https://stackoverflow.com/a/8499716
                                        const imgSrc = 'data:image/png;base64, ' + img;
                                        imageContainer.innerHTML = '';
                                        const imgElement = document.createElement('img');
                                        imageContainer.appendChild(imgElement);
                                        imgElement.style.width = '450px';
                                        imgElement.style.height = '450px';
                                        imgElement.src = imgSrc;
                                    })
                                    .catch(err => console.log(err));
                            }
                        }

                        function guessTopic() {
                            if (!topic || !guessInput.value) {
                                return;
                            }
                            
                            guesses += 1;
                            if (topic === guessInput.value.toLowerCase()) {
                                statusText.innerText = 'Correct answer!';
                            } else {
                                statusText.innerText = 'Incorrect';
                            }
                            guessesText.innerText = 'Guesses: ' + guesses;
                        }

                        function revealAnswer() {
                            if (topic) {
                                guessInput.value = topic;
                            }
                        }

                        document.addEventListener('DOMContentLoaded', () => {
                            const newTopicButton = document.querySelector('#generateNewTopic');
                            newTopicButton.addEventListener('click', generateNewTopic);

                            const newImageButton = document.querySelector('#generateNewImage');
                            newImageButton.addEventListener('click', generateNewImage);

                            const guessButton = document.querySelector('#guess');
                            guessButton.addEventListener('click', guessTopic);

                            const revealAnswerButton = document.querySelector('#revealAnswer');
                            revealAnswerButton.addEventListener('click', revealAnswer);

                            baseTopicInput = document.querySelector('#baseTopic');
                            imageContainer = document.querySelector('#imageContainer');
                            guessInput = document.querySelector('#guessInput');
                            guessesText = document.querySelector('#guessesText');
                            statusText = document.querySelector('#statusText');
                        });
                    </script>
                `}
            </head>
            <body style={{ display: 'flex', gap: "10px", justifyContent: "space-around"}}>
                <div style={{ backgroundColor: '#581c8733', width: "500px", borderTop: "5px solid #581c87", padding: '5px 10px' }}>
                    <h1 style={{ textAlign: 'center', margin: '0' }}>Pictionary</h1>
                    <p>Welcome to the HONCATHON pictionary.</p>
                    <h2>How to use</h2>
                    <p>- First enter a category in the top input (for example, you can enter "Pokemon"). Then click "Generate new topic", and a topic is generated based on the category.</p>
                    <p>- Then an image is generated. Your goal is to guess the topic from the image. You can generate more images from the same topic by clicking the new image button. You can reveal the answer by clicking the reveal answer button.</p>
                    <p>- The topic and image generation is slow, and will take some time to load.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: "10px" }}>
                    <div style={{ display: "flex", gap: "10px", fontSize: "20px", justifyContent: "space-between", width: "100%" }}>
                        <input placeholder="Category" style={{ fontSize: "16px", padding: '5px', flexGrow: 1 }} id="baseTopic"/>
                        <button style={{
                            backgroundColor: "#581c87",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            fontWeight: "semibold",
                            fontSize: "16px",
                            padding: "10px 10px",
                            cursor: "pointer"
                        }} id="generateNewTopic">Generate new topic</button>
                    </div>
                    <div style={{ width: "450px", height: "450px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid black" }} id="imageContainer">
                        Image
                    </div>
                    <div style={{ display: "flex", gap: "10px", fontSize: "16px", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                        <span id="guessesText">Guesses: 0</span>
                        <span id="statusText"></span>
                        <button style={{
                            backgroundColor: "#581c87",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            fontWeight: "semibold",
                            fontSize: "16px",
                            padding: "10px 10px",
                            cursor: "pointer"
                        }} id="generateNewImage">New image</button>
                    </div>
                    <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "space-between" }}>
                        <input placeholder="Guess" style={{ fontSize: "16px", padding: '5px', flexGrow: 1 }} id="guessInput"/>
                        <button style={{
                            backgroundColor: "#581c87",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            fontWeight: "semibold",
                            fontSize: "16px",
                            padding: "10px 10px",
                            cursor: "pointer"
                        }} id="guess">Guess topic</button>
                        <button style={{
                            backgroundColor: "#581c87",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            fontWeight: "semibold",
                            fontSize: "16px",
                            padding: "10px 10px",
                            cursor: "pointer"
                        }} id="revealAnswer">Reveal answer</button>
                    </div>
                </div>
            </body>
        </html>
    );
}