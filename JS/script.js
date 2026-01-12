document.addEventListener("DOMContentLoaded", () => {
  const menuLinks = document.querySelectorAll(".navbar nav a");

  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
});


function renderAuthNav(){
  const authNav = document.getElementById("authNav");
  if(!authNav) return;

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  if(user){
    // Logged in + show profile + logout
    authNav.innerHTML = `
      <a href="profile.html" class="auth-btn profile-btn">
        <i class="fas fa-user"></i> ${user.username}
      </a>
      <button class="auth-btn logout-btn" onclick="logoutUser()">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    `;
  }else{
    // Logged out 
    authNav.innerHTML = `
      <a href="register.html" class="auth-btn auth-main">
        <i class="fas fa-sign-in-alt"></i> Login / Register
      </a>
    `;
  }
}

// Logout 
function logoutUser(){
  localStorage.removeItem("loggedUser");
  renderAuthNav(); 
}

document.addEventListener("DOMContentLoaded", renderAuthNav);



let hotels = [];

fetch("data/hotels.json")
  .then(res => res.json())
  .then(data => {
    hotels = data;
        const topRated = data
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    const slider = document.getElementById("hotel_slider");

    topRated.forEach(hotel => {
      const card = document.createElement("div");
      card.className = "hotel-card";

      card.innerHTML = `
        <img src="${hotel.image}" alt="${hotel.name}">
        <h4>${hotel.name}</h4>
        <div class="location">${hotel.location}</div>
        <div class="rating"> ${hotel.rating}⭐</div>
        <div class="price">Starts from ৳${hotel.priceSingle} / night</div>
      `;

      slider.appendChild(card);
    });
  })
  .catch(err => console.error("Error loading hotels:", err));


function searchHotel() {
  const location = document.getElementById("location").value.toLowerCase();
  const price = document.getElementById("price").value;
  const hotelList = document.getElementById("hotelList");

  hotelList.innerHTML = "";

  const filteredHotels = hotels.filter(hotel => {
    const matchLocation = hotel.location.toLowerCase().includes(location);
    const matchPrice = price === "all" || hotel.price === price;
    return matchLocation && matchPrice;
  });

  if (filteredHotels.length === 0) {
    hotelList.innerHTML = "<p>No hotels found.</p>";
    return;
  }

  filteredHotels.forEach(hotel => {
    const hotelDiv = document.createElement("div");
    hotelDiv.className = "hotel";
    hotelDiv.innerHTML = `
        <div>
        <img class="hotel-img" src="${hotel.image}" alt="${hotel.name}">
        </div>
        <div>
        <h3 class="hotel-title">${hotel.name}</h3>
        <h5>Location : ${hotel.location}</h5>
        <h5>Price per night :</h5>
        <h5>Single : ৳${hotel.priceSingle} </h5>
        <h5>Double : ৳${hotel.priceDouble} </h5>
        <h5>Delux  : ৳${hotel.priceDelux} </h5>
        <h5>Rating : ৳${hotel.rating} ⭐</h5>
        <button class="btn" onclick="bookHotel('${hotel.name}')">Book Now</button>
        </div>
    `;
    hotelList.appendChild(hotelDiv);
  });
}


function bookHotel(name) {
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  if (!user) {
    alert("Please login first to book a hotel!");
    return; 
  }

  window.location.href = `booking.html?hotel=${encodeURIComponent(name)}`;
}




let placesData = []; 

const popularContainer = document.getElementById("popular_places");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResultsContainer = document.getElementById("search_results");
const modal = document.getElementById("popupModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalType = document.getElementById("modalType");
const modalActivities = document.getElementById("modalActivities");
const modalDescription = document.getElementById("modalDescription");

fetch("data/popular_places.json")
  .then(response => response.json())
  .then(data => {
    placesData = data;

    data.forEach(place => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${place.image}" alt="${place.title}">
        <h4>${place.title}</h4>
        <button class="btn2">View Details ></button>
      `;

      popularContainer.appendChild(card);

      const btn = card.querySelector(".btn2");
      btn.addEventListener("click", () => showModal(place));
    });
  })
  .catch(error => console.error("Error loading popular places:", error));


function showModal(place) {
  modalImage.src = place.image;
  modalTitle.textContent = place.title;
  modalType.textContent = place.type;
  modalActivities.textContent = place.fun_activities.join(", ");
  modalDescription.textContent = place.description;
  modal.style.display = "block";
}

document.querySelector(".close").addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target.id === "popupModal") {
    modal.style.display = "none";
  }
});


searchBtn.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = placesData.filter(place => place.type.toLowerCase().includes(query));

  searchResultsContainer.innerHTML = "";

  if (filtered.length === 0) {
    searchResultsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }

  filtered.forEach(place => {
    const searchCard = document.createElement("div");
    searchCard.className = "searchCard";

    searchCard.innerHTML = `
    <div class = "searchCardImg">
      <img src="${place.image}" alt="${place.title}">
    </div>
    <div class = "searchCardText" >
      <h4>${place.title}</h4>
      <p><strong>Type:</strong> ${place.type}</p>
      <button class="btn2">View Details ></button>
    <div/>
    `;

    searchResultsContainer.appendChild(searchCard);

    const btn = searchCard.querySelector(".btn2");
    btn.addEventListener("click", () => showModal(place));
  });
});
