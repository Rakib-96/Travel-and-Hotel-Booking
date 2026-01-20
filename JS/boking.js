    const params = new URLSearchParams(window.location.search);
    const hotelName = params.get("hotel");
    if (hotelName) {
      document.getElementById("hotelName").value = hotelName;
    }

    document.getElementById("bookingForm").addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Booking confirmed for " + document.getElementById("hotelName").value );
      window.location.href = "index.html";
    });

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

document.addEventListener("DOMContentLoaded", () => {
  renderAuthNav();
});