const currencyGrid = document.querySelector('.currency-rate-tracker-content-grid-wrapper');

const currencyPickerFrom = document.querySelector("#converter-currency-picker-from")
const currencyPickerTo = document.querySelector("#converter-currency-picker-to")

const currencyWishlistPickerFrom = document.querySelector("#wishlist-currency-picker-from")
const currencyWishlistPickerTo = document.querySelector("#wishlist-currency-picker-to")

const covertActionButton = document.querySelector("#convert-action-button")

const wishlistForm = document.querySelector("#add-wishlist-item-form")

appStartup()

async function appStartup() {
  const currencyList = await fetchCurrencyList();

  fillCurrencyPickerSelector(currencyPickerFrom, currencyList)
  fillCurrencyPickerSelector(currencyPickerTo, currencyList)
  fillCurrencyPickerSelector(currencyWishlistPickerFrom, currencyList)
  fillCurrencyPickerSelector(currencyWishlistPickerTo, currencyList)

  convertCurrencyButtonSetup(currencyList)
  addWishlistFormSetup(currencyList)
}

function convertCurrencyButtonSetup(currencyList) {
  covertActionButton.addEventListener("click", () => {
    const currencyFrom = currencyPickerFrom.value;
    const currencyTo = currencyPickerTo.value;
    const amount = document.querySelector("#currency-quantity").value;

    const convertedAmount = convertCurrency(currencyFrom, currencyTo, amount, { currencyRate: currencyList });

    const convertedAmountElement = document.querySelector(".currency-converter-result > p");

    convertedAmountElement.textContent = convertedAmount;
  })
}

function addWishlistFormSetup(currencyList) {
  wishlistForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    console.log(data.get("item-name"))
    console.log([...data.entries()]);


    const wishlistItem = {
      name: data.get("item-name"),
      from: data.get("wishlist-currency-from"),
      to: data.get("wishlist-currency-to"),
      amount: data.get("item-amount"),
    }

    console.log(wishlistItem)



    addItemToWishlist(wishlistItem, currencyList)
  })
}

function fillCurrencyPickerSelector(parentElement, currencyList) {
  for (const currency in currencyList) {
    const currencyOption = document.createElement('option');
    currencyOption.value = currency;
    currencyOption.textContent = currency;
    parentElement.appendChild(currencyOption);
  }
}

// options = {
//   currencyRate: Object
// }
function convertCurrency(from, to, amount, options) {
  const fromRate = options.currencyRate[from];
  const toRate = options.currencyRate[to];

  const convertedAmount = (amount * toRate) / fromRate;

  return Math.round(convertedAmount * 100) / 100;
}

async function fetchCurrencyList() {
  const response = await fetch("https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_GcDD8LT7uFPn53s8bZZ5AaQzVESVKOM0ejNzlEtV");
  const currencyList = await response.json();

  return currencyList.data;
}

function addItemToWishlist(wishlistItem, currencyList) {
  const div = document.createElement('div');
  div.classList.add('wishlist-item');

  const name = document.createElement('p');
  name.textContent = wishlistItem.name;

  const originalPrice = document.createElement('p');
  originalPrice.textContent = `${wishlistItem.amount} ${wishlistItem.from}`;

  const convertedPrice = document.createElement('p');
  convertedPrice.textContent = `${convertCurrency(wishlistItem.from, wishlistItem.to, wishlistItem.amount, { currencyRate: currencyList })} ${wishlistItem.to}`;

  div.appendChild(name);
  div.appendChild(originalPrice);
  div.appendChild(convertedPrice);

  const wishlist = document.querySelector("#wishlist-grid");
  wishlist.appendChild(div);
}


