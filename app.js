const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");
const inpWord = document.getElementById("inp-word");

async function getWordData() {
    let word = inpWord.value.trim(); // Trim to avoid unnecessary spaces
    if (!word) return; // Prevent empty search

    try {
        let response = await fetch(`${url}${word}`);
        if (!response.ok) {
            throw new Error("Word not found");
        }

        let data = await response.json();
        console.log(data);

        result.innerHTML = `
            <div class="word">
                <h3>${word}</h3>
                <button onclick="playSound()">
                    <i class="fas fa-volume-up" style="cursor:pointer;"></i>
                </button>
            </div>
            <div class="details">
                <p>${data[0].meanings[0].partOfSpeech}</p>
                <p>/${data[0].phonetic || "No phonetics available"}/</p>
            </div>
            <p class="word-meaning">
                ${data[0].meanings[0].definitions[0].definition}
            </p>
            <p class="word-example">
                ${data[0].meanings[0].definitions[0].example || "No example available"}
            </p>`;

        // Ensure there's an audio file before setting the source
        let audioUrl = data[0].phonetics.find(p => p.audio)?.audio || "";
        if (audioUrl) {
            sound.setAttribute("src", `${audioUrl}`);
        } else {
            sound.removeAttribute("src"); // Remove audio source if none available
        }
    } catch (error) {
        console.error("Error fetching word:", error);
        result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
    }
}

// **Event Listeners**
btn.addEventListener("click", getWordData);

// **Trigger search on pressing Enter**
inpWord.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        getWordData();
    }
});

// **Function to play sound**
function playSound() {
    if (sound.src) {
        sound.play();
    }
}
