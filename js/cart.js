import { fetchData } from 'data.js';

document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchData();
    initCart(data);
});

function initCart(data) {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const calculateBtn = document.getElementById('calculateTotal');
    const orderTotal = document.getElementById('orderTotal');

    // Загрузка товаров из LocalStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Корзина пуста</p>';
        return;
    }

    // Отображение товаров
    cart.forEach(item => {
        const density = data.densities.find(d => d.value == item.density);
        const print = data.prints.find(p => p.id == item.print);
        
        cartItems.innerHTML += `
            <div class="cart-item">
                <span>Футболка ${density.value} г/м², ${item.size}, ${print.name}</span>
                <span>${item.quantity} × ${item.price.toFixed(2)} руб</span>
            </div>
        `;
    });

    // Расчёт итоговой суммы
    calculateBtn.addEventListener('click', () => {
        const delivery = document.getElementById('delivery').value;
        const service = document.getElementById('service').value;
        const packaging = document.getElementById('packaging').checked;
        
        let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;
        
        // Доставка
        if (delivery === 'card') total += subtotal * 0.02;
        
        // Услуги
        if (service === 'legal') total += subtotal * 0.08;
        else if (service === 'marking') total += subtotal * 0.12;
        
        // Упаковка
        if (packaging) total += 15;
        
        orderTotal.textContent = `К оплате: ${total.toFixed(2)} руб`;
    });
}
