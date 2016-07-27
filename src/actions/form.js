export function update(value, fieldName, formName) {
  return {
    type: "FORM_INPUT_CHANGE",
    value,
    fieldName,
    formName
  };
}

export function inputError(errors, fieldName, formName){
  return {
    type: 'FORM_INPUT_ERROR',
    errors,
    fieldName,
    formName
  }
}

export function formError(errorMessage, formName){
  return {
    type: 'FORM_ERROR',
    errorMessage,
    formName
  }
}

export function reset(formName) {
  return {
    type: "FORM_RESET",
    formName
  };
}