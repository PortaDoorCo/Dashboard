import React, { Component} from 'react';
import {
  Row,
  Col,
  FormGroup,
  Label,
  Button,
  Input
} from 'reactstrap';
import { Field, reduxForm, change, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from 'js-cookie';
import { renderField } from '../../../../../components/RenderInputs/renderInputs';
import {
  totalSelector,
  balanceSelector,
  subTotal_Total,
  balanceTotalSelector
} from '../../../../../selectors/doorPricing';
import { updateOrder, updateBalance } from '../../../../../redux/orders/actions';


const cookie = Cookies.get('jwt');


class Balance extends Component {


  changeBalance = () => {
    this.props.dispatch(
      change(
        'MiscItems',
        'balance_due',
        this.props.balance.toFixed('2')
      )
    );
  }

  cancel = () => {
    this.props.toggleBalance();
  }

  submit = async (values) => {
 

    const { updateBalance, formState } = this.props;

    const id = values.id;

    const order = {
      balance_due: parseFloat(formState && formState.balance_due) - parseFloat(values.pay_balance),
      balance_paid: values.pay_balance,
      balance_history:  values.balance_history
    };



    await updateBalance(id, order, cookie);

    await this.props.dispatch(
      change(
        'MiscItems',
        'pay_balance',
        0
      )
    );

    await this.props.dispatch(
      change(
        'MiscItems',
        'balance_history',
        [
          ...values.balance_history,
          {
            'balance_due': parseFloat(formState && formState.balance_due) - parseFloat(values.pay_balance),
            'balance_paid': parseFloat(values.pay_balance),
            'date': new Date()
          }
        ]

      )
    );

  }


  render() {
    const {
      formState,
      handleSubmit,
      balanceTotal,
      role
    } = this.props;


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

            <Row>
              <Col>
                <FormGroup>
                  <Label htmlFor="balance_paid">Balance Paid</Label>
                  <Input
                    disabled
                    placeholder={`$${balanceTotal}`}
                  />
                </FormGroup>
              </Col>
            </Row>

            <hr />

            {role && (role.type === 'management' || role.type === 'authenticated' || role.type === 'owner') ?
              <div>
                <Row>
                  <Col xs='3'>
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
                    <Button color="primary" className="mr-1">Pay</Button>
                    <Button color="danger" onClick={this.cancel}>Cancel</Button>
                  </Col>
                </Row>
              </div>
              : null }
          </form>
        </div >
      );
    } else {
      return (
        <div />
      );
    }

  }
}


const mapStateToProps = (state, props) => ({

  formState: getFormValues('MiscItems')(state),
  total: totalSelector(state),
  subTotal: subTotal_Total(state),
  balance: balanceSelector(state),
  balanceTotal: balanceTotalSelector(state),
  role: state.users.user.role

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
  form: 'MiscItems',
})(Balance);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Balance);
