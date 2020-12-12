import '../sass/styles.scss';
import 'bootstrap/dist/js/bootstrap.min.js';
import '../videos/latte-art.mp4';
import '../images/favicon.ico';
import '../images/logo.png';
import '../images/nav-background.png';

const btnRegister = document.getElementsByClassName('btn-register')[0];

btnRegister.addEventListener('click', (event) => {
  event.preventDefault();
  const form = document.querySelector('form');
  const formValues = serializeForm(form);
  //Client-side validation
  const clientSideErrs = validateFormData(formValues);
  resetFormErrors();
  if (clientSideErrs.isValid) {
    fakeFormSubmission(formValues)
      .then(() => {
        form.parentNode.innerHTML = `
          <div class='alert alert-light' id='success-alert'>
            <h2>Registration Success!</h2>
            <p class='mb-0'>You are on your way to becoming earning the title of Top Barista!</p>
          </div>`;
      })
      .catch((errors) => {
        displayErrors(errors);
      });
  } else {
    displayErrors(clientSideErrs.errors);
  }
});

/**
 * Searches for form inputs that have name attributes
 * and for each element, a property is entered into a
 * dictionary object where a key is the name of the input
 * element and the value is the value of the input element
 * @param form DOM form element
 */
function serializeForm(form) {
  console.log({ form });
  console.log(Object.values(form));
  const formValues = Object.values(form).reduce((obj, field) => {
    if (field.name) {
      obj[field.name] = field.value;
    }
    return obj;
  }, {});
  return formValues;
}

/**
 * Emulates an HTTP POST request to the server
 * and the same validation rules are run in the
 * simulated 'backend' in case the client-side
 * is tampered with
 * @param formData serialized form values
 */
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
  const errors = { name: [], email: [], phone: [] };
  const validationObj = { isValid: true, errors: errors };
  const letterFormat = /^[a-zA-Z ]*$/;
  const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const phoneFormat = /^\d{3}-\d{3}-\d{4}$/;

  if (data.name === '') {
    errors.name.push('Name cannot be blank.');
    validationObj.isValid = false;
  }
  if (data.name.length > 100) {
    errors.name.push('Name is too long.');
    validationObj.isValid = false;
  }
  if (!data.name.match(letterFormat)) {
    errors.name.push('Name must be letters only.');
    validationObj.isValid = false;
  }

  if (data.email === '') {
    errors.email.push('Email cannot be blank.');
    validationObj.isValid = false;
  } else if (!data.email.match(emailFormat)) {
    errors.email.push('Email entered is invalid.');
    validationObj.isValid = false;
  }

  if (data.phone === '') {
    errors.phone.push('Phone cannot be blank.');
    validationObj.isValid = false;
  } else if (!data.phone.match(phoneFormat)) {
    errors.phone.push('Phone entered is invalid');
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
    const ulEl = alertEl.querySelector('ul');

    if (valErr.length > 0) {
      alertEl.classList.remove('d-none');
      valErr.forEach((message) => {
        const liEl = document.createElement('li');
        liEl.textContent = message;
        ulEl.append(liEl);
      });
    }
  });
}

function resetFormErrors() {
  const alerts = document.querySelectorAll('.alert');

  alerts.forEach((alert) => {
    alert.classList.add('d-none');
    alert.querySelector('ul').innerHTML = '';
  });
}
