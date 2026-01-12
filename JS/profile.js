document.addEventListener("DOMContentLoaded", () => {
  let user = JSON.parse(localStorage.getItem("loggedUser"));

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const profilePic = document.getElementById("profilePic");
  const nameEl = document.getElementById("name");
  const usernameEl = document.getElementById("username");
  const profileInfoDiv = document.querySelector(".profile-info");
  const editBtn = document.getElementById("editProfileBtn");

  // Function to load profile info in view mode
  function loadProfile() {
    profilePic.src = (user.profilepicture && user.profilepicture.trim() !== "")? user.profilepicture : "pictures/dp/default_dp.png";

    nameEl.textContent = user.name || "No Name";
    usernameEl.textContent = user.username || "NoUsername";

    profileInfoDiv.innerHTML = `
      <div>
         <i class="fas fa-envelope"></i><strong>Email :</strong>
        <span id="emailView">${user.email || "No Email"}</span>
      </div>
      <div>
        <i class="fas fa-user-graduate"></i><strong>Occupation :</strong> 
        <span id="occupationView">${user.occupation || "N/A"}</span>
      </div>
      <div>
        <i class="fas fa-calendar"></i><strong>Age :</strong> 
        <span id="ageView">${user.age || "N/A"}</span> years old
      </div>
    `;
  }

  loadProfile();

  // edit mode
  let editing = false;
  editBtn.addEventListener("click", () => {
    editing = !editing;

    if (editing) {
      // Replace text with input fields
      profileInfoDiv.innerHTML = `
        <div>
           <i class="fas fa-user"></i><strong>Name :</strong>
          <input type="text" id="nameInput" value="${user.name}" placeholder="Name" />
        </div>
        <div>
          <i class="fas fa-envelope"></i><strong>Email :</strong> 
          <input type="email" id="emailInput" value="${user.email}" placeholder="Email" />
        </div>
        <div>
          <i class="fas fa-user-graduate"></i><strong>Occupation :</strong>
          <input type="text" id="occupationInput" value="${user.occupation}" placeholder="Occupation" />
        </div>
        <div>
          <i class="fas fa-calendar"></i><strong>Age :</strong> 
          <input type="number" id="ageInput" value="${user.age}" placeholder="Age" />
        </div>
      `;
      editBtn.textContent = "Save";
    } else {
      // Save updated values
      user.name = document.getElementById("nameInput").value;
      user.email = document.getElementById("emailInput").value;
      user.occupation = document.getElementById("occupationInput").value;
      user.age = document.getElementById("ageInput").value;
      localStorage.setItem("loggedUser", JSON.stringify(user));

      loadProfile();
      editBtn.textContent = "Edit";
    }
  });
});

function logout() {
  localStorage.removeItem("loggedUser");
  window.location.href = "index.html";
}
