let wardrobe = JSON.parse(
    localStorage.getItem("cherWardrobe")
) || [];

// ENTER CLOSET ROUTING
function enterCloset() {
    window.location.href = "closet.html";
}

// ADD CLOTHING
function addClothing() {
    const name = document.getElementById("clothingName").value.trim();
    const category = document.getElementById("clothingCategory").value;
    const color = document.getElementById("clothingColor").value;

    if (name === "" || category === "" || color === "") {
        alert("CHER.EXE says: Please fill everything in.");
        return;
    }

    const clothingItem = {
        id: Date.now(),
        name: name,
        category: category,
        color: color
    };

    wardrobe.push(clothingItem);

    saveWardrobe();
    displayWardrobe();

    // Clear form
    document.getElementById("clothingName").value = "";
    document.getElementById("clothingCategory").value = "";
    document.getElementById("clothingColor").value = "";
}

// DISPLAY CLOTHES
function displayWardrobe() {
    const grid = document.getElementById("clothingGrid");
    const itemCount = document.getElementById("itemCount");

    if (!grid) return;

    grid.innerHTML = "";

    itemCount.textContent =
        wardrobe.length +
        (wardrobe.length === 1 ? " ITEM" : " ITEMS");

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

        card.innerHTML = `
            <div class="clothing-icon">♡</div>
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

// DELETE CLOTHING
function deleteClothing(id) {
    wardrobe = wardrobe.filter(function(item) {
        return item.id !== id;
    });

    saveWardrobe();
    displayWardrobe();
}

// SAVE TO LOCAL STORAGE
function saveWardrobe() {
    localStorage.setItem(
        "cherWardrobe",
        JSON.stringify(wardrobe)
    );
}

// GO BACK
function goBack() {
    window.location.href = "index.html";
}

// LOAD CLOSET ON STARTUP
if (document.getElementById("clothingGrid")) {
    displayWardrobe();
}