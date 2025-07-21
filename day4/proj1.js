// Highlight active link
document.querySelectorAll(".menu li a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".menu li").forEach(li => li.classList.remove("active"));
    link.parentElement.classList.add("active");
    document.getElementById("check").checked = false; // close sidebar
  });
});
