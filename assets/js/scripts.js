
/**
 *
 * Menu animation.
 *
 */

/**
 * Menu related elements
 */
const menuButton = document.querySelector(".menu-icon"); // Menu button.
const menuDiv = document.querySelector(".menu"); // Menu nav tag.
const closeButton = document.querySelector(".close-menu"); // Close button.

/**
 * Menu related events listeners
 */

/** Displays menu when clicking the hamburger button by adding the 'open' class. */
menuButton.addEventListener("click", function () {
  menuDiv.classList.add("open");
});

/** Hides menu when clicking the close button by removing the 'open' class. */
closeButton.addEventListener("click", function () {
  menuDiv.classList.remove("open");
});


