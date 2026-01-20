function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");


  if (name === "" || email === "" || username === "" || password === "") {
    message.textContent = "All fields are required!";
    message.style.color = "red";
    return;
  }

  if (!email.includes("@")) {
    message.textContent = "Please enter a valid email address.";
    message.style.color = "red";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.username === username)) {
    message.textContent = "Username already exists!";
    message.style.color = "red";
    return;
  }

  // Add the new user
  users.push({
    id: Date.now(),
    name: name,
    email: email,
    username: username,
    password: password,
    role: "user"
  });

  localStorage.setItem("users", JSON.stringify(users));

  message.textContent = "Registration successful! Redirecting...";
  message.style.color = "green";

setTimeout(() => {
window.location.href = "login.html";
}, 1500);
}

