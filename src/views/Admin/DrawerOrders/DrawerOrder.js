import React, { Component, Suspense } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  CardHeader,
  CardBody,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotificationAlert from 'react-notification-alert';
import 'react-notifications/lib/notifications.css';
import {
  reduxForm,
  FormSection,
  getFormValues,
  change,
  FieldArray,
  Field,
  touch,
  startAsyncValidation
} from 'redux-form';
import { submitOrder } from '../../../redux/orders/actions';
import { loadCustomers } from '../../../redux/customers/actions';
import {
  linePriceSelector,
  itemPriceSelector,
  subTotalSelector,
  totalSelector,
  taxSelector,
  addPriceSelector,
  miscTotalSelector
} from '../../../selectors/drawerPricing';
import moment from 'moment-business-days';
import Cookies from 'js-cookie';
import { renderField } from '../../../components/RenderInputs/renderInputs';
import FileUploader from '../../../components/FileUploader/FileUploader';
import NumberFormat from 'react-number-format';
import currencyMask from '../../../utils/currencyMask';
import CheckoutBox from './CheckoutBox';
import Sticky from 'react-stickynode';
import { NotificationManager } from 'react-notifications';
import CancelModal from '../../../utils/Modal';

const DrawerBoxInfo = React.lazy(() => import('../../../components/DrawerOrders/DrawerBoxInfo'));
const JobInfo = React.lazy(() => import('../../../components/JobInfo/DrawerJobInfo'));

const loading  = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

const cookie = Cookies.get('jwt');
const maxValue = max => value => value && value > max ? `Cannot be greater than ${max}%` : undefined;

const dueDate = moment(new Date()).businessAdd(7)._d;

let options = {};
options = {
  place: 'br',
  message: (
    <div>
      <div>Order Submitted Successfuly</div>
    </div>
  ),
  type: 'primary',
  icon: 'now-ui-icons ui-1_bell-53',
  autoDismiss: 3
};

class DoorOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      loaded: false,
      customerAddress: [],
      files: [],
      subNavModal: false,
      subNavPage: 'misc',
      customerReminder: false,
      cancelModal: false,
    };
  }

  toggleReminderModal = () => {
    this.setState({ customerReminder: !this.state.customerReminder });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    // this.toggleReminderModal();

    const { dispatch } = this.props;

    dispatch(
      touch(
        'DrawerOrder',
        'job_info.poNum'
      )
    );

    dispatch(
      touch(
        'DrawerOrder',
        'job_info.shipping_method'
      )
    );


    dispatch(
      startAsyncValidation('DrawerOrder')
    );
  }

  reloadPage = () => {
    // return this.props.history.push('/dashboard')
    window.location.reload();
  };

  notify = () => {
    this.refs.notify.notificationAlert(options);
  };

  submit = async (values, e) => {
    const {
      reset,
      prices,
      itemPrice,
      subTotal,
      total,
      submitOrder,
      tax,
      user
    } = this.props;

    const orderType = 'Drawer Order';


    const order = {
      ...values,
      status: values.job_info.status,
      Rush: values.job_info.Rush,
      Sample: values.job_info.Sample,
      job_info: values.job_info,
      companyprofile: values.job_info.customer.id,
      linePrice: prices,
      itemPrice: itemPrice,
      subTotals: subTotal,
      tax: tax,
      total: total,
      balance_due: total,
      orderType: orderType,
      dueDate: values.job_info.DueDate,
      Date: new Date(),
      user: user.id,
      userName: user.username,
      files: this.state.files,
      submittedBy: user.FirstName,
      tracking: [
        {
          'status': values.job_info.status,
          'date': new Date()
        }
      ],
      balance_history: [
        {
          'balance_paid': values.balance_paid,
          'date': new Date()
        }
      ],
      sale: values.job_info && values.job_info.customer && values.job_info.customer.sale && values.job_info.customer.sale.id,
    };

    let canSubmit = false;

    values.part_list.map(v => {
      return v.dimensions.length > 0 ? canSubmit = true : canSubmit = false;
    });

    if(canSubmit){
      submitOrder(order, cookie);
      reset();
      window.scrollTo(0, 0);
    } else {
      alert('Submission Error: Please double check your order');
      return;
    }

  };

  cancelOrder = (e) => {
    e.preventDefault();
    this.setState({ updateSubmit: false });
    this.toggleCancelModal();
    this.props.reset();
  };

  toggleCancelModal = () => {
    this.setState({ cancelModal: !this.state.cancelModal });
  };

  onKeyPress(event) {
    if (event.target.type !== 'textarea' && event.which === 13 /* Enter */) {
      event.preventDefault();
    }
  }

  onUploaded = (e) => {
    const id = e.map(i => (i.id));
    const a = [...this.state.files, id];
    this.setState({ files: a });
  }

  onSubNav = (nav) => {
    this.setState({
      subNavModal: !this.state.subNavModal,
      subNavPage: nav
    });
  };

  render() {
    const {
      submitted,
      handleSubmit,
      prices,
      subTotal,
      total,
      woodtypes,
      boxBottomWoodtype,
      boxBottoms,
      boxThickness,
      notchDrill,
      scoop,
      dividers,
      drawerFinishes,
      box_assembly,
      customers,
      formState,
      address,
      tax,
      dispatch
    } = this.props;

    return (
      <div className="animated fadeIn">
        <NotificationAlert ref="notify" />
        <CancelModal
          toggle={this.toggleCancelModal}
          modal={this.state.cancelModal}
          title={'Cancel Order?'}
          message={'Are you sure you want to this cancel this order?'}
          action={this.cancelOrder}
          actionButton={'Cancel Order'}
          buttonColor={'danger'}
        />
        <div className="orderForm">
          <div className="orderFormCol1">
            <Card>
              <CardHeader>
                <strong>Drawer Order</strong>
              </CardHeader>
              <CardBody>
                <form
                  onKeyPress={this.onKeyPress}
                  onSubmit={handleSubmit(this.submit)}
                >
                  {!submitted ? (
                    <FormSection name="job_info">
                      <Suspense fallback={loading()}>
                        <JobInfo
                          customers={customers}
                          change={change}
                          address={address}
                          formState={formState}
                          loaded={this.state.loaded}
                          handleAddress={this.handleAddress}
                          toggleReminderModal={this.toggleReminderModal}
                          customerReminder={this.state.customerReminder}
                        />
                      </Suspense>
                    </FormSection>
                  ) : null}

                  <Row>
                    <Col>
                      <Card>
                        <CardBody>
                          <FormGroup>
                            <h3>Upload Files</h3>
                            <p>Please Upload Sketches with Design References</p>
                            <FileUploader onUploaded={this.onUploaded} multi={true} />
                          </FormGroup>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>

                  <Suspense fallback={loading()}>
                    <FieldArray
                      name="part_list"
                      component={DrawerBoxInfo}
                      woodtypes={woodtypes}
                      boxBottomWoodtype={boxBottomWoodtype}
                      boxThickness={boxThickness}
                      boxBottoms={boxBottoms}
                      notchDrill={notchDrill}
                      drawerFinishes={drawerFinishes}
                      scoop={scoop}
                      dividers={dividers}
                      formState={formState}
                      prices={prices}
                      subTotal={subTotal}
                      box_assembly={box_assembly}
                      dispatch={dispatch}
                    />
                  </Suspense>

                  <div className="mb-3" />

                  <hr />
                  <hr />
                  <Row>
                    <Col xs="4" />
                    <Col xs="5" />
                    <Col xs="3">

                      <Row className='mb-0'>
                        <Col xs='9' />
                      </Row>

                      <strong>Discount: </strong>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>%</InputGroupText>
                        </InputGroupAddon>
                        <Field
                          name={'discount'}
                          type="text"
                          edit={true}
                          component={renderField}
                          label="discount"
                        />
                      </InputGroup>
                      <strong>Tax: </strong>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <NumberFormat thousandSeparator={true} value={tax} disabled={true} customInput={Input} {...currencyMask} prefix={'$'} />
                      </InputGroup>


                      <strong>Total: </strong>
                      <InputGroup className='mb-3'>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <NumberFormat thousandSeparator={true} value={total} disabled={true} customInput={Input} {...currencyMask} prefix={'$'} />
                      </InputGroup>
                    </Col>
                  </Row>
                </form>
              </CardBody>
            </Card>
          </div>


          <div className="orderFormCol2">
            <Sticky
              top={100}
              // bottomBoundary={`#item-${i}`}
              enabled={true}
              // key={i}
            >

              <CheckoutBox
                {...this.props}
                {...this.state}
                onSubNav={this.onSubNav}
                handleSubmit={handleSubmit}
                submit={this.submit}
                toggleCancelModal={this.toggleCancelModal}
                maxValue={maxValue}
                onUploaded={this.onUploaded}
              />
            </Sticky>
            



          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  woodtypes: state.part_list.woodtypes,
  boxBottomWoodtype: state.part_list.box_bottom_woodtypes,
  boxThickness: state.part_list.box_thickness,
  boxBottoms: state.part_list.box_bottom_thickness,
  notchDrill: state.part_list.box_notch,
  drawerFinishes: state.part_list.box_finish,
  box_assembly: state.part_list.box_assembly,
  scoop: state.part_list.box_scoop,
  dividers: state.part_list.dividers,
  customers: state.customers.customerDB,
  address: state.Orders.address,

  user: state.users.user,

  submitted: state.Orders.submitted,
  initialValues: {
    open: true,
    balance_paid: 0,
    misc_items: [],
    discount: 0,
    Taxable: state.customers.customerDB[0].Taxable ? state.customers.customerDB[0].Taxable : false,
    part_list: [
      {
        box_assembly: state.part_list.box_assembly[0],
        dimensions: [],
        addPrice: 0
      }
    ],
    job_info: {
      customer: state.customers.customerDB[0],
      jobName: '',
      status: 'Quote',
      poNum: '',
      Address1: state.customers.customerDB[0].Address1,
      Address2: state.customers.customerDB[0].Address2,
      City: state.customers.customerDB[0].City,
      State: state.customers.customerDB[0].State,
      Zip: state.customers.customerDB[0].Zip,
      Phone: state.customers.customerDB[0].Phone,
      DueDate: dueDate,
      Notes: state.customers.customerDB[0].Notes
    }
  },
  formState: getFormValues('DrawerOrder')(state),
  prices: linePriceSelector(state),
  itemPrice: itemPriceSelector(state),
  subTotal: subTotalSelector(state),
  total: totalSelector(state),
  tax: taxSelector(state),
  addPriceSelector: addPriceSelector(state),
  miscTotalSelector: miscTotalSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      submitOrder,
      loadCustomers
    },
    dispatch
  );

DoorOrders = reduxForm({
  form: 'DrawerOrder',
  enableReinitialize: true,
  onSubmitFail: (errors, dispatch, submitError, props) => {
    const job_info_message = 'You are missing required info';
    if (errors) {
      NotificationManager.error(job_info_message, 'Error', 2000);
    } 
  },
})(DoorOrders);

export default connect(mapStateToProps, mapDispatchToProps)(DoorOrders);
