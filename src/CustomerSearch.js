import React, {useState,useEffect, useCallback} from 'react';

const CustomerRow = ({ customer,renderCustomerActions }) => (
    <tr>
      <td>{customer.firstName}</td>
      <td>{customer.lastName}</td>
      <td>{customer.phoneNumber}</td>
      <td>{renderCustomerActions(customer)}</td>
    </tr>
  );
  
const SearchButtons = ({handleNext, handlePrevious}) => (
    <div className="button-bar">
    <button role="button" id="previous-page" onClick={handlePrevious}>
  Previous
</button>
    <button role="button" id="next-page" onClick={handleNext}>
        Next
      </button>
    </div>
  );

export const CustomerSearch = ({ renderCustomerActions }) => {

    const [customers, setCustomers] = useState([]);
    const [isLoading, setLoading] = useState(false);
    //const [queryString, setQueryString] = useState('');
    //const [previousQueryString, setPreviousQueryString] = useState('');
    const [lastRowIds, setlastRowIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
   // const [lastRowIds, setLastRowIds] = useState([]);

   const searchParams = (after, searchTerm) => {
    let pairs = [];
    if (after) { pairs.push(`after=${after}`); }
    if (searchTerm) { pairs.push(`searchTerm=${searchTerm}`); }
    if (pairs.length > 0) {
      return `?${pairs.join('&')}`;
    }
    return '';
  }; 
    useEffect(() => {

        const fetchCustomers = async () => {
            setLoading(true);
          //  let queryString = '';
            let after;
            if (lastRowIds.length > 0)
                after = lastRowIds[lastRowIds.length - 1];
            const queryString = searchParams(after, searchTerm);
          /*   if (lastRowIds.length > 0 && searchTerm !== '') {
                queryString = lastRowIds[lastRowIds.length - 1]
                  + '&searchTerm=' + searchTerm;
              } else if (searchTerm !== '') {
                queryString = `?searchTerm=${searchTerm}`;
              } else if (lastRowIds.length > 0)
              queryString = lastRowIds[lastRowIds.length - 1]; */

            const result =await  window.fetch(`/customers${queryString}`, {
                method: 'GET',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' }
              });
           setCustomers(await result.json());
           setLoading(false);
            };
        
            fetchCustomers();

    },[lastRowIds, searchTerm]);

    const handlePrevious = useCallback(() => {
    setlastRowIds(lastRowIds.slice(0, -1));
  }, [lastRowIds]);
 
   /*   const handlePrevious = useCallback(async () =>
    setQueryString(previousQueryString)
  , [previousQueryString]);*/

    const handleNext = useCallback(  () => {
        const after = customers[customers.length - 1].id;
       // const queryString = `?after=${after}`;
        setlastRowIds([...lastRowIds, after]);
//        setPreviousQueryString(queryString);
 //       setQueryString(newQueryString);

      /*   const url = `/customers?after=${after}`;
        const result = await window.fetch(url, {
          method: 'GET',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' }
        });
        setCustomers(await result.json()); */
      }, [customers,lastRowIds]); // [customers]

    const handleSearchTextChanged = ( { target: { value } }) =>
  setSearchTerm(value);

    return (
      isLoading ? <p> is loading </p> : <React.Fragment>
      <input 
        value={searchTerm}
        onChange={handleSearchTextChanged}
        placeholder="Enter filter text" 
        />
      <SearchButtons 
        handleNext={handleNext}
        handlePrevious={handlePrevious} 
        />
      <table>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {customers.map((customer,i) => (
            <CustomerRow 
                customer={customer} 
                key={i}
                renderCustomerActions={renderCustomerActions} 
                />
              ))}
    </tbody>
      </table>
      </React.Fragment>
    );
};

CustomerSearch.defaultProps = {
    renderCustomerActions: () => {}
  };
