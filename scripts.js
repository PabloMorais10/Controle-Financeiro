/** Menu related elements */
const menuButton = document.querySelector(".menu-toggle");//Menu button
const menuDiv = document.querySelector(".links");
const closeButton = document.querySelector(".menu-close");

/** Exibi o menu ao clickar no botao hamburguer */
menuButton.addEventListener("click", function() {
  menuDiv.classList.add("open");
});

/** Fechar o menu ao clickar no botao hamburguer  */
closeButton.addEventListener("click", function(){
  menuDiv.classList.remove("open");
});

/** transacao */

const inputValue = document.querySelector("#value");
const addButton = document.querySelector("#botao-transaction");
const clearButon = document.querySelector("clear")
