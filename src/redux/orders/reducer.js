import {
  LOAD_ORDERS,
  SUBMIT_ORDER,
  UPDATE_ORDER,
  LOAD_DELIVERIES,
  UPDATE_STATUS,
  SOCKET_RECEIVE_UPDATE_STATUS,
  SET_SELECTED_ORDER,
  UPLOAD_FILE_TO_ORDER
} from './actions';
import moment from 'moment';

const initialState = {
  ordersDBLoaded: false,
  orders: [],
  deliveries: [],
  sortedDestinations: [],
  selectedOrder: null
};

export default function (state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case LOAD_ORDERS:
      return {
        ...state,
        orders: data,
        ordersDBLoaded: true
      };
    case SUBMIT_ORDER:
      return {
        ...state,
      };
    case SET_SELECTED_ORDER:
      return {
        ...state,
        selectedOrder: data
      };
    case UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map((item, index) => {
          if (item.id !== data.data.id) {
            return item;
          }
          return data.data;
        })
      };
    case UPLOAD_FILE_TO_ORDER:

      console.log(data);

      return {
        ...state,
        orders: state.orders.map((item, index) => {
          if (item.id !== data.data.id) {
            return item;
          }
          return data.data;
        }),
        selectedOrder: data.data
      };
    case UPDATE_STATUS:
      return {
        ...state,
        orders: state.orders.map((item, index) => {
          if (item.id !== data.data.id) {
            return item;
          }
          return data.data;
        })
      };
    case SOCKET_RECEIVE_UPDATE_STATUS:
      return {
        ...state,
        orders: state.orders.map((item, index) => {
          if (item.id !== data.id) {
            return item;
          }
          return data;
        })
      };
    case LOAD_DELIVERIES:
      const updatedDeliveries = data;
      const dateDeliveries = updatedDeliveries.filter(function (d, i) {
        return moment(d.createdAt).isSame(new Date(), 'day');
      });
      // const sortedLocations = sortByDistance(state.current_location.coords, updatedDeliveries.map(i=>i.location), opts);

      // const sortedDestinations = sortedLocations.map(location => {
      //     const deliveryCompany = updatedDeliveries.find(({ location: { latitude }}) => latitude === location.latitude);
      //     return deliveryCompany;
      // });

      return {
        ...state,
        deliveries: dateDeliveries,
        // sortedDestinations
      };
    default:
      return {
        ...state,

      };
  }
}
