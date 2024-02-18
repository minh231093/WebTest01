// document.addEventListener("DOMContentLoaded", function () {
//   const navbar = document.querySelector(".navbar");
//   const line = document.querySelector(".line");

//   navbar.addEventListener("mouseover", function (event) {
//     if (event.target.tagName === "A") {
//       const index = Array.from(navbar.children).indexOf(event.target) - 1;
//       const width = 100 / (navbar.children.length - 1);
//       line.style.left = `${width * index}%`;
//     }
//   });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("searchBtn").addEventListener("click", function () {
//     var searchInput = document.getElementById("searchInput");
//     searchInput.classList.toggle("active");
//     if (searchInput.classList.contains("active")) {
//       searchInput.focus();
//     }
//   });
// });

let typed = new Typed(".text", {
  strings: ["Bán bánh", "Bán sách", "Bách hóa", " Linh tinh"],
  typeSpeed: 100,
  backSpeed: 100,
  loop: true,
});

let menu = document.querySelector("#menu-bar");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
  menu.classList.toggle("fa-times");
  navbar.classList.toggle("active");
};

window.onscroll = () => {
  menu.classList.remove("fa-times");
  navbar.classList.remove("active");

  if (window.scrollY > 90) {
    document.querySelector("#scroll-top").classList.add("active");
  } else {
    document.querySelector("#scroll-top").classList.remove("active");
  }
};

function loader() {
  document.querySelector(".loader-container").classList.add("fade-out");
}

// function fadeOut() {
//   setInterval(loader, 3000);
// }

// window.onload = fadeOut();

window.addEventListener("DOMContentLoaded", (event) => {
  // Navbar shrink function
  window.addEventListener("scroll", function () {
    let header = document.getElementById("header");
    let navbar = document.querySelectorAll(".navbar a");
    let scrollPosition = window.scrollY;

    // Thay đổi màu nền của header khi cuộn xuống một khoảng cụ thể
    if (scrollPosition > 100) {
      header.classList.add("scrolled");
      navbar.forEach((link) => {
        link.classList.add("scrolled");
      });
    } else {
      header.classList.remove("scrolled");
      navbar.forEach((link) => {
        link.classList.remove("scrolled");
      });
    }
  });
});

const tabs = document.querySelectorAll(".tab-btn");

tabs.forEach((tab, index) => {
  tab.addEventListener("mouseenter", (e) => {
    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    tab.classList.add("active");

    var line = document.querySelector(".line");
    line.style.width = e.target.offsetWidth + "px";
    line.style.left = e.target.offsetLeft + "px";
  });
});

const carousel = document.querySelector(".carousel");

const firstImg = carousel.querySelectorAll("img")[0];
const arrowIcons = document.querySelectorAll(".wrapper i");
let isDragStart = false;
let prevPageX;
let prevScrollLeft;
let positionDiff;

const showHideIcons = () => {
  let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
  arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
  arrowIcons[1].style.display =
    carousel.scrollLeft == scrollWidth ? "none" : "block";
};

arrowIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    // let firstImgWidth = firstImg.clientWidth + 14;
    const scrollAmount = carousel.clientWidth * 1;
    // carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
    carousel.scrollLeft += icon.id == "left" ? -scrollAmount : scrollAmount;
    setTimeout(() => showHideIcons(), 60);
  });
});

const dragStart = (e) => {
  isDragStart = true;
  prevPageX = e.pageX || e.touches[0].pageX;
  prevScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragStart) return;
  e.preventDefault();
  carousel.classList.add("dragging");
  const currentX = e.pageX || e.touches[0].pageX;
  positionDiff = prevPageX - currentX;
  carousel.scrollLeft = prevScrollLeft + positionDiff * 3;
  showHideIcons();
};

const dragStop = () => {
  isDragStart = false;
  carousel.classList.remove("dragging");

  const currentX = e.pageX || e.changedTouches[0].pageX;
  const targetIndex = Math.round(
    (currentX - carousel.getBoundingClientRect().left) / carousel.clientWidth
  );
  const scrollAmount = carousel.clientWidth * targetIndex;
  carousel.scrollLeft = scrollAmount;
  showHideIcons();
};

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1) {
    dragging(e);
  }
});

carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);
