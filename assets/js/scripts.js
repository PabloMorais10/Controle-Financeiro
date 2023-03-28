


/**
 * Menu
 */
const menuButton = document.querySelector(".menu-icon"); 
const menuDiv = document.querySelector(".menu"); 
const closeButton = document.querySelector(".close-menu"); 



/** Abrir o menu ao clickar no hamburguer */
menuButton.addEventListener("click", function () {
  menuDiv.classList.add("open");
});

/** Fechar o meno ao apertar no X */
closeButton.addEventListener("click", function () {
  menuDiv.classList.remove("open");
});


const inputValue = document.querySelector("#value");
const addButton = document.querySelector("#add");
const clearButton = document.querySelector("#clear");
const modalDiv = document.querySelector("#modal");
const cancelClearButton = document.querySelector("button.cancel");
const confirmClearButton = document.querySelector("button.confirm");

let transactionsStorage = JSON.parse(localStorage.getItem("transactions"));

/**
 * Converte um valor numerico para BRL.
 * @param {*} num
 * @returns {string}
 */
const formatValue = function (num) {

  if (typeof num == "number") {
    num = num.toFixed(2);
  } else {
    num = String(num);
  }

  // Verifica se o valor é uma representação negativa
  let isNegative = false;
  if (num.startsWith("-")) {
    isNegative = true;
    num = num.substring(1); 
  }

   // alteração de apresentação  9999.99 para 9.999,00
   let formatedValue = num.replace(/\D/g, "");
   formatedValue = (formatedValue / 100).toFixed(2).replace(".", ",");
   formatedValue = formatedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
 
   
   // Retornar o valor formatado
   return formatedValue;
 };

 /**
 * Normaliza uma string para um numero float
 * @param {string} str
 * @returns {number}
 */

 const stringToNumber = function (str) {
  // Apenas numeros
  const value = str.replace(/\D/g, "");

  
   const number = parseInt(value) / 100;
   return number;
 };
 
 /**
 * receber um texto tipo input e aplicar o formatValue
 * @param {object} inputObject
 */
  const valueMask = function (inputObject) {
  inputObject.value = formatValue(inputObject.value);
};
/**
 * Remove classes and contents from itens related with error alerts.
 */
const clearErrors = function () {
  // Get all elements with error class.
  let errors = document.querySelectorAll(".error");
  errors.forEach(function (element) {
    element.innerHTML = null; // Remove content
  });

  // Get all elements with input-error class
  let inputErrors = document.querySelectorAll(".input-error");
  inputErrors.forEach(function (element) {
    element.classList.remove("input-error"); // Remove classes`
  });
};


/**
 * remove valores de entrada
 */
const clearInputs = function () {
  let inputs = document.querySelectorAll(".input-data");
  inputs.forEach(function (input) {
    input.value = null;
  });
};

/**
 * Executa todas as funções claras definidas acima e limpe o conteúdo localStorage.
 */
const clearAll = function () {
  clearErrors();
  clearInputs();
  localStorage.clear();
};

/**
 * Verifique se os valores nas entradas estão OK.
 * @returns {object}
 */
const validateForm = function () {

  let inputs = document.querySelectorAll(".input-data"); 
  let ok = true; 
  let data = {}  
  let errorMsg = {  
    "operation": "Escolha uma operação válida",
    "product": "Preencha o nome da mercadoria",
    "value": "Informe o valor da operação",
  };

  clearErrors();

  // 
  inputs.forEach(function (input) {
    if (!input.value){
      ok = false;
      input.classList.add("input-error");
      input.parentElement.querySelector(".error").innerHTML = errorMsg[input.name];
    } else if (input.name == "value") {
      data[input.name] = stringToNumber(input.value);
    } else {
      data[input.name] = input.value;
    }
  });

  if (ok) {
    return {"isValid": true, "data": data};
  }

  return  {"isValid": false, "data": data};
};

const populateTable = function () {
  let table = document.querySelector("tbody"); 
  let totalSpan = document.querySelector(".value"); 
  let resultSpan = document.querySelector(".result"); 

  let sum = Number();
  let result = null;

  transactionsStorage = JSON.parse(localStorage.getItem("transactions"));

   // Se tiver dados em localStorage
   if (transactionsStorage) {
    //  Limpar todos os dados antigos expostos
    table.innerHTML = null;
    totalSpan.innerHTML = null;
    resultSpan.innerHTML = null;

    transactionsStorage.forEach(function (transaction, index) {
      if (transaction.operation == "+") {
        sum += Number(Number(transaction.value).toFixed(2));
      } else if (transaction.operation == "-") {
        sum -= Number(Number(transaction.value).toFixed(2));
      }
      table.innerHTML += `<tr style="color: ${
        transaction.operation == "+" ? "#005700" : "#d10000"
      }"><td>
          ${transaction.operation}
        </td><td>
          ${transaction.product}
        </td><td>R$ 
          ${formatValue(transaction.value)}
          <a href="#" id="${index}" class="remove" onclick="removeItem(${index})">&times;</a>
        </td></tr>`;
    });

     // Resultado final
     sum = Number(sum.toFixed(2)); 

     if (sum < 0) {
       result = "[Prejuízo]";
     } else if (sum > 0) {
       result = "[Lucro]";
     } else {
       result = "";
     }

        // Aplica o resultado final
    totalSpan.innerHTML = `R$ ${formatValue(sum)}`;
    resultSpan.innerHTML = result;
  }
  // Caso contrário, sem dados no localStorage
  else {
    // Limpar tabela e informar mensagem
    table.innerHTML =
      "<tr><td></td><td>Nenhuma transação cadastrada</td><td></td></tr>";
    totalSpan.innerHTML = null;
    resultSpan.innerHTML = null;
  }
};

const registerOperation = function () {
  // Se tiver dados validos

  let form = validateForm();

  if (form.isValid) {

    // Se existir entrada de transação no localStorage, adicione esta
    if (transactionsStorage) {
      transactionsStorage.push(form.data);
      localStorage.setItem("transactions", JSON.stringify(transactionsStorage));
    } else {
      
      localStorage.setItem("transactions", JSON.stringify([form.data]));
    }
    // Limpe erros e insira dados para receber um novo.
    clearErrors();
    clearInputs();
  }

  // Reconstruir tabela 
  populateTable();
};

/**
 * 
 * atualizar localStorage
 * @param {number, string} index
 */
const removeItem = function (index) {

 
  if (transactionsStorage) {
    transactionsStorage.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactionsStorage));
  }

 
  if (transactionsStorage.length === 0) {
    localStorage.clear();
  }

  // Reconstruir tabela
  populateTable();
};





/** Máscara e cursor de texto em inputValue sempre no final */
inputValue.addEventListener("input", function () {
  valueMask(this);
});
inputValue.addEventListener("click", function () {
  this.selectionStart = this.selectionEnd = this.value.length;
});

/** Add nova transacao */
addButton.addEventListener("click", registerOperation);

/** Cancele a operação de limpeza de todos os dados e feche o modal sem fazer nada*/
clearButton.addEventListener("click", function () {
  menuDiv.classList.remove("open");
  modalDiv.classList.add("active");
});

/** Cancelar limpar todos os dados e fechar moda */
cancelClearButton.addEventListener("click", function () {
  modalDiv.classList.remove("active");
});

/** Confirme se todos os dados serão limpos */
confirmClearButton.addEventListener("click", function () {
  modalDiv.classList.remove("active");
  clearAll();
  populateTable();
});


populateTable();