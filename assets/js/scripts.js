/** Menu related elements */
const menuButton = document.querySelector('.menu-toggle') //Menu button
const menuDiv = document.querySelector('.links')
const closeButton = document.querySelector('.menu-close')

/** Exibi o menu ao clickar no botao hamburguer */
menuButton.addEventListener('click', function () {
  menuDiv.classList.add('open')
})

/** Fechar o menu ao clickar no botao hamburguer  */
closeButton.addEventListener('click', function () {
  menuDiv.classList.remove('open')
})

/** transacao */

const inputValue = document.querySelector('#value')
const addButton = document.querySelector('#botao-transaction')
const clearButon = document.querySelector('clear')
const modalDiv = document.querySelector('#modal')
const cancelClearButton = document.querySelector('button.cancel')
const confirmClearButton = document.querySelector('button.confirm')

let transactionStorage = JSON.parse(localStorage.getItem('transactions'))

/**Transforma valor numerico em Real */

const formatValue = function (num) {
  if (typeof num == 'number') {
    num = num.toFixed(2)
  } else {
    num = String(num)
  }

  //Verifica se o valor e negativo

  let isNegative = false
  if (num.startsWith('-')) {
    isNegative = true
    num = num.substring(1)
  }

  // apresentacao do numero
  let formatedValue = num.replace(/\D/g, '')
  formatedValue = (formatedValue / 100).toFixed(2).replace('.', ',')
  formatedValue = formatedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  if (isNegative) {
    formatedValue = '-' + formatedValue
  }

  return formatedValue
}

/**
 * Normalize a string (with two decimal precision representation) to a float number
 * @param {string} str
 * @returns {number}
 */

const stringToNumber = function (str) {
  // Numbers only (Integer representation)
  const value = str.replace(/\D/g, '')

  // Convert to number with two decimal precision
  const number = parseInt(value) / 100
  return number
}

/**
 * Receive an input type text and apply formatValue() on it own value
 * @param {object} inputObject
 */

const valueMask = function (inputObject) {
  inputObject.value = formatValue(inputObject.value)
}

/**
 * Remove classes and contents from itens related with error alerts.
 */
const clearErrors = function () {
  let errors = document.querySelectorAll('error')
  errors.forEach(function (element) {
    element.innerHTML = null
  })

  // Get all elements with input-error class
  let inputErrors = document.querySelectorAll('.input-error')
  inputErrors.forEach(function (element) {
    element.classList.remove('input-error')
  })
}

/**
 * Remove input values
 */

const clearInputs = function () {
  let inputs = document.querySelectorAll('.form-transaction')
  inputs.forEach(function (input) {
    input.value = null
  })
}

/** Limpa o conteudo local Storage */

const clearAll = function () {
  clearErrors()
  clearInputs()
  localStorage.clear()
}
/**
 * verifica os valores
 * @return {object}
 */
const validateForm = function () {
  let inputs = document.querySelectorAll('.form-transaction')
  let ok = true
  let data = {}
  let errorMsg = {
    operation: 'Escolha uma operação válida',
    product: 'Preencha o nome da mercadoria',
    value: 'Informe o valor da operação'
  }
  clearErrors()

  //
  inputs.forEach(function (input) {
    if (!input.value) {
      ok = false
      input.classList.add('input-error')
      input.parentElement.querySelector('.error').innerHTML = errorMsg[input.name]
    } else if (input.name == 'value') {
      data[input.name] = stringToNumber(input.value)
    } else {
      data[input.name] = input.value
    }
  })

  if (ok) {
    return { 'isValid': true, 'data': data }
  }
  
  return {'isValid': false, 'data': data}
}

/** 
 * Get necessary Table Tags, localStorage values and construct
 * the transactions table and results with this data.
*/

const populateTable = function() {
  let table = document.querySelector('.tbody')
  let totalSpan = document.querySelector('.value')
  let resultSpan = document.querySelector('.result')

  let sum = Number()
  let result = null

  transactionsStorage = JSON.parse(localStorage.getItem("transactions"))

  // If has data in localStorage
  if (transactionsStorage) {
    // Clear all old exposed data
    table.innerHTML = null
    totalSpan.innerHTML = null
    resultSpan.innerHTML = null

     // Each line of transactions
     transactionStorage.forEach(function (transaction, index){
      if (transaction.operation == '+') {
        sum += Number(Number(transaction.value).toFixed(2))
      } else if (transaction.operation == '-') {
        sum -= Number(Number(transaction.value).toFixed(2))
      }table.innerHTML += `<tr style="color: ${
        transaction.operation == "+" ? "#005700" : "#d10000"
      }"><td>
          ${transaction.operation}
        </td><td>
          ${transaction.product}
        </td><td>R$ 
          ${formatValue(transaction.value)}
          <a href="#" id="${index}" class="remove" onclick="removeItem(${index})">&times;</a>
        </td></tr>`
     })

     // Check total to make final result
     sum = Number(sum.toFixed(2))

     if (sum < 0) {
      result = '[Prejuizo]'
     } else if (sum > 0) {
      result = '[Lucro]'
     } else {
      result = ''
     }
     // Apply total and final result in HTML
      totalSpan.innerHTML = `R$ ${formatValue(sum)}`;
      resultSpan.innerHTML = result;
    }
    // Else, without data in localStorage
    else {
       // Clear table and inform: No transaction data
       table.innerHTML = 
       "<tr><td></td><td>Nenhuma transação cadastrada</td><td></td></tr>"
       totalSpan.innerHTML = null
       resultSpan.innerHTML = null
    }

}



