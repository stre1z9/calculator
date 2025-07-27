document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {

            populateColors(data.colors);
            populateDensities(data.densities);

            document.getElementById('color').addEventListener('change', () => calculatePrice(data));
            document.getElementById('density').addEventListener('change', () => calculatePrice(data));
            document.getElementById('size').addEventListener('change', () => calculatePrice(data));
            document.getElementById('quantity').addEventListener('input', () => calculatePrice(data));
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
});

function populateColors(colors) {
    const colorSelect = document.getElementById('color');
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color.value;
        option.textContent = color.name;
        colorSelect.appendChild(option);
    });
}

function populateDensities(densities) {
    const densitySelect = document.getElementById('density');
    densities.forEach(density => {
        const option = document.createElement('option');
        option.value = density.value;
        option.textContent = `${density.value} г/м²`;
        densitySelect.appendChild(option);
    });
}

function calculatePrice(data) {
    const colorSelect = document.getElementById('color');
    const densitySelect = document.getElementById('density');
    const sizeSelect = document.getElementById('size');
    const quantityInput = document.getElementById('quantity');

    if (!colorSelect.value || !densitySelect.value || !sizeSelect.value || !quantityInput.value) {
        return;
    }

    const selectedColor = data.colors.find(c => c.value === colorSelect.value);
    const selectedDensity = data.densities.find(d => d.value === densitySelect.value);
    const sizePrice = data.sizes[sizeSelect.value] || 0;
    const quantity = parseInt(quantityInput.value) || 1;

    let price = data.basePrice;
    price += selectedColor.priceModifier;
    price += selectedDensity.priceModifier;
    price += sizePrice;
    price *= quantity;

    document.getElementById('price').textContent = `${price} ₽`;
}