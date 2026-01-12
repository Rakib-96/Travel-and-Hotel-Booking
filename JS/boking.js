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
