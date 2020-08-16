import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import OrderPage from './OrderPage';
import { Tooltip, IconButton } from '@material-ui/core';
import Inbox from '@material-ui/icons/Inbox';
import { Select } from 'antd';
import {
  updateStatus,
  loadOrders,
  setSelectedOrder,
} from '../../../redux/orders/actions';
import Cookies from 'js-cookie';
import momentLocaliser from 'react-widgets-moment';
import { Row, Col } from 'reactstrap';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Receipt from '@material-ui/icons/Receipt';
import Assignment  from '@material-ui/icons/Assignment';
import Report1 from './PrintOuts/Reports/Report1';
import DoorPDF from './PrintOuts/Pages/Door/DoorPDF';
import DrawerPDF from './PrintOuts/Pages/Drawer/DrawerPDF';

momentLocaliser(moment);

const toDataUrl = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
};

const cookie = Cookies.get('jwt');
const { Option } = Select;

const status = [
  {
    label: 'Quote',
    value: 'Quote',
  },
  {
    label: 'Invoiced',
    value: 'Invoiced',
  },
  {
    label: 'Ordered',
    value: 'Ordered',
  },
  {
    label: 'In Production',
    value: 'In Production',
  },
  {
    label: 'Station 1',
    value: 'Station 1',
  },
  {
    label: 'Station 2',
    value: 'Station 2',
  },
  {
    label: 'Station 3',
    value: 'Station 3',
  },
  {
    label: 'Station 4',
    value: 'Station 4',
  },
  {
    label: 'Complete',
    value: 'Complete',
  },
  {
    label: 'Shipped',
    value: 'Shipped',
  },
  {
    label: 'LATE',
    value: 'LATE',
  },
];

const conditionalRowStyles = [
  {
    when: (row) => row.late === true,
    style: {
      backgroundColor: '#FEEBEB',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
];

const OrderTable = (props) => {
  const { orders } = props;
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState(orders);
  const [startDate, setStartDate] = useState(moment(new Date()));
  const [endDate, setEndDate] = useState(moment(new Date()));
  const [focusedInput, setFocusedInput] = useState(null);
  const [filterStatus, setFilterStatus ] = useState('All');

  const minDate = orders.length > 0 ? new Date(orders[orders.length - 1].createdAt) : new Date();

  useEffect(() => {
    const filteredOrders = orders.filter((item) => {
      let date = new Date(item.createdAt);

      if(filterStatus === 'All'){
        return (
          moment(date) >= moment(startDate).startOf('day').valueOf() &&
          moment(date) <= moment(endDate).endOf('day').valueOf()
        );
      } else {
        return (
          moment(date) >= moment(startDate).startOf('day').valueOf() &&
          moment(date) <= moment(endDate).endOf('day').valueOf() &&
          item.status.includes(filterStatus)
        );
      }

    });
    setData(filteredOrders);
  }, [startDate, endDate, orders, filterStatus]);

  const handleStatusChange = async (e, row) => {
    const { updateStatus } = props;
    const status = {
      status: e,
    };
    await updateStatus(row.id, row, status, cookie);
  };

  const columns = [
    {
      name: 'Order #',
      selector: 'orderNum',
      sortable: true,
    },
    {
      name: 'Company',
      selector: 'job_info.customer.Company',
      sortable: true,
      grow: 2,
    },
    {
      name: 'Order Type',
      selector: 'orderType',
      sortable: true,
    },
    {
      name: 'Date Ordered',
      cell: (row) => <div>{moment(row.createdAt).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Due Date',
      cell: (row) => <div>{moment(row.dueDate).format('MMM Do YYYY')}</div>,
    },
    {
      name: 'Status',
      grow: 1,
      cell: (row) => (
        <Select
          defaultValue={row.status}
          style={{ width: '100%' }}
          onChange={(e) => handleStatusChange(e, row)}
          bordered={false}
        >
          {status.map((i, index) => (
            <Option key={index} value={i.value}>
              {i.value}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      name: 'Submitted By',
      selector: 'user.FirstName',
      sortable: true,
    },

    {
      name: 'Total',
      selector: 'total',
      sortable: true,
      cell: (row) => <div>${row.total.toFixed(2)}</div>,
    },
    {
      name: ' ',
      button: true,
      grow: 2,
      cell: (row) => (
        <Tooltip title="View Order" placement="top">
          <IconButton
            onClick={function (event) {
              event.preventDefault();
              toggle(row);
            }}
            id={row.id}
          >
            <Inbox>Open</Inbox>
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const handleRowSelected = React.useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  const contextActions = React.useMemo(() => {
    const exportBreakdowns = () => {
      const { breakdowns, box_breakdowns } = props;

      selectedRows.map(async (i) => {
        if (i.orderType === 'Door Order') {

          const edgesPromiseArr1 = i.part_list.filter(i => i.edge && i.edge.photo && i.edge.photo.url).map(i => {
            return new Promise((resolve, reject) => {
              toDataUrl(i.edge.photo.url, (result) => {
                resolve(result);
              });
            });
          });

          const mouldsPromiseArr1 = i.part_list.filter(i => i.profile && i.profile.photo && i.profile.photo.url).map(i => {
            return new Promise((resolve, reject) => {
              toDataUrl(i.profile.photo.url, (result) => {
                resolve(result);
              });
            });
          });



          const panelsPromiseArr1 = i.part_list.filter(i => i.panel && i.panel.photo && i.panel.photo.url).map(i => {
            return new Promise((resolve, reject) => {
              toDataUrl(i.panel.photo.url, (result) => {
                resolve(result);
              });
            });
          });

          const appliedProfilePromiseArr1 = i.part_list.filter(i => i.applied_profile && i.applied_profile.photo && i.applied_profile.photo.url).map(i => {
            return new Promise((resolve, reject) => {
              toDataUrl(i.applied_profile.photo.url, (result) => {
                resolve(result);
              });
            });
          });

          let edges1;
          let moulds1;
          let panels1;
          let appliedProfiles1;

          try {
            edges1 = await Promise.all(edgesPromiseArr1);
            moulds1 = await Promise.all(mouldsPromiseArr1);
            panels1 = await Promise.all(panelsPromiseArr1);
            appliedProfiles1 = await Promise.all(appliedProfilePromiseArr1);
          } catch (err) {
            console.log('errrrrrr', err);
          }
          return DoorPDF(i, edges1, moulds1, panels1, appliedProfiles1, breakdowns);
        } else {
          return DrawerPDF(i, box_breakdowns);
        }
      }); 
      setToggleCleared(!toggleCleared); 
    };

    const exportReports = () => {
      Report1(selectedRows, startDate, endDate, filterStatus);
      setToggleCleared(!toggleCleared); 
    };

    return (
      <div>
        <Tooltip title="View Reports" onClick={exportReports} placement="top" className="mb-3 mt-3">
          <IconButton>
            <Receipt style={{ width: '40', height: '40' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="View Breakdowns" onClick={exportBreakdowns} placement="top" className="mb-3 mt-3">
          <IconButton>
            <Assignment style={{ width: '40', height: '40' }} />
          </IconButton>
        </Tooltip>
      </div>
    );
  }, [selectedRows, startDate, endDate, props, filterStatus, toggleCleared]);

  const toggle = (row) => {
    const { setSelectedOrder } = props;

    setEdit(false);
    setModal(!modal);

    if (!modal) {
      setSelectedOrder(row);
    } else {
      setSelectedOrder(null);
    }
  };

  const editable = () => {
    setEdit(!edit);
  };


  return (
    <div>
      <Row className="mb-3">
        <Col lg="9" />
        <Col>
          <Row>
            <Col>
              <DateRangePicker
                startDate={startDate} // momentPropTypes.momentObj or null,
                startDateId="startDate" // PropTypes.string.isRequired,
                endDate={endDate} // momentPropTypes.momentObj or null,
                endDateId="endDate" // PropTypes.string.isRequired,
                onDatesChange={({ startDate, endDate }) => (setStartDate(startDate), setEndDate(endDate))} // PropTypes.func.isRequired,
                focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                isOutsideRange={(date) => {
                  if (date > moment(new Date())) {
                    return true; // return true if you want the particular date to be disabled
                  } else if (date < moment(minDate)) {
                    return true;
                  } else {
                    return false;
                  }
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Select defaultValue="All" style={{ width: '69%' }} onChange={e => setFilterStatus(e)}>
                <Option value="All">All</Option>
                {status.map((i, index) => (
                  <Option key={index} value={i.value}>
                    {i.value}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>


        </Col>
      </Row>

      <DataTable
        title="Orders"
        columns={columns}
        data={data}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        pagination
        progressPending={!props.ordersDBLoaded}
        highlightOnHover
        conditionalRowStyles={conditionalRowStyles}
        contextActions={contextActions}
      />
      {modal ? (
        <OrderPage
          toggle={toggle}
          modal={modal}
          editable={editable}
          edit={edit}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  orderNum: state.Orders.orderNum,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  breakdowns: state.part_list.breakdowns,
  box_breakdowns: state.part_list.box_breakdowns
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateStatus,
      loadOrders,
      setSelectedOrder,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderTable);
