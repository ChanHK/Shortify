import Validator from "validator";

function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

function validateInput(data) {
  let message = "";

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) message += "Email field is required.";
  else if (!Validator.isEmail(data.email)) message += "Email is invalid.";

  if (Validator.isEmpty(data.password)) {
    message += " Password field is required.";
  } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    message += " Password must be at least 6, maximum 30 characters.";
  }

  return {
    message,
    isValid: isEmpty(message),
  };
}

export default validateInput;
