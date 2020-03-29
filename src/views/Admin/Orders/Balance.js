import React, { Component, useState, Fragment, useEffect } from "react";
import {
  Row,
  Col,
  CardSubtitle,
  FormGroup,
  Label,
  Button,
  Input
} from "reactstrap";
import { Field, FieldArray, reduxForm, change, reset, getFormValues } from "redux-form";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from "js-cookie";
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from './SelectedOrder/DoorOrders/components/RenderInputs/renderInputs'

import Ratio from 'lb-ratio';
import {
  totalSelector,
  balanceSelector,
  subTotal_Total
} from '../../../selectors/doorPricing';
import { updateOrder, updateBalance, loadOrders } from '../../../redux/orders/actions'


const cookie = Cookies.get("jwt");

const required = value => (value ? undefined : 'Required');

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

class Balance extends Component {
  constructor(props) {
    super(props);
  }

  changeBalance = () => {
    this.props.dispatch(
      change(
        'DoorOrder',
        'balance_due',
        this.props.balance.toFixed("2")
      )
    );
  }

  cancel = () => {
    this.props.toggleBalance()
  }

  submit = async (values) => {
    console.log(values)

    const { updateBalance } = this.props;

    const id = values.id

    const order = {
      balance_due: values.balance_due,
      balance_paid: values.pay_balance,
      balance_history: values.balance_history
    }



    await updateBalance(id, order, cookie);

    await this.props.dispatch(
      change(
        'DoorOrder',
        'pay_balance',
        0
      )
    )

    await this.props.dispatch(
      change(
        'DoorOrder',
        'balance_history',
        [
          ...values.balance_history,
          {
            "balance_due": parseFloat(values.balance_due),
            "balance_paid": parseFloat(values.pay_balance),
            "date": new Date()
          }
        ]

      )
    )

  }


  render() {
    const {
      formState,
      balance,
      handleSubmit,
      selectedOrder
    } = this.props;

    console.log(selectedOrder)

    if (formState) {
      return (
        <div>
          <form onSubmit={handleSubmit(this.submit)}>
            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="Total">Order Total</Label>
                  <Field
                    name='total'
                    type="text"
                    component={renderField}
                    edit={true}
                    label="total" />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="Total">Sales Tax</Label>
                  <Field
                    name='tax'
                    type="text"
                    component={renderField}
                    edit={true}
                    label="total" />
                </FormGroup>
              </Col>
            </Row>

            <hr />

            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="design">Pay Balance</Label>
                  <Field
                    name='pay_balance'
                    type="text"
                    placeholder="0"
                    onBlur={this.changeBalance}
                    component={renderField}
                    label="pay_balance" />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="design">Total Due after Payment</Label>
                  <Field
                    name='balance_due'
                    type="text"
                    edit={true}
                    component={renderField}
                    label="total_due" />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <Button color="primary" className="mr-1">Pay</Button>
                <Button color="danger" onClick={this.cancel}>Cancel</Button>
              </Col>
            </Row>
          </form>
        </div >
      );
    } else {
      return (
        <div />
      )
    }

  }
}


const mapStateToProps = (state, props) => ({

  formState: getFormValues('DoorOrder')(state),
  total: totalSelector(state),
  subTotal: subTotal_Total(state),
  balance: balanceSelector(state),


});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      change,
      updateOrder,
      updateBalance
    },
    dispatch
  );

Balance = reduxForm({
  form: 'DoorOrder',
})(Balance);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Balance);
