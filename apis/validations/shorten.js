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
  let errors = {};

  data.originalUrl = !isEmpty(data.originalUrl) ? data.originalUrl : "";
  data.customCode = !isEmpty(data.customCode) ? data.customCode : "";
  data.expiration = !isEmpty(data.expiration) ? data.expiration : "";

  if (Validator.isEmpty(data.originalUrl)) {
    errors.originalUrl = "Original URL field is required";
  }

  if (!Validator.isURL(data.originalUrl)) {
    errors.originalUrl = "Invalid URL format";
  }

  if (
    !Validator.isEmpty(data.customCode) &&
    !Validator.isLength(data.customCode, { min: 1, max: 10 })
  ) {
    errors.customCode = "Custom code must be between 1 and 10 characters";
  }

  if (
    !Validator.isEmpty(data.expiration) &&
    !Validator.isAfter(data.expiration)
  ) {
    errors.expiration = "Expiration date must be greater than today";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

export default validateShortenInput;
