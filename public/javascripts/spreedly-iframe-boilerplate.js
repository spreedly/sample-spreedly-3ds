/**
 * The original implementation of these functions can be found in https://github.com/spreedly/sample-payment-frame/blob/master/index.html#L116-L151
 */

/**
    * Note: See sample app for example implementation.
    * @see {@link https://docs.spreedly.com/reference/iframe/v1/#errors|Errors}
    */
function onErrorrsFn(errors) {
  var messageEl = document.getElementById('errors');
  var errorBorder = "1px solid red";
  for (var i = 0; i < errors.length; i++) {
    var error = errors[i];
    if (error["attribute"]) {
      var masterFormElement = document.getElementById(error["attribute"]);
      if (masterFormElement) {
        masterFormElement.style.border = errorBorder
      } else {
        Spreedly.setStyle(error["attribute"], "border: " + errorBorder + ";");
      }
    }
    messageEl.innerHTML += error["message"] + "<br/>";
  }
}


/**
* Note: See sample app for example implementation.
* @see {@link https://docs.spreedly.com/reference/iframe/v1/#ready|Ready}
*/
function onReadyFn(frame) {
  Spreedly.setFieldType('number', 'text');
  Spreedly.setFieldType('cvv', 'text');

  // Spreedly.setNumberFormat('maskedFormat');
  Spreedly.setStyle('number', 'width: 67%; border-radius: 3px; border: 1px solid #ccc; padding: .65em .5em; font-size: 91%;');
  Spreedly.setStyle('cvv', 'width: 30%; border-radius: 3px; border: 1px solid #ccc; padding: .65em .5em; font-size: 91%;');

  Spreedly.setValue('number', '5555555555554444')
  Spreedly.setValue('cvv', '123')
};


/**
 * Note: See sample app for example implementation.
 * @see {@link https://docs.spreedly.com/reference/iframe/v1/#fieldevent|FieldEvent}
 */
function onFieldEventFn(name, event, activeElement, inputData) {
  if (event == 'input') {
    if (inputData["validCvv"]) {
      Spreedly.setStyle('cvv', "background-color: #CDFFE6;")
    } else {
      Spreedly.setStyle('cvv', "background-color: #FFFFFF;")
    }
    if (inputData["validNumber"]) {
      Spreedly.setStyle('number', "background-color: #CDFFE6;")
    } else {
      Spreedly.setStyle('number', "background-color: #FFFFFF;")
    }
  }
}



/**
* Called when you have collected purchase data.
* See our sample app at https://github.com/spreedly/sample-payment-frame/blob/ea49da8c36095fa43ada17c4174d8a884bc5ddd4/index.html#L13
*/
function submitPaymentForm() {
  var normalBorder = "1px solid #ccc";

  // These are the fields whose values we want to transfer *from* the
  // master form *to* the payment frame form. Add the following if
  // you're displaying the address:
  // ['address1', 'address2', 'city', 'state', 'zip', 'country']
  var paymentMethodFields = ['first_name', 'last_name', 'month', 'year', 'address1', 'address2', 'city', 'state', 'zip', 'country']
  options = {};
  for (var i = 0; i < paymentMethodFields.length; i++) {
    var field = paymentMethodFields[i];

    // Reset existing styles (to clear previous errors)
    var fieldEl = document.getElementById(field);
    fieldEl.style.border = normalBorder;

    // add value to options
    options[field] = fieldEl.value
  }

  // Reset frame styles
  Spreedly.setStyle('number', "border: " + normalBorder + ";");
  Spreedly.setStyle('cvv', "border: " + normalBorder + ";");

  // Reset previous messages
  document.getElementById('errors').innerHTML = "";
  document.getElementById('message').innerHTML = "";

  // Tokenize!
  Spreedly.tokenizeCreditCard(options);
}

