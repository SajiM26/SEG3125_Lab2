var globalCart = [];
var globalRestrictions = [];


// This function is called when any of the tab is clicked
// It is adapted from https://www.w3schools.com/howto/howto_js_tabs.asp

function openInfo(evt, tabName) {

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
	if(tabName === 'Products') {
		populateListProductChoices(globalRestrictions, "displayProduct");
	}

}


	
// generate a checkbox list from a list of products
// it makes each product name as the label for the checkbos

function populateListProductChoices(restrictions, slct2) {
    var s2 = document.getElementById(slct2);
    s2.innerHTML = "";
        
    var optionArray = restrictListProducts(products, restrictions);

    // Multi-Algorithm Sorting
    const sortOrderElement = document.getElementById("sortOrder");
    const sortType = sortOrderElement ? sortOrderElement.value : "priceLow";
    
    if (sortType === "priceLow") {
        optionArray.sort((a, b) => a[1] - b[1]); 
    } else if (sortType === "priceHigh") {
        optionArray.sort((a, b) => b[1] - a[1]); 
    } else if (sortType === "alphabetical") {
        optionArray.sort((a, b) => a[0].localeCompare(b[0])); 
    }

    // Build the UI rows
    for (var i = 0; i < optionArray.length; i++) {
        let nameOnly = optionArray[i][0]; 
        let productPrice = optionArray[i][1];
        let productObj = products.find(p => p.name === nameOnly);

        var productTable = document.createElement("div");
        productTable.style.display = "flex";
        productTable.style.alignItems = "center";
        productTable.style.marginBottom = "15px";
        productTable.style.gap = "15px"; 

        var img = document.createElement("img");
        img.src = productObj.image; 
        img.style.width = "50px";
        img.style.height = "50px";
        productTable.appendChild(img);

        var label = document.createElement('label');
        label.appendChild(document.createTextNode(nameOnly + " $" + productPrice.toFixed(2)));
        productTable.appendChild(label);

        var qtyDiv = document.createElement("div");
        qtyDiv.style.display = "flex";
        qtyDiv.style.alignItems = "center";
        qtyDiv.style.gap = "10px";

        let qtyInput = document.createElement("input");
        qtyInput.type = "text";
        qtyInput.name = "quantity";
        qtyInput.value = 0;
        qtyInput.style.width = "40px";
        qtyInput.style.textAlign = "center";

        let minusButton = document.createElement("button");
        minusButton.innerText = "-";
        minusButton.type = "button";
        minusButton.onclick = (function(input) {
            return function() { if (Number(input.value) > 0) input.value = Number(input.value) - 1; };
        })(qtyInput);

        let addButton = document.createElement("button");
        addButton.innerText = "+";
        addButton.type = "button";
        addButton.onclick = (function(input) {
            return function() { input.value = Number(input.value) + 1; };
        })(qtyInput);

        qtyDiv.appendChild(minusButton);
        qtyDiv.appendChild(qtyInput);
        qtyDiv.appendChild(addButton);
        productTable.appendChild(qtyDiv);
        s2.appendChild(productTable);
    }
}
	
// This function is called when the "Add selected items to cart" button in clicked
// The purpose is to build the HTML to be displayed (a Paragraph) 
// We build a paragraph to contain the list of selected items, and the total price

// This replaces your old selectedItems function
function selectedItems() {
	//use const to "lock in" the product rows at this moment
	const productRows = document.getElementById("displayProduct").children;

	for (let i = 0; i < productRows.length; i++) {
		const row = productRows[i];
		const label = row.querySelector('label');
		const productName = label.textContent.split(" $")[0];
		const qtyInput = row.querySelector('input[name="quantity"]');
		const quantity = Number(qtyInput.value);

		if (quantity > 0) {
        	let cartItem = globalCart.find(item => item.name === productName);
			if (cartItem) {
				cartItem.quantity += quantity;
			} else {
				globalCart.push({ name: productName, quantity });
			}
        qtyInput.value = 0;
    	}
	}
    updateCartDisplay();
}

// New function to handle drawing the cart and the Remove buttons used online help to get items from a page using divs/tables and rows
// Updated function to match Products tab styling with individual and bulk removal
function updateCartDisplay() {
    const c = document.getElementById('displayCart');
    c.innerHTML = "";

    if (globalCart.length === 0) {
        c.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    const cartContainer = document.createElement("div");

    globalCart.forEach(item => {
        const productObj = products.find(p => p.name === item.name);

        var itemRow = document.createElement("div");
        itemRow.style.display = "flex";
        itemRow.style.alignItems = "center";
        itemRow.style.marginBottom = "15px";
        itemRow.style.gap = "15px";

        // Image
        var img = document.createElement("img");
        img.src = productObj.image;
        img.style.width = "50px";
        img.style.height = "50px";
        itemRow.appendChild(img);

        // Label with Name and Subtotal
        var label = document.createElement('label');
        let subtotal = (productObj.price * item.quantity).toFixed(2);
        label.appendChild(document.createTextNode(`${item.name} (x${item.quantity}) - $${subtotal}`));
        itemRow.appendChild(label);

        // Controls container
        var ctrlDiv = document.createElement("div");
        ctrlDiv.style.display = "flex";
        ctrlDiv.style.alignItems = "center";
        ctrlDiv.style.gap = "10px";

        // Remove One Button
        let minusBtn = document.createElement("button");
        minusBtn.innerText = "-";
        minusBtn.style.width = "30px";
        minusBtn.style.height = "30px";
        minusBtn.style.cursor = "pointer";
        minusBtn.onclick = () => removeOneFromCart(item.name);

        // Remove All of this item Button
        let removeAllBtn = document.createElement("button");
        removeAllBtn.innerText = "Remove All";
        removeAllBtn.style.padding = "5px 10px";
        removeAllBtn.style.cursor = "pointer";
        removeAllBtn.onclick = () => removeItemFromCart(item.name);

        ctrlDiv.appendChild(minusBtn);
        ctrlDiv.appendChild(removeAllBtn);

        itemRow.appendChild(ctrlDiv);
        cartContainer.appendChild(itemRow);
    });

    c.appendChild(cartContainer);

    // Total Price Display
    const total = globalCart.reduce((sum, item) => {
        const productObj = products.find(p => p.name === item.name);
        return sum + productObj.price * item.quantity;
    }, 0);

    const totalDiv = document.createElement("div");
    totalDiv.style.marginTop = "20px";
    totalDiv.style.fontWeight = "bold";
    totalDiv.style.fontSize = "1.2rem";
    totalDiv.innerText = `Total Price: $${total.toFixed(2)}`;
    c.appendChild(totalDiv);

    // Bulk Clear Button
    const clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear Entire Cart";
    clearBtn.className = "block";
    clearBtn.style.backgroundColor = "#e74c3c";
    clearBtn.onclick = () => clearCart();
    c.appendChild(clearBtn);
}

// New helper to decrement quantity
function removeOneFromCart(productName) {
    let item = globalCart.find(item => item.name === productName);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeItemFromCart(productName);
        } else {
            updateCartDisplay();
        }
    }
}

// New helper to clear everything
function clearCart() {
    if (confirm("Are you sure you want to empty your cart?")) {
        globalCart = [];
        updateCartDisplay();
    }
}

function removeItemFromCart(productName) {
    globalCart = globalCart.filter(item => item.name !== productName);
    updateCartDisplay();
}

/*
function updateProductList() {
	let restrictions = [];
	let checkboxes = document.getElementsByName("dietSelect");
	for (let i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			restrictions.push(checboxes[i].value);
		}
	}

	populateListProductChoices(restrictions, "displayProduct");
} */

function restrictions(value) {
    if(globalRestrictions.includes(value)) {
        let index = globalRestrictions.indexOf(value);
        globalRestrictions.splice(index, 1);
    } else {
        globalRestrictions.push(value);
    }
    populateListProductChoices(globalRestrictions, "displayProduct");
}

function toggleFilterMenu() {
    var menu = document.getElementById("filterMenu");
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}
