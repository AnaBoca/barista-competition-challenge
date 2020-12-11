import '../sass/styles.scss';
import '../images/favicon.ico';
import '../videos/latte-art.mp4';

const btnRegister = document.getElementsByClassName('btn-register')[0];

btnRegister.addEventListener('click', (event) => {
  event.preventDefault();
  const form = document.querySelector('form');
  const formValues = serializeForm(form);
  fakeFormSubmission(formValues)
    .then(() => {
      console.log('success');
      resetFormErrors();
    })
    .catch((errors) => {
      resetFormErrors();
      displayErrors(errors);
    });
});

function serializeForm(form) {
  const formValues = Object.values(form)
    .reduce((obj, field) => {
      if(field.name) {
        obj[field.name] = field.value;
      }
      return obj;
    }, {});
  return formValues;
}

function fakeFormSubmission(formData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const validation = validateFormData(formData);
      if (validation.isValid) {
        resolve();
      } else {
        reject(validation.errors);
      }
    }, 1000);
  });
}

function validateFormData(data) {
  const errors = {name: [], email: [], phone: []};
  const validationObj = {isValid: true, errors: errors};
  const letters = /^[a-zA-Z ]*$/;
  // const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (data.name === "") {
    errors.name.push('Name cannot be blank.');
    validationObj.isValid = false;
  }
  if (data.name > 100) {
    errors.name.push('Name is too long.');
    validationObj.isValid = false;
  }
  if (!data.name.match(letters)) {
    errors.name.push('Name must be letters only.');
    validationObj.isValid = false;
  }

  return validationObj;
}

function displayErrors(errors) {
  Object.entries(errors).forEach((error) => {
    console.log(error);
    const key = error[0];
    const valErr = error[1];
    const alertEl = document.getElementById('alert-' + key);

    if (valErr.length > 0) {
      alertEl.classList.remove('d-none');
    }

  });
}

function resetFormErrors() {
  const alerts = document.querySelectorAll('.alert');

  alerts.forEach((alert) => {
    alert.classList.add('d-none');
  });
}


