import React,  { useState }  from 'react';
import { 
    required, 
    match, 
    list,
    hasError,
    validateMany,
    anyErrors 
} from './formValidation';

const Error = () => (
    <div className="error">An error occurred during save.</div>
  );

export const CustomerForm = ({ 
    firstName, 
    lastName,
    phoneNumber,
    onSave
}) => {
    //const customer = { firstName };
    const [customer, setCustomer] = useState({
        firstName,
        lastName,
        phoneNumber
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(false);
    const [submitting, setSubmitting]=useState(false);
    const handleChangeField = ({ target }) =>
    setCustomer(customer => ({
    ...customer,
    [target.name]: target.value
  }));


    const renderError = (fieldName) => {
  if (hasError( validationErrors,fieldName)) {
    return (
      <span className="error">
       {validationErrors[fieldName]}
      </span>
    );
  }
};

    const validators = {
        firstName: required('First name is required'),
        lastName: required('Last name is required'),
        phoneNumber: list(
            required('Phone number is required'),
            match(
              /^[0-9+()\- ]*$/,
              'Only numbers, spaces and these symbols are allowed: ( ) + -'
            )
          )
         };
/*   const handleBlur = ({ target }) => {

    const result = validators[target.name](target.value);
    setValidationErrors({
      ...validationErrors,
      [target.name]: result
    });
  }; */

  const handleBlur = ({ target }) => {
    const result = validateMany(validators, {
      [target.name] : target.value
    });
    setValidationErrors({ ...validationErrors, ...result});
  }


  const handleSubmit = async e => {
    e.preventDefault();
   // onSubmit(customer);
   const validationResult = validateMany(validators,customer);
    if (!anyErrors(validationResult)) {
    // console.log('entra');
    setSubmitting(true);
     const result = await window.fetch('/customers', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });
      setSubmitting(false);
      if (result.ok) {
          const customerWithId = await result.json();
          onSave(customerWithId);
      }else if (result.status === 422) {
        const response = await result.json();
        setValidationErrors(response.errors);
      }
     else{
          setError(true);
      }
   }else{
    setValidationErrors(validationResult);
   } 



  };
    return (
        <div>
        <form id="customer" onSubmit={handleSubmit} >
        { error ? <Error /> : null }
           <label htmlFor="firstName">First name</label>
            <input 
                id="firstName"
                type="text" 
                name="firstName"
                value={firstName}
                onChange={handleChangeField}
                onBlur={handleBlur}
                />
                {renderError('firstName')}
            <label htmlFor="lastName">Last name</label>
            <input
                id="lastName"
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChangeField}
                onBlur={handleBlur}
                />
                {renderError('lastName')}

            <label htmlFor="phoneNumber">Phone number</label>
            <input
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleChangeField}
                onBlur={handleBlur}
                />
                {renderError('phoneNumber')}

        <input type="submit" value="Add" />
        { submitting ? <span className="submittingIndicator" /> : null }
           </form> 
        </div>
    );
};

CustomerForm.defaultProps = {
    onSave: () => {}
  };
/* CustomerForm.defaultProps = {
    fetch: async () => {}
  }; */