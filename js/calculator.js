import { fetchData } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchData();
    initCalculator(data);
});

function initCalculator(data) {
    const cutSelect = document.getElementById('cut');
    const densitySelect = document.getElementById('density');
    const sizeSelect = document.getElementById('size');
    const printSelect = document.getElementById('print');
    const quantityInput = document.getElementById('quantity');
    const materialInfo = document.getElementById('materialInfo');
    const finalPrice = document.getElementById('finalPrice');
    const addToCartBtn = document.getElementById('addToCart');

    data.cuts.forEach(cut => {
        cutSelect.innerHTML += `<option value="${cut.id}">${cut.name} (+${cut.price} руб)</option>`;
    });

    data.densities.forEach(density => {
        densitySelect.innerHTML += `<option value="${density.value}">${density.value} г/м²</option>`;
    });

    data.sizes.forEach(size => {
        sizeSelect.innerHTML += `<option value="${size}">${size}</option>`;
    });

    data.prints.forEach(print => {
        printSelect.innerHTML += `<option value="${print.id}">${print.name} (+${print.price} руб)</option>`;
    });

    densitySelect.addEventListener('change', () => {
        const selectedDensity = data.densities.find(d => d.value == densitySelect.value);
        materialInfo.innerHTML = `<strong>Состав:</strong> ${selectedDensity.material}`;
        calculatePrice();
    });

    [cutSelect, densitySelect, sizeSelect, printSelect, quantityInput].forEach(element => {
        element.addEventListener('change', calculatePrice);
    });

    function calculatePrice() {
        const cut = data.cuts.find(c => c.id === cutSelect.value); 
        const density = data.densities.find(d => d.value == densitySelect.value);
        const print = data.prints.find(p => p.id == printSelect.value);
        const quantity = parseInt(quantityInput.value);
    
        let price = density.price + cut.price + print.price;
        
        let discount = 0;
        if (quantity >= 100) discount = 0.25;
        else if (quantity >= 50) discount = 0.15;
        else if (quantity >= 10) discount = 0.05;
        
        price = price * (1 - discount) * quantity;
        finalPrice.textContent = `Итого: ${price.toFixed(2)} руб`;
        return price;
    }

    addToCartBtn.addEventListener('click', () => {
        const item = {
            cut: cutSelect.value,
            density: densitySelect.value,
            size: sizeSelect.value,
            print: printSelect.value,
            quantity: parseInt(quantityInput.value),
            price: calculatePrice() / parseInt(quantityInput.value)
        };
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        alert('Товар добавлен в корзину!');
    });
}
