$(document).ready(() => {
  const fakeStoreApi = 'https://fakestoreapi.com/products';

  const getProducts = async() => {
    const res = await axios.get(fakeStoreApi);
    const data = await res.data;
    return data;
  }

  //Fetch Items from API
  getProducts().then((data) => {
    let cards = '';
    data.forEach((item) => {     
      cards += `       
        <div class="card">
          <div class="card-body">
          <img class="card-img" src="${item.image}" alt="Card image">
            <h5 class="card-title">${item.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${item.category}</h6>
            <p class="card-text">${item.description}</p>
            <p class="card-text">Price ${item.price}</li>
            <br>
            <button class="btn btn-primary" id="card-btn">Add To Cart</button>
          </div>
        </div>
      `;      
    })
    $(".card-columns").append(cards); 
    const btns = document.querySelectorAll('#card-btn');
    btns.forEach((btn, index) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        addToCart(data[index])
      })
    })
  }).catch((err) => {
    console.log(err);
  })

  //Create the cart list item
  const createCartItem = (item) => {      
    let cartItem = `
      <li class="list-group-item">
        <div class="row">
          <div class="col-md-3">
            <img src="${item.image}" alt="${item.title}" class="img-fluid">
          </div>
          <div class="col-md-9">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <p>Price: ${item.price}</p>
            
            <button id="delete-btn" class="btn btn-danger btn-sm">Delete</button>
          </div>
        </div>
      </li>
    `;  
    $("#cart-items").append(cartItem);
    
    const deleteBtns = document.querySelectorAll('#delete-btn');
    deleteBtns.forEach((btn, index) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        cartItems.splice(index, 1);
        localStorage.removeItem('cartItems', JSON.stringify(cartItems));
        $(btn).parent().parent().parent().remove();
        displaySubtotal();
      })
    })
    
  }

  //Populate Cart if Items are in localStorage
  let cartItems = JSON.parse(localStorage.getItem('cartItems'));
  if (cartItems === null) {  
    cartItems = [];
  } else {
    console.log(cartItems);
    cartItems.forEach((cartItem) => {
      createCartItem(cartItem);
    })
  }
    
  //Add to Cart
  const addToCart = (item) => {
    
    cartItems.push(item)
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    createCartItem(item)
    displaySubtotal()
  }

  //get subtotal
  const getSubtotal = () => {
    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += item.price;
    })
    return subtotal;
  }

  const displaySubtotal = () => {
    $("#subtotal").text(`Subtotal: ${getSubtotal().toFixed(2)}`);
  }
  displaySubtotal()
}) 
