import React, { Component, Suspense } from 'react';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadOrders, updateStatus } from '../../../redux/orders/actions';
import { loadCustomers } from '../../../redux/customers/actions';
// import OrderTable from './OrderTable';
// import RestrictedOrderTable from './RestrictedOrderTable';

const OrderTable = React.lazy(() => import('./OrderTable2'));
const RestrictedOrderTable = React.lazy(() => import('./RestrictedOrderTable'));

class ViewAllOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  loading = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

  render() {
    const { orders, loadOrders, updateStatus, role } = this.props;
    return role && (role.type === 'management' ||
      role.type === 'authenticated' ||
      role.type === 'owner') ? (
        <div>
          {orders.length && (
            <div>
              <Row>
                <Col>
                  <Suspense fallback={this.loading()}>
                    <OrderTable
                      orders={orders}
                      loadOrders={loadOrders}
                      updateStatus={updateStatus}
                    />
                  </Suspense>
                </Col>
              </Row>
            </div>
          )}
        </div>
      ) : (
        <div>
          {orders.length && (
            <div>
              <Row>
                <Col>
                  <Suspense fallback={this.loading()}>
                    <RestrictedOrderTable
                      orders={orders}
                      loadOrders={loadOrders}
                      updateStatus={updateStatus}
                    />
                  </Suspense>

                </Col>
              </Row>
            </div>
          )}
        </div>
      );
  }
}

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  orderNum: state.Orders.orderNum,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  role: state.users.user.role
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOrders,
      loadCustomers,
      updateStatus
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllOrders);
