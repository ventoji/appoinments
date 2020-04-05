import React,  { useState }  from 'react';

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
    const [error, setError] = useState(false);
    const handleChangeField = ({ target }) =>
    setCustomer(customer => ({
    ...customer,
    [target.name]: target.value
  }));


  const handleSubmit = async e => {
    e.preventDefault();
   // onSubmit(customer);
   const result = await window.fetch('/customers', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    if (result.ok) {
        const customerWithId = await result.json();
        onSave(customerWithId);
    }else{
        setError(true);
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
            />
            <label htmlFor="lastName">Last name</label>
            <input
                id="lastName"
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChangeField}
            />

            <label htmlFor="phoneNumber">Phone number</label>
            <input
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleChangeField}
            />

        <input type="submit" value="Add" />
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