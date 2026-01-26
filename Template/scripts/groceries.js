	
// Array of products, each product is an object with different fieldset
// A set of ingredients should be added to products		

// I changed the schema so it follows assignment structure, format like this
// for future products to add - Matt 
var products = [
	{
		name: "brocoli",
		clientStatus: {
			vegetarian: true,
			glutenFree: true,
			diabetic: true,
			lactoseIntolerant: true,
			pescatarian: true
		},
		organic: true,
		image: "",
		price: 1.99
	},
	{
		name: "bread",
		clientStatus: {
			vegetarian: true,
			glutenFree: false,
			diabetic: true,
			lactoseIntolerant: true,
			pescatarian: true
		},
		organic: true,
		image: "",
		price: 2.35
	},
	{
		name: "salmon",
		clientStatus: {
			vegetarian: false,
			glutenFree: true,
			diabetic: true,
			lactoseIntolerant: true,
			pescatarian: false
		},
		organic: true,
		image: "",
		price: 10.00
	}
];

function appendProduct(products, data) {
	for (let i = 0; i < data.length; i++) {
		products.append(data[i])
	}
}


// given restrictions provided, make a reduced list of products
// prices should be included in this list, as well as a sort based on price
function restrictListProducts(prods, restriction) {
	let product_names = [];
	// I added data into list so we can carry price information on the return - Matt
	data = []
	for (let i=0; i<prods.length; i+=1) {
		if ((restriction == "Vegetarian") && (prods[i].clientStatus.vegetarian == true)){
			data = [prods[i].name, prods[i].price];
			product_names.push(data);
		}
		else if ((restriction == "GlutenFree") && (prods[i].clientStatus.glutenFree == true)){
			data = [prods[i].name, prods[i].price];
			product_names.push(data);
		}
		else if (restriction == "None"){
			data = [prods[i].name, prods[i].price];
			product_names.push(data);
		}
		// Need to add other restrictions per assignment - Matt
		else if ((restriction == "Diabetic") && (prods[i].clientStatus.diabetic == true)){
			data = [prods[i].name, prods[i].price];
			product_names.push(data);
		}
		else if ((restriction == "Lactose Intolerant") && (prods[i].clientStatus.lactoseIntolerant == true)){
			data = [prods[i].name, prods[i].price];
			product_names.push(data);
		}
		else if ((restriction == "Pescatarian") && (prods[i].clientStatus.pescatarian == true)){
			data = [prods[i].name, prods[i].price];
			product_names.push(data);
		}
	}
	return product_names;
}

// Calculate the total price of items, with received parameter being a list of products
function getTotalPrice(chosenProducts) {
	totalPrice = 0;
	for (let i=0; i<products.length; i+=1) {
		if (chosenProducts.indexOf(products[i].name) > -1){
			totalPrice += products[i].price;
		}
	}
	return totalPrice;
}
