$(document).ready(() => {
  $(function(){
    $('#myModal').on('shown.bs.modal', function () {
       $('#modal-content').focus()
    });
 });
  
  const fakeStoreApi = 'https://fakestoreapi.com/products';
  const postPaymentURL = 'https://deepblue.camosun.bc.ca/~c0180354/ics128/final/';
  
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

  // Popluate items for checkout modal
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
    
  //Add to Cart
  const addToCart = (item) => {    
    cartItems.push(item)
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    createCartItem(item)
    displaySubtotal()
  }

  // Empty cart
  const emptyCart = () => {
    $("#cart-items").empty();
    $("#items-check").empty();
    cartItems = []
    localStorage.clear();
    displaySubtotal();
    displayItemsCheckOut();
  }
  
  $("#clearcart").on('click', (e) => {
    e.preventDefault();
    emptyCart();
  })  

  //Set the taxt Rate
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

  $("#checkOutBtn").on('click', (e) => {
    e.preventDefault();
    displayItemsCheckOut();
    getTotalPrice();    
  })

  //Collect order info for json payload and post to server  
  const postPurchase = async () => {
    const currency = "cad";
    const country = "ca";
    const province = $("#province-select").val();
    const city = $("#city").val();
    const firstName = $("#fname").val();
    const lastName = $("#lname").val();
    const email = $("#email").val();
    const phone = $("#phone").val();
    const postal = $("#postal").val();
    const address = $("#address").val();
    const card_number = $("#card-number").val();
    const cardCvv = $("#card-cvv").val();
    const expiry_month = $("#card-exp-month").val();
    const expiry_year = $("#card-exp-year").val();

    const payload = {
      amount: getTotalPrice(),
      card_number: card_number,
      security_code: cardCvv,
      expiry_month: expiry_month,
      expiry_year: expiry_year,
      currency: currency,
      billing: {
        first_name: firstName,
        last_name: lastName,
        address_1: address,
        city: city,
        province: province,
        country: country,
        postal: postal,
        phone: phone,
        email: email,
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        address_1: address,
        city: city,
        province: province,
        country: country,
        postal: postal,
      }
    }
    const formData = new FormData();
    formData.set('submission', await JSON.stringify(payload));
    const response = await fetch(postPaymentURL, {
        method: "POST",
        cache: 'no-cache',
        body: formData,
    });
    console.log(response)
  }
    
  const validateForm = () => {
    const firstName = $("#fname").val();
    const lastName = $("#lastname").val();
    const email = $("#email").val();
    const phone = $("#phone").val();
    const postal = $("#postal").val();
    const address = $("#address").val();
    const card_number = $("#card-number").val();
    const cardCvv = $("#card-cvv").val();
    const expiry_month = $("#card-exp-month").val();
    const expiry_year = $("#card-exp-year").val();
        
    const nameRX = /[a-zA-Z]/;
    const emailRX = /(\w\.?)+@[\w\.-]+\.\w{2,4}/;
    const postalRX = /[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    const cardNumberRX = /\d{16}/;
    const cardCvvRX = /\d{3}$/;
    const cardExpYearRX = /\d{4}$/;
    const cardExpMonthRX = /\d{2}$/;
    const phoneRX = /\d{10}/;
    const addressRX = /^.{3,}$/

    const fnameTest = nameRX.test(firstName);
    const lnameTest = nameRX.test(lastName);
    const emailTest = emailRX.test(email);
    const postalTest = postalRX.test(postal);
    const cardNumberTest = cardNumberRX.test(card_number);
    const cardCvvTest = cardCvvRX.test(cardCvv);
    const cardExpYearTest = cardExpYearRX.test(expiry_year);
    const cardExpMonthTest = cardExpMonthRX.test(expiry_month);
    const phoneTest = phoneRX.test(phone);
    const addressTest = addressRX.test(address);
        
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
    if (!cardNumberTest) {
      return alert("Card number not valid");
    }
    if (!cardCvvTest) {
      return alert("Card cvv not valid");
    }
    if (!cardExpYearTest) {
      return alert("Card exp not valid");
    }
    if (!cardExpMonthTest) {
      return alert("Card exp not valid");
    }
    if (!phoneTest) {
      return alert("Card exp not valid");
    }
  
    //If form submission successful
    if(lnameTest && fnameTest && emailTest && postalTest && cardNumberTest && cardCvvTest && cardExpYearTest && cardExpMonthTest && phoneTest && addressTest) {
      postPurchase(); 
      emptyCart();
      return alert('Payement successful');
    }
  }

  $("#submit-payment").on('click', (e) => {
    e.preventDefault();
    validateForm();       
  })
}) 
