import Validator from "validator";

function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

function validateShortenInput(data) {
  let message = "";

  data.originalUrl = !isEmpty(data.originalUrl) ? data.originalUrl : "";
  data.customCode = !isEmpty(data.customCode) ? data.customCode : "";
  data.expiration = !isEmpty(data.expiration) ? data.expiration : "";

  if (Validator.isEmpty(data.originalUrl)) {
    message += " Original URL field is required.";
  } else if (!Validator.isURL(data.originalUrl)) {
    message += " Invalid URL format.";
  }

  if (
    !Validator.isEmpty(data.customCode) &&
    !Validator.isLength(data.customCode, { min: 1, max: 10 })
  ) {
    message += " Custom code must be between 1 and 10 characters.";
  }

  if (
    !Validator.isEmpty(data.expiration) &&
    !Validator.isAfter(data.expiration)
  ) {
    message += " Expiration date must be greater than today.";
  }

  return {
    message,
    isValid: isEmpty(message),
  };
}

export default validateShortenInput;
