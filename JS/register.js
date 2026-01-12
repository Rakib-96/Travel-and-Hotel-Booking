function register(){
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  if(username === "" || password === ""){
    message.textContent = "All fields are required";
    message.style.color = "red";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if username exists
  if(users.some(u => u.username === username)){
    message.textContent = "Username already exists";
    message.style.color = "red";
    return;
  }

  users.push({
    id: Date.now(),
    username,
    password,
    role: "user"
  });

  localStorage.setItem("users", JSON.stringify(users));

  message.textContent = "Registration successful! Please login.";
  message.style.color = "green";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}
