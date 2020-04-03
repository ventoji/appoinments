import React,  { useState }  from 'react';

export const CustomerForm = ({ firstName, lastName,phoneNumber, onSubmit }) => {
    //const customer = { firstName };
    const [customer, setCustomer] = useState({
        firstName,
        lastName,
        phoneNumber
    });
    const handleChangeField = ({ target }) =>
    setCustomer(customer => ({
    ...customer,
    [target.name]: target.value
  }));
    return (
        <div>
        <form id="customer" onSubmit={() => onSubmit(customer)}>
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

