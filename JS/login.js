function login(){
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  Promise.all([
    fetch("data/users.json").then(res => res.json()),
    JSON.parse(localStorage.getItem("users")) || []
  ]).then(([defaultUsers, localUsers]) => {

    const allUsers = [...defaultUsers, ...localUsers];

    const user = allUsers.find(
      u => u.username === username && u.password === password
    );

    if(user){
      localStorage.setItem("loggedUser", JSON.stringify(user));
      window.location.href = "index.html";
    } else {
      error.textContent = "Invalid username or password";
    }
  });
}
