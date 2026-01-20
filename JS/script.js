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
    authNav.innerHTML = `
      <button class="auth-btn profile-btn" onclick="openProfileModal()">
        <i class="fas fa-user"></i> ${user.username}
      </button>
      <button class="auth-btn logout-btn" onclick="logoutUser()">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    `;
  } else {
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
  const sortOrder = document.getElementById("sortOrder").value; 
  const hotelList = document.getElementById("hotelList");

  hotelList.innerHTML = "";

  // Filter by location first
  let filteredHotels = hotels.filter(hotel => {
    return hotel.location.toLowerCase().includes(location);
  });

  // Sorting based price
  if (sortOrder === "lowToHigh") {
    filteredHotels.sort((a, b) => a.priceSingle - b.priceSingle);
  } else if (sortOrder === "highToLow") {
    filteredHotels.sort((a, b) => b.priceSingle - a.priceSingle);
  }

  // for empty results
  if (filteredHotels.length === 0) {
    hotelList.innerHTML = "<p>No hotels found.</p>";
    return;
  }

  // Show results
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
          <h5>Deluxe : ৳${hotel.priceDelux} </h5>
          <h5>Rating : ${hotel.rating} ⭐</h5>
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


const popularContainer = document.getElementById("popular_places");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResultsContainer = document.getElementById("search_results");

let placesData = []; 

// Load Places Data
fetch("data/popular_places.json")
  .then(res => res.json())
  .then(data => {
    placesData = data;
    renderPlaces(data, popularContainer); 
  })
  .catch(err => console.error("Error loading places:", err));

function renderPlaces(data, container) {
  container.innerHTML = "";
  data.forEach(place => {
    const card = document.createElement("div");
    card.className = container.id === "popular_places" ? "card" : "searchCard";

    card.innerHTML = `
      <div class="${container.id === "popular_places" ? "" : "searchCardImg"}">
        <img src="${place.image}" alt="${place.title}">
      </div>
      <div class="${container.id === "popular_places" ? "" : "searchCardText"}">
        <h4>${place.title}</h4>
        ${container.id === "search_results" ? `<p><strong>Type:</strong> ${place.type}</p>` : ""}
        <button class="btn2">View Details <i class="fas fa-arrow-right"></i></button>
      </div>
    `;

    card.querySelector(".btn2").onclick = () => showModal(place);
    container.appendChild(card);
  });
}

//  Search Button Logic
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase().trim();
  if (query === "") return;

  const filtered = placesData.filter(place => 
    place.title.toLowerCase().includes(query) || 
    place.type.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    searchResultsContainer.innerHTML = "<p class='no-results'>No places found matching your search.</p>";
  } else {
    renderPlaces(filtered, searchResultsContainer);
    searchResultsContainer.scrollIntoView({ behavior: 'smooth' });
  }
});

//show modal
function showModal(place) {
  const modal = document.getElementById("popupModal");
  
  document.getElementById("modalImage").src = place.image;
  document.getElementById("modalTitle").textContent = place.title;
  document.getElementById("modalType").textContent = place.type;


  document.getElementById("modalActivities").innerHTML = `
    <ol class="modal-ol">
      ${place.fun_activities.map(act => `<li>${act}</li>`).join("")}
    </ol>`;

  // Description 
  document.getElementById("modalDescription").innerHTML = `
    <ul class="modal-ul">
      ${place.description.map(pt => `<li>${pt}</li>`).join("")}
    </ul>`;

  modal.style.display = "flex"; 
}

document.querySelector(".close").onclick = () => {
  document.getElementById("popupModal").style.display = "none";
};

window.onclick = (e) => {
  if (e.target.id === "popupModal") e.target.style.display = "none";
};




let isEditing = false;

function openProfileModal() {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  if (!user) return;

  const modal = document.getElementById("profileModal");
  modal.style.display = "flex";
  loadProfileData(user);
}

function loadProfileData(user) {
  document.getElementById("profilePic").src = (user.profilepicture && user.profilepicture.trim() !== "") ? user.profilepicture : "pictures/dp/default_dp.png";
  document.getElementById("profileName").textContent = user.name || "No Name";
  document.getElementById("profileUsername").textContent = user.username || "NoUsername";

  const infoDiv = document.getElementById("profileInfoDisplay");
  infoDiv.innerHTML = `
    <div><i class="fas fa-envelope"></i><strong>Email :</strong> <span>${user.email || "No Email"}</span></div>
    <div><i class="fas fa-user-graduate"></i><strong>Occupation :</strong> <span>${user.occupation || "N/A"}</span></div>
    <div><i class="fas fa-calendar"></i><strong>Age :</strong> <span>${user.age || "N/A"}</span> years old</div>
  `;
}

// Edit/Save
document.getElementById("editProfileBtn").addEventListener("click", function() {
  let user = JSON.parse(localStorage.getItem("loggedUser"));
  const infoDiv = document.getElementById("profileInfoDisplay");
  isEditing = !isEditing;

  if (isEditing) {
    this.textContent = "Save";
    infoDiv.innerHTML = `
      <div><i class="fas fa-user"></i><input type="text" id="editName" value="${user.name || ''}" placeholder="Name"></div>
      <div><i class="fas fa-envelope"></i><input type="email" id="editEmail" value="${user.email || ''}" placeholder="Email"></div>
      <div><i class="fas fa-user-graduate"></i><input type="text" id="editOcc" value="${user.occupation || ''}" placeholder="Occupation"></div>
      <div><i class="fas fa-calendar"></i><input type="number" id="editAge" value="${user.age || ''}" placeholder="Age"></div>
    `;
  } else {
    user.name = document.getElementById("editName").value;
    user.email = document.getElementById("editEmail").value;
    user.occupation = document.getElementById("editOcc").value;
    user.age = document.getElementById("editAge").value;
    
    localStorage.setItem("loggedUser", JSON.stringify(user));
    this.textContent = "Edit";
    loadProfileData(user);
    renderAuthNav(); 
  }
});
function logoutUser() {
  localStorage.removeItem("loggedUser");
  renderAuthNav(); 
  const modal = document.getElementById("profileModal");
  if (modal) {
    modal.style.display = "none";
  }
}

document.querySelector(".close-profile").onclick = () => document.getElementById("profileModal").style.display = "none";
document.getElementById("closeProfileBtn").onclick = () => document.getElementById("profileModal").style.display = "none";