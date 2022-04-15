$(document).ready(() => {
  $(function(){
    $('#myModal').on('shown.bs.modal', function () {
       $('#modal-content').focus()
    });
 });
  
  const fakeStoreApi = 'https://fakestoreapi.com/products';
  const postPaymentURL = 'http://localhost:3000/payment';
  
  const getProducts = async() => {
    const res = await axios.get(fakeStoreApi);
    const data = await res.data;
    console.log(data);
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
            <p class="card-text" id="price">Price ${item.price}</li>
            <br>
            <button class="btn btn-primary" id="card-btn"><i class="fa-solid fa-cart-plus"></i></button>
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
            <p id="price">Price: ${item.price}</p>
            
            <button id="delete-btn" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash-can"></i>Delete</button>
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

  //get subtotal
  const getSubtotal = () => {
    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += item.price;
    })
    console.log(subtotal)
    return subtotal;
  }

  const displaySubtotal = () => {
    $("#subtotal").text(`Subtotal: $${getSubtotal().toFixed(2)}`);
  }

  //Populate Cart if Items are in localStorage
  let cartItems = JSON.parse(localStorage.getItem('cartItems'));
  if (cartItems === null) {  
    cartItems = [];
  } else {
    console.log(cartItems);
    cartItems.forEach((cartItem) => {
      createCartItem(cartItem);
      displaySubtotal();
    })
  }
    
  //Add to Cart
  const addToCart = (item) => {    
    cartItems.push(item)
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    createCartItem(item)
    displaySubtotal()
  }

  const emptyCart = () => {
    $("#cart-items").empty();
    cartItems = []
    localStorage.clear();
    displaySubtotal();
  }
  
  $("#clearcart").on('click', (e) => {
    e.preventDefault();
    emptyCart();
  })

  const displayItemsCheckOut = () => { 
    cartItems.forEach((item) => {
      $("#items-check").append(`
        
        <ul>
          <li class="list-group-item">
            <div class="row">
              <div class="col-md-12">            
                <p>${item.title}</p>
                <p id="price">Price: ${item.price}</p>
              </div>
            </div>
          </li>
        </ul>
      `);
    })
  }
  displayItemsCheckOut();


  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    let total = getSubtotal();
    $("#totalPrice").text(`Total: $${total.toFixed(2)}`);
    $("#province-select").on('change', () => {
      if ($("#province-select").val() === "Ontario")  {
        total = subtotal * 1.13;
      } else if ($("#province-select").val() === "Quebec") {
        total = subtotal * 1.1475;
      } else if($("#province-select").val() === "British Columbia" || $("#province-select").val() === "Manitoba") {
        total = subtotal * 1.12;
      } else if($("#province-select").val() === "Yukon" || $("#province-select").val() === "North West Territories" || $("#province-select").val() === "Nunavut") {
        total = subtotal * 1.05;
      } else if($("#province-select").val() === "Saskatchewan") {
        total = subtotal * 1.11;
      } else {
        total = subtotal * 1.15;
      }
      $("#totalPrice").text(`Total: $${total.toFixed(2)}`);
    })
    return total;
  }
  getTotalPrice();
  
  const validateForm = () => {
    const fname = $("#name").val();
    const lname = $("#lastname").val();
    const email = $("#email").val();
    const postcode = $("#postal").val();

    const nameRX = /[a-zA-Z]/;
    const emailRX = /(\w\.?)+@[\w\.-]+\.\w{2,4}/;
    const postalRX = /[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

    const lnameTest = nameRX.test(lname);
    const fnameTest = nameRX.test(fname);
    const emailTest = emailRX.test(email);
    const postalTest = postalRX.test(postcode);

    if (!fnameTest) {
      return alert("Name not valid");
    }
    if (!lnameTest) {
      return alert("Name not valid");
    }
    if (!emailTest) {
      return alert("Email not valid");
    }
    if (!postalTest) {
      return alert("Postal code not valid");
    }
  
    //If form submission successful
    if(lnameTest && fnameTest && emailTest && postalTest){
      return alert('Payement successful');
    }
  }

  const validatePayment = () => {
    const cardNumber = $("#card-number").val();
    const cardName = $("#card-name").val();
    const cardCvv = $("#card-cvv").val();
    const cardExp = $("#card-exp").val();

    const cardNumberRX = /^\d{16}$/;
    const cardNameRX = /^[a-zA-Z ]+$/;
    const cardCvvRX = /^\d{3}$/;
    const cardExpRX = /^\d{4}$/;

    const cardNumberTest = cardNumberRX.test(cardNumber);
    const cardNameTest = cardNameRX.test(cardName);
    const cardCvvTest = cardCvvRX.test(cardCvv);
    const cardExpTest = cardExpRX.test(cardExp);

    if (!cardNumberTest) {
      return alert("Card number not valid");
    }
    if (!cardNameTest) {
      return alert("Card name not valid");
    }
    if (!cardCvvTest) {
      return alert("Card cvv not valid");
    }
    if (!cardExpTest) {
      return alert("Card exp not valid");
    }
  
    //If form submission successful
    if(cardNumberTest  && cardNameTest && cardCvvTest && cardExpTest){
      return alert('Payement successful');
    }
  }

  const payload = async () => {
    const total = getTotalPrice();
    const subtotal = getSubtotal();
    const province = $("#province-select").val();
    const name = $("#name").val();
    const lastname = $("#lastname").val();
    const email = $("#email").val();
    const phone = $("#phone").val();
    const postal = $("#postal").val();
    const cardNumber = $("#card-number").val();
    const cardName = $("#card-name").val();
    const cardCvv = $("#card-cvv").val();
    const cardExp = $("#card-exp").val();
    const cartItemsPayload = JSON.parse(localStorage.getItem('cartItems'));
    const payloadData = {
      total,
      subtotal,
      province,
      name,
      lastname,
      email,
      phone,
      postal,
      cardNumber,
      cardName,
      cardCvv,
      cardExp,
      cartItemsPayload
    }    
    const postPayment = await axios.post(postPaymentURL, payloadData);
    const result = await postPayment.data;
    console.log(result);
  }

  $("#submit-payment").on('click', (e) => {
    e.preventDefault();
    validateForm();
    validatePayment();
    payload();
  })
}) 
