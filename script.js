let wardrobe = JSON.parse(
    localStorage.getItem("cherWardrobe")
) || [];

let selectedImage = "";

function enterCloset(){
    window.location.href = "closet.html"
}

// ========================================
// IMAGE PREVIEW
// ========================================

function previewImage() {
    const file = document.getElementById("clothingImage").files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {
        selectedImage = event.target.result;
        const preview = document.getElementById("imagePreview");

        preview.innerHTML = `
            <img src="${selectedImage}" alt="Clothing preview">
        `;

        document.getElementById("uploadText").textContent = "✓ PHOTO SELECTED";
    };

    reader.readAsDataURL(file);
}

// ========================================
// ADD CLOTHING
// ========================================

function addClothing() {
    const name = document.getElementById("clothingName").value.trim();
    const category = document.getElementById("clothingCategory").value;
    const color = document.getElementById("clothingColor").value;

    if (name === "" || category === "" || color === "") {
        alert("CHER.EXE says:\n\nPlease fill in all the information.");
        return;
    }

    const clothingItem = {
        id: Date.now(),
        name: name,
        category: category,
        color: color,
        image: selectedImage
    };

    wardrobe.push(clothingItem);

    saveWardrobe();
    displayWardrobe();

    // RESET FORM
    document.getElementById("clothingName").value = "";
    document.getElementById("clothingCategory").value = "";
    document.getElementById("clothingColor").value = "";
    document.getElementById("clothingImage").value = "";
    document.getElementById("imagePreview").innerHTML = "";
    document.getElementById("uploadText").textContent = "📸 CLICK TO ADD PHOTO";
    selectedImage = "";
}

// ========================================
// DISPLAY WARDROBE
// ========================================

function displayWardrobe() {
    const grid = document.getElementById("clothingGrid");
    const itemCount = document.getElementById("itemCount");

    if (!grid) return;

    grid.innerHTML = "";

    itemCount.textContent =
        wardrobe.length + (wardrobe.length === 1 ? " ITEM" : " ITEMS");

    if (wardrobe.length === 0) {
        grid.innerHTML = `
            <div class="empty-message">
                <div class="empty-icon">♡</div>
                <h3>Your closet is suspiciously empty.</h3>
                <p>Add something before CHER can ruin your outfit.</p>
            </div>
        `;
        return;
    }

    wardrobe.forEach(function(item) {
        const card = document.createElement("div");
        card.className = "clothing-card";

        const imageHTML = item.image
            ? `<img class="clothing-image" src="${item.image}" alt="${item.name}">`
            : `<div class="clothing-icon">♡</div>`;

        card.innerHTML = `
            ${imageHTML}
            <div class="clothing-info">
                <h3>${item.name}</h3>
                <p>${item.category}</p>
                <span>${item.color}</span>
            </div>
            <button class="delete-button" onclick="deleteClothing(${item.id})">×</button>
        `;

        grid.appendChild(card);
    });
}

// ========================================
// DELETE CLOTHING
// ========================================

function deleteClothing(id) {
    wardrobe = wardrobe.filter(function(item) {
        return item.id !== id;
    });

    saveWardrobe();
    displayWardrobe();
}

// ========================================
// SAVE WARDROBE
// ========================================

function saveWardrobe() {
    localStorage.setItem(
        "cherWardrobe",
        JSON.stringify(wardrobe)
    );
}

// ========================================
// BACK
// ========================================

function goBack() {
    window.location.href = "index.html";
}

// ========================================
// LOAD
// ========================================

if (document.getElementById("clothingGrid")) {
    displayWardrobe();
}

// ========================================
// CONSULTATION
// ========================================

let consultation = {
    occasion: "",
    style: "",
    weather: "",
    walking: ""
};

// START CONSULTATION
function startConsultation() {
    window.location.href = "consult.html";
}

// SELECT OPTION
function selectOption(type, value, button) {
    consultation[type] = value;

    const parent = button.parentElement;
    const buttons = parent.querySelectorAll(".option");

    buttons.forEach(function(btn) {
        btn.classList.remove("selected");
    });

    button.classList.add("selected");
}

// ANALYZE
// ========================================
// CONSULTATION & OUTFIT ANALYSIS ROUTING
// ========================================

function analyzeOutfit() {
    const error = document.getElementById("consultError");

    if (
        consultation.occasion === "" ||
        consultation.style === "" ||
        consultation.weather === "" ||
        consultation.walking === ""
    ) {
        error.textContent = "CHER.EXE: Please answer everything. I cannot judge you yet.";
        return;
    }

    // Clear any previous error messages if validation passes
    error.textContent = "";

    // Save user answers to localStorage for Grok to read on result.html
    localStorage.setItem(
        "cherConsultation",
        JSON.stringify(consultation)
    );

    // Redirect to the AI Saboteur results page
    window.location.href = "result.html";
}

// ========================================
// V0.6 — GEMINI AI SABOTEUR ENGINE
// ========================================

// ========================================
// V0.6 — OPTIMIZED GEMINI AI SABOTEUR ENGINE
// ========================================

async function callGrokSaboteur() {
    const rawWardrobe = JSON.parse(localStorage.getItem("cherWardrobe")) || [];
    const consultation = JSON.parse(localStorage.getItem("cherConsultation")) || {};
    
    const loadingScreen = document.getElementById("loadingScreen");
    const resultContainer = document.getElementById("resultContainer");
    const outfitDisplay = document.getElementById("outfitDisplay");
    const uselessnessScore = document.getElementById("uselessnessScore");
    const aiVerdict = document.getElementById("aiVerdict");

    if (!resultContainer) return;

    if (rawWardrobe.length === 0) {
        loadingScreen.style.display = "none";
        resultContainer.style.display = "block";
        outfitDisplay.innerHTML = `
            <div class="empty-message">
                <h3>Your closet is empty.</h3>
                <p>CHER cannot sabotage nothing. Add clothes first.</p>
            </div>
        `;
        return;
    }

    // STRIP BASE64 IMAGES FROM THE AI PROMPT TO SAVE TOKENS
    const aiWardrobe = rawWardrobe.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        color: item.color
    }));

    const prompt = `You are CHER.EXE, a brutally sarcastic digital fashion saboteur inspired by Clueless. 
    The user's available wardrobe is: ${JSON.stringify(aiWardrobe)}. 
    Their constraints: going to ${consultation.occasion}, wanting a ${consultation.style} look, weather is ${consultation.weather}, and doing ${consultation.walking} walking.
    
    Task: Select 4 item IDs from their wardrobe that make the ABSOLUTE WORST, most catastrophically mismatched combination possible. 
    Return a strict JSON object with these keys:
    1. "selectedItemIds": an array of numbers matching the IDs of the chosen items.
    2. "score": an integer score from 0 to 100 representing the total uselessness.
    3. "verdict": a biting, sarcastic 1-2 sentence roast explaining why this outfit is a disaster.
    
    Return ONLY valid JSON with no extra markdown text.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.9,
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0].content) {
            console.error("Gemini API Error Response:", data);
            throw new Error(data.error?.message || "Invalid Gemini response structure");
        }

        const content = data.candidates[0].content.parts[0].text;
        const result = JSON.parse(content);

        loadingScreen.style.display = "none";
        resultContainer.style.display = "block";

        const chosenItems = rawWardrobe.filter(item => result.selectedItemIds.includes(item.id));
        
        outfitDisplay.innerHTML = "";
        
        const itemsToRender = chosenItems.length > 0 ? chosenItems : rawWardrobe.slice(0, 2);

        itemsToRender.forEach(item => {
            const card = document.createElement("div");
            card.className = "clothing-card";
            const imageHTML = item.image 
                ? `<img class="clothing-image" src="${item.image}" alt="${item.name}">`
                : `<div class="clothing-icon">♡</div>`;
            card.innerHTML = `
                ${imageHTML}
                <div class="clothing-info">
                    <h3>${item.name}</h3>
                    <p>${item.category}</p>
                    <span>${item.color}</span>
                </div>
            `;
            outfitDisplay.appendChild(card);
        });

        uselessnessScore.textContent = (result.score || 99) + "/100";
        aiVerdict.textContent = result.verdict || "This outfit is an absolute hate crime against fashion.";

    } catch (error) {
        console.error("Gemini Execution Error:", error);
        loadingScreen.innerHTML = `<p>CHER.EXE crashed: ${error.message}. Check your API key or wait a minute for the quota reset.</p>`;
    }
}

// Auto-trigger when result.html loads
if (document.getElementById("resultContainer")) {
    callGrokSaboteur();
}