import axios from 'axios';
import Cookies from "js-cookie";
const cookie = Cookies.get("jwt");


export const REGISTER_USER = 'REGISTER_USER';
export const LOGIN = 'LOGIN';
export const CREATE_TASK = 'CREATE_TASK';
export const MARK_DONE = 'MARK_DONE';
export const REMOVE_TASK = 'REMOVE_TASK'
export const SET_LOGIN = 'SET_LOGIN'

const db_url = "http://localhost:1337"


export function registerUser(user) {
  return async function (dispatch) {
    await axios.post(`${db_url}/auth/local/register`, user);
 
    return dispatch({
      type: REGISTER_USER,
    });
  };
}

export function login(token) {
  return async function (dispatch) {
    const res = await axios.get(`${db_url}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
 
    return dispatch({
      type: LOGIN,
      user: res.data,
    });
  };
}

export function createTask(task) {
  return async function (dispatch) {
    const res = await axios.post(`${db_url}/tasks`, task, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });
    const data = await res;
    
    return dispatch({
      type: CREATE_TASK,
      data: data.data
    });
  };
}


export function markDone(id, done) {
  return async function (dispatch) {
    await axios.put(`${db_url}/tasks/${id}`, done, {
      headers: {
        'Authorization': `Bearer ${cookie}`
      }
    });  
    return dispatch({
      type: MARK_DONE,
      id: id
    });
  };
}

export function removeTask(id) {
  return async function (dispatch) {
    // const res = await axios.delete(`/tasks/${id}`);
    return dispatch({
      type: REMOVE_TASK,
      id: id
    });
  };
}

export function setLogin() {
  return async function (dispatch) {
    return dispatch({
      type: SET_LOGIN,
    });
  };
}

