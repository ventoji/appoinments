import React from 'react';
import { CustomerSearch } from '../src/CustomerSearch';
import { withEvent,createContainer} from './domManipulators';
import 'whatwg-fetch';
import { 
    fetchResponseOk, 
    fetchResponseError, 
    fetchRequestBody
   } from './spyHelpers';

let renderAndWait,changeAndWait,clickAndWait, element, elements;
const oneCustomer = [
    { id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1' },
  ];
const twoCustomers = [
    { id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1' },
    { id: 2, firstName: 'C', lastName: 'D', phoneNumber: '2' }];

const tenCustomers1 = [
        { id: 0, firstName: 'A', lastName: 'B', phoneNumber: '1' },
        { id: 1, firstName: 'C', lastName: 'D', phoneNumber: '2' },
        { id: 2, firstName: 'E', lastName: 'F', phoneNumber: '3' },
        { id: 3, firstName: 'G', lastName: 'D', phoneNumber: '4' },
        { id: 4, firstName: 'H', lastName: 'B', phoneNumber: '5' },
        { id: 5, firstName: 'I', lastName: 'D', phoneNumber: '6' },
        { id: 6, firstName: 'J', lastName: 'B', phoneNumber: '7' },
        { id: 7, firstName: 'K', lastName: 'D', phoneNumber: '8' },
        { id: 8, firstName: 'L', lastName: 'B', phoneNumber: '9' },
         { id: 9, firstName: 'M', lastName: 'D', phoneNumber: '10' },
         { id: 10, firstName: 'M', lastName: 'D', phoneNumber: '10' }
 
   ];
const tenCustomers = Array.from('0123456789', id => ({ id }));
const anotherTenCustomers = Array.from('ABCDEFGHIJ', id => ({ id }));

describe('CustomSearch', () => {

    beforeEach(() => {
        ({
            renderAndWait,
            elements,
            element,
            clickAndWait,
            changeAndWait
        } = createContainer());
        jest.spyOn(window, 'fetch')
    .mockReturnValue(fetchResponseOk({}));
    })

    afterEach(() => {
        window.fetch.mockRestore();
      });

    it('renders a table with four headings', async () => {
        window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
        await renderAndWait(<CustomerSearch />);
        const headings = elements('table th');
        //console.log(elements('table th'));
        expect(headings.map(h => h.textContent)).toEqual([
          'First name', 'Last name', 'Phone number', 'Actions'
        ]);
      });

      it('fetches all customer data when component mounts', async () => {
        window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
        await renderAndWait(<CustomerSearch />);
        expect(window.fetch).toHaveBeenCalledWith('/customers', {
          method: 'GET',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' }
        });
      });

      it('renders all customer data in a table row', async () => {
        window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
        await renderAndWait(<CustomerSearch />);
        const row = elements('table tbody td');
        expect(row[0].textContent).toEqual('A');
        expect(row[1].textContent).toEqual('B');
        expect(row[2].textContent).toEqual('1');
      });

      it('renders multiple customer rows', async () => {
        
        window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
        await renderAndWait(<CustomerSearch />);
        const rows = elements('table tbody tr');
        expect(rows[1].childNodes[0].textContent).toEqual('C');
      });
      it('has a next button', async () => {
        window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
        await renderAndWait(<CustomerSearch />);
        expect(element('button#next-page')).not.toBeNull();
      });
      it('requests next page of data when next button is clicked', async () => {
        window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
        await renderAndWait(<CustomerSearch />);
        await clickAndWait(element('button#next-page'));
        expect(window.fetch).toHaveBeenLastCalledWith(
          '/customers?after=9',
          expect.anything()
        );
      });

      it('displays next page of data when next button is clicked', async () => {
        const nextCustomer = [{ id: 'next', firstName: 'Next' }];
        window.fetch
          .mockReturnValueOnce(fetchResponseOk(tenCustomers))
          .mockReturnValue(fetchResponseOk(nextCustomer));
        await renderAndWait(<CustomerSearch />);
        await clickAndWait(element('button#next-page'));
        expect(elements('tbody tr').length).toEqual(1);
        expect(elements('td')[0].textContent).toEqual('Next');
      });

      it('has a previous button', async () => {
        window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
        await renderAndWait(<CustomerSearch />);
        expect(element('button#previous-page')).not.toBeNull();
      });

      it('moves back to first page when previous button is clicked', async () => {
        window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
        await renderAndWait(<CustomerSearch />);
        await clickAndWait(element('button#next-page'));
        await clickAndWait(element('button#previous-page'));
        expect(window.fetch).toHaveBeenLastCalledWith(
          '/customers',
          expect.anything()
        );
      });
      it('moves back one page when clicking previous after multiple clicks of the next button', async () => {
        window.fetch
          .mockReturnValueOnce(fetchResponseOk(tenCustomers))
          .mockReturnValue(fetchResponseOk(anotherTenCustomers));
        await renderAndWait(<CustomerSearch />);
        await clickAndWait(element('button#next-page'));
        await clickAndWait(element('button#next-page'));
        await clickAndWait(element('button#previous-page'));
        expect(window.fetch).toHaveBeenLastCalledWith(
          '/customers?after=9',
          expect.anything());
      });
      it('moves back multiple pages', async () => {
        window.fetch
          .mockReturnValueOnce(fetchResponseOk(tenCustomers))
          .mockReturnValue(fetchResponseOk(anotherTenCustomers));
        await renderAndWait(<CustomerSearch />);
        await clickAndWait(element('button#next-page'));
        await clickAndWait(element('button#next-page'));
        await clickAndWait(element('button#previous-page'));
        await clickAndWait(element('button#previous-page'));
        expect(window.fetch).toHaveBeenLastCalledWith(
          '/customers',
          expect.anything()
        );
      });

      it('has a search input field with a placeholder', async () => {
        window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
        await renderAndWait(<CustomerSearch />);
        expect(element('input')).not.toBeNull();
        expect(element('input').getAttribute('placeholder')).toEqual(
          'Enter filter text'
        );
      });

      it('performs search when search term is changed', async () => {
        window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
        await renderAndWait(<CustomerSearch />);
        await changeAndWait(
          element('input'),
          withEvent('input', 'name')
        );
        expect(window.fetch).toHaveBeenLastCalledWith(
          '/customers?searchTerm=name',
          expect.anything()
        );
      });

      it('includes search term when moving to next page', async () => {
        window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
        await renderAndWait(<CustomerSearch />);
        await changeAndWait(
          element('input'),
          withEvent('input', 'name')
        );
        await clickAndWait(element('button#next-page'));
        expect(window.fetch).toHaveBeenLastCalledWith(
          '/customers?after=9&searchTerm=name',
          expect.anything());
      });

      it('displays provided action buttons for each customer', async () => {
        const actionSpy = jest.fn();
        actionSpy.mockReturnValue('actions');
        window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
        await renderAndWait(<CustomerSearch renderCustomerActions={actionSpy} />);
        const rows = elements('table tbody td');
        expect(rows[rows.length-1].textContent).toEqual('actions');
      });

      it('passes customer to the renderCustomerActions prop', async () => {
        const actionSpy = jest.fn();
        actionSpy.mockReturnValue('actions');
        window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
        await renderAndWait(<CustomerSearch renderCustomerActions={actionSpy} />);
        expect(actionSpy).toHaveBeenCalledWith(oneCustomer[0]);
      });
})
