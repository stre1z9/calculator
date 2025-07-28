export async function fetchData() {
    const response = await fetch('./data/products.json');
    return await response.json();
}
