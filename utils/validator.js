const registerValidator = (username, email, password, confirmPassword) => {
  const errors = {};
  if (!username.trim()) {
    errors.username = "Username can't be empty";
  }
  if (!email.trim()) {
    errors.email = "Email can't be empty";
  } else if (
    !email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  ) {
    errors.email = "Please enter a valid email address";
  }
  if (password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }
  if (confirmPassword.trim().length < 6) {
    errors.confirmPassword =
      "Confirm Password must be at least 6 characters long";
  }
  if (password !== confirmPassword) {
    errors.unmatchedPassword = "Password did not match";
  }
  return {
    isValid: Object.keys(errors).length < 1,
    errors,
  };
};
const loginValidator = (email, password) => {
  const errors = {};
  if (!email.trim()) {
    errors.email = "Email can't be empty";
  } else if (
    !email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  ) {
    errors.email = "Please enter a valid email address";
  }
  if (password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }
  return {
    isValid: Object.keys(errors).length < 1,
    errors,
  };
};

const taskValidator = (title, description) => {
  const errors = {};
  if (!title.trim()) {
    errors.title = "Title can't be empty'";
  }
  if (!description.trim()) {
    errors.description = "Title can't be empty'";
  }
  return {
    isValid: Object.keys(errors).length < 1,
    errors,
  };
};

module.exports = {
  registerValidator,
  loginValidator,
  taskValidator,
};
