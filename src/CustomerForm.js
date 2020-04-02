import React from 'react';

export const CustomerForm = ({firstName}) => {
    return (
        <div>
           <form id="customer">
            <input 
                type="text" 
                name="firstName"
                value={firstName}
                
                ></input>
           
           </form> 
        </div>
    );
};

