$(document).ready(() => {
  const fakeStoreApi = 'https://fakestoreapi.com/products';
  const cartApi = 'http://localhost:3000/cartItems'

  const getProducts = async() => {
    const res = await axios.get(fakeStoreApi);
    const data = await res.data;
    return data;
  }

  const getCartItems = async() => {
    const res = await axios.get(cartApi);
    const data = await res.data;
    return data;
  }

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
        addToCart(data[index]).catch((err) =>{
          console.log(err)
        });   
      })
    })
  }).catch((err) => {
    console.log(err);
  })
  
  const addToCart = async (item) => {      
    const cartItem = {
      itemId: item.id,
      title: item.title,
      price: item.price,
    }
    const res = await axios.post(cartApi, cartItem);
    const data = await res.data;
    console.log(data);
    return data;      
  }  
}) 
