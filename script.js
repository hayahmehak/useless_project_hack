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

    localStorage.setItem(
        "cherConsultation",
        JSON.stringify(consultation)
    );

    alert("Consultation saved successfully!");
}