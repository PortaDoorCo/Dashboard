import React, { Component } from 'react';
import { Field, reduxForm, FieldArray, getFormValues } from 'redux-form';
import { renderField, renderDropdownListFilter, renderPrice } from '../../../../components/RenderInputs/renderInputs';
import { Button, Table, Input, InputGroup,InputGroupAddon,InputGroupText, Row, Col, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { miscItemPriceSelector, miscItemLinePriceSelector, miscTotalSelector } from '../../../../selectors/drawerPricing';


let Inputs = props => {
  const { fields, misc_items, formState, prices, linePrices, miscTotal, edit } = props;
  console.log(linePrices);
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>QTY</th>
            <th>Item</th>
            <th>Price Per</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((table, index) => {
            return (
              <tr key={index}>
                <td style={{ width: '90px' }}><Field name={`${table}.qty`} component={renderField} type="text" edit={edit} /></td>
                <td>
                  {formState &&  formState.misc_items && formState.misc_items[index] && formState.misc_items[index].category === 'preselect' ?
                    <Field
                      name={`${table}.item`}
                      component={renderDropdownListFilter}
                      data={misc_items}
                      valueField="value"
                      textField="NAME"
                      edit={edit}
                    />  : 
                    <Field
                      name={`${table}.item2`}
                      component={renderField}
                      valueField="value"
                      textField="NAME"
                      edit={edit}
                    />
                  }
                </td>
                {formState &&  formState.misc_items && formState.misc_items[index] && formState.misc_items[index].category === 'preselect' ?
                  <>
                    <td style={{ width: '150px' }}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder={prices[index]} disabled={edit} />
                      </InputGroup>
                    </td>
                    <td style={{ width: '150px' }}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder={linePrices[index]} disabled={edit} />
                      </InputGroup>
                    </td>
                  </>
                  : 
                  <>
                    <td style={{ width: '150px' }}><Field name={`${table}.pricePer`} component={renderPrice} edit={edit} type="text" /></td> 
                    <td style={{ width: '150px' }}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder={linePrices[index]} disabled={edit} />
                      </InputGroup></td> 
                  </> 
                }
                <td>
                  {!edit ?
                    <Button color="danger" onClick={() => fields.remove(index)}>X</Button>
                    : null
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Row>
        <Col>
          {!edit ? 
            <>
              <Button color="primary" className="mt-3" onClick={() => fields.push({
                category: 'preselect',
                qty: 1,
                price: 0
              })}>Add Item </Button>

              <Button color="primary" className="mt-3" onClick={() => fields.push({
                category:'custom',
                qty: 1,
                price: 0
              })}>Custom Item</Button>
            </>
            : null
          }
        </Col>
        <Col />
        <Col>
          <Label htmlFor="companyName">Added to Total</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <Input placeholder={miscTotal} disabled={edit} />
          </InputGroup>
        </Col>
      </Row>



    </div>
  );
};

class MiscItems extends Component {

  render() {
    const { misc_items, formState, prices, linePrices, miscTotal, edit } = this.props;
    console.log('prices', prices);
    return (
      <div>
        <h3>Misc Items</h3>
        <FieldArray name="misc_items" component={Inputs} misc_items={misc_items} formState={formState} prices={prices} linePrices={linePrices} miscTotal={miscTotal} edit={edit} />
      </div>
    );
  }
}



const mapStateToProps = state => ({
  formState: getFormValues('DrawerOrder')(state),
  misc_items: state.misc_items.misc_items,  
  prices: miscItemPriceSelector(state),
  linePrices: miscItemLinePriceSelector(state),
  miscTotal: miscTotalSelector(state)
});

MiscItems = reduxForm({
  form: 'DrawerOrder',
  enableReinitialize: true
})(MiscItems);


export default connect(
  mapStateToProps,
  null
)(MiscItems);