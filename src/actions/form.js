export function update(value, formName, fieldName) {
  return {
    type: "FORM_UPDATE_VALUE",
    value,
    formName,
    fieldName
  };
}

export function reset(formName) {
  return {
    type: "FORM_RESET",
    formName
  };
}