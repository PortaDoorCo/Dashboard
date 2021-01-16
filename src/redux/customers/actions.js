import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import db_url from '../db_url';

export const LOAD_CUSTOMERS = 'LOAD_CUSTOMERS';
export const LOAD_ALL_CUSTOMERS = 'LOAD_ALL_CUSTOMERS';
export const UPDATE_CUSTOMER = 'UPDATE_CUSTOMER';
export const SUBMIT_CUSTOMER = 'SUBMIT_CUSTOMER';
export const SET_SELECTED_COMPANY = 'SET_SELECTED_COMPANY';
export const DB_NOT_LOADED = 'DB_NOT_LOADED';


export function setSelectedCompanies(data) {

  return async function (dispatch) {
    return await dispatch({
      type: SET_SELECTED_COMPANY,
      data: data
    });
  };
}

export function loadCustomers(cookie, amt) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/companyprofiles`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    await dispatch(hideLoading());
    return await dispatch({
      type: LOAD_CUSTOMERS,
      data: data
    }
    );
  };
}

export function loadAllCustomers(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/companyprofiles/all`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    await dispatch(hideLoading());
    return await dispatch({
      type: LOAD_ALL_CUSTOMERS,
      data: data
    }
    );
  };
}

export function dbNotLoaded(cookie) {
  return async function (dispatch) {
    return await dispatch({
      type: DB_NOT_LOADED,
    }
    );
  };
}

export function updateCustomer(custId, customer, cookie) {
  return async function (dispatch) {
    try {
      const res = await axios.put(`${db_url}/companyprofiles/${custId}`, customer,
        {
          headers: {
            'Authorization': `Bearer ${cookie}`
          }
        }
      );
      const data = await res;

      NotificationManager.success('Customer has been update!', 'Customer Updated!', 2000);
      return dispatch({
        type: UPDATE_CUSTOMER,
        data: data.data
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}

export function submitCustomer(customer, cookie) {
  return async function (dispatch) {
    try {
      const res = await axios.post(`${db_url}/companyprofiles`, customer, {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      });


      NotificationManager.success('Customer has been added!', 'Submission Succeeded!', 2000);
      return dispatch({
        type: SUBMIT_CUSTOMER,
        data: res
      });
    } catch (error) {
      console.error(error);
      NotificationManager.error('There was an problem with your submission', 'Error', 2000);
    }
  };
}


