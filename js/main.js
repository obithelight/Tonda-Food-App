document.querySelector('button').addEventListener('click', getFetch)
const table = document.querySelector('table')

function getFetch(){
    const userInput = document.getElementById("barcode").value; 
    const url = `https://world.openfoodfacts.org/api/v0/product/${userInput}.json`

        if(userInput.length){
                if(table.classList.add('hidden')){
                    document.location.reload()
                }else{
                    table.classList.toggle('hidden')
                }
        }else{
            alert('Please enter a UPC/EAN barcode number')
            table.classList.add('hidden')
        }

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
                if (data.status === 1) {
                    const item = new ProductInfo(data.product)
                    item.showInfo()
                    item.listIngredients()
                } else if(userInput.length && data.status === 0){
                    table.classList.add('hidden')
                    alert(`Product ${userInput} not found. Please try another.`)
                }
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

class ProductInfo {
    constructor(productData) {
        this.name = productData.product_name
        this.ingredients = productData.ingredients
        this.image = productData.image_url
    }

    showInfo() {
        document.getElementById("product-img").src = this.image;
        document.getElementById("product-name").innerHTML = this.name
    }

    listIngredients() {
        let tableRef = document.getElementById('ingredient-table');
        
        for(let i = 1; i < tableRef.rows.length;) {
            tableRef.deleteRow(i); //deletes the row and text of ingredient-table on index[i = 1] upon page refresh or new barcode search.
        }

        if (!(this.ingredients == null)) {
            for(let key in this.ingredients) {
                
                let newRow = tableRef.insertRow(-1);
                let newIngredientsCell = newRow.insertCell(0);
                let newVeganCell = newRow.insertCell(1);
                let newVegetarianCell = newRow.insertCell(2);
                let newIngredientsText = document.createTextNode(this.ingredients[key].text);
                let veganStatus = this.ingredients[key].vegan ? this.ingredients[key].vegan : 'unknown'
                let vegetarianStatus = this.ingredients[key].vegetarian ? this.ingredients[key].vegetarian : 'unknown'
                let newVeganText = document.createTextNode(veganStatus);
                let newVegetarianText = document.createTextNode(vegetarianStatus);

                newIngredientsCell.appendChild(newIngredientsText);
                newVeganCell.appendChild(newVeganText);
                newVegetarianCell.appendChild(newVegetarianText);
                
                //VeganStatus
                if (veganStatus === 'yes') {
                    newVeganCell.classList.add('yes-items')
                
                }else if (veganStatus === 'no') {
                    newVeganCell.classList.add('no-items')
                
                }else if (veganStatus === 'maybe') {
                    newVeganCell.classList.add('maybe-items')
                
                }else if (veganStatus === 'unknown') {
                    newVeganCell.classList.add('unknown-items')
                }                

                //VegetarianStatus
                if (vegetarianStatus === 'yes') {
                    newVegetarianCell.classList.add('yes-items')
                
                }else if (vegetarianStatus === 'no') {
                    newVegetarianCell.classList.add('no-items')
                
                }else if (vegetarianStatus === 'maybe') {
                    newVegetarianCell.classList.add('maybe-items')
                
                }else if (vegetarianStatus === 'unknown') {
                    newVegetarianCell.classList.add('unknown-items')
                }    

            }
        } 
    }
}

