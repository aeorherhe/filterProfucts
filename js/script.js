const productsContainer = document.querySelector(".products-ctn");

// source images from api
const url = "https://course-api.com/javascript-store-products";

const fetchProducts = async () => {
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  } catch (error) {
    productsContainer.innerHTML = `<h3>Sorry, couldn't load products. Please try again later</h3>`;
  }
};

const allProducts = await fetchProducts();
let productLists = [...allProducts];

const showProducts = async () => {
  if (productLists.length < 1) {
    productsContainer.innerHTML = `<h3>Sorry, no products matched your search</h3>`;
    return;
  }
  productsContainer.innerHTML = productLists
    .map((products) => {
      const { id } = products;
      const { name: title, price } = products.fields;
      const { url: img } = products.fields.image[0];
      return `<article class="product" data-id="${id}">
              <img
                src="${img}"
                alt="${title}"
                class="product-img"
              />
              <p class="product-name">${title}</p>
              <p class="product-price">$<span class="price">${price}</span></p>
            </article>`;
    })
    .join(" ");
};

showProducts();

// filter product base on input
const input = document.querySelector(".search-input");
input.addEventListener("keyup", async () => {
  const inputValue = input.value;
  productLists = allProducts.filter((product) => {
    return product.fields.name.toLowerCase().includes(inputValue);
  });
  showProducts();
});

// filter product with buttons
const filterBtns = document.querySelector(".btns-ctn");
const searchButtons = () => {
  const btns = [
    "all",
    ...new Set(
      allProducts.map((product) => {
        return product.fields.company;
      })
    ),
  ];

  filterBtns.innerHTML = btns
    .map((company) => {
      return `<button class="btn" data-id="${company}">${company}</button>`;
    })
    .join(" ");
};

searchButtons();

filterBtns.addEventListener("click", (e) => {
  const selection = e.target;
  if (selection.classList.contains("btn")) {
    if (selection.dataset.id === "all") {
      productLists = [...allProducts];
    } else {
      productLists = allProducts.filter((products) => {
        return products.fields.company === selection.dataset.id;
      });
    }
    input.value = "";
    showProducts();
  }
});
