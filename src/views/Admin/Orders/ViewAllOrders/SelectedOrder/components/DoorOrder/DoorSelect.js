import React, { Fragment } from 'react';

import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  CardSubtitle,
  Table,

} from 'reactstrap';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';







class DoorSelect extends React.Component {


  render() {
    const { order } = this.props;
    // const company = order.CompanyName;

 

    return (
      <div className="animated resize">
        <div>
          <Row>
            <Col xs="12" sm="12">
              <Card>
                <CardHeader>
                  <strong>Door Order</strong>
                </CardHeader>
                <CardBody>
                  <Form>
                    <CardSubtitle className="mt-4">
                      <h5>Job Info</h5>
                    </CardSubtitle>
                    <Row>
                      <Col xs="3">
                        <FormGroup>
                          <strong>
                            {' '}
                            <Label htmlFor="job-name">Job Name</Label>{' '}
                          </strong>
                          <Input placeholder={order.jobName} disabled />
                        </FormGroup>
                      </Col>
                      <Col xs="5">
                        <FormGroup>
                          <strong>
                            {' '}
                            <Label htmlFor="customers">Customer</Label>{' '}
                          </strong>
                          <Input
                            placeholder={order.jobInfo.customer.Company}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col xs="2">
                        <FormGroup>
                          <strong>
                            {' '}
                            <Label htmlFor="status">Status</Label>{' '}
                          </strong>
                          <Input placeholder={order.status} disabled />
                        </FormGroup>
                      </Col>
                      <Col xs="2">
                        <FormGroup>
                          <strong>
                            <Label htmlFor="po">PO #</Label>
                          </strong>
                          <Input placeholder={order.poNum} disabled />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="6">
                        <FormGroup>
                          <strong>
                            <Label htmlFor="address1">Address 1</Label>
                          </strong>
                          <Input
                            placeholder={order.shippingAddress.Address1}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col xs="6">
                        <FormGroup>
                          <strong>
                            <Label htmlFor="address2">Address 2</Label>
                          </strong>
                          <Input
                            placeholder={order.shippingAddress.Address2}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="3">
                        <FormGroup>
                          <strong>
                            <Label htmlFor="city">City</Label>
                          </strong>
                          <Input
                            placeholder={order.shippingAddress.City}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col xs="3">
                        <FormGroup>
                          <strong>
                            <Label htmlFor="state">State</Label>
                          </strong>
                          <Input
                            placeholder={order.shippingAddress.State}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col xs="3">
                        <FormGroup>
                          <strong>
                            <Label htmlFor="zipcode">Zip Code</Label>
                          </strong>
                          <Input
                            placeholder={order.shippingAddress.Zip}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col xs="3">
                        <FormGroup>
                          <strong>
                            <Label htmlFor="phone">Phone Number</Label>
                          </strong>
                          <Input
                            placeholder={order.shippingAddress.Phone}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr />
                    {order.part_list.map((part, i) => (
                      <div>
                        <CardSubtitle className="mt-4">
                          <h5>Part List</h5>
                        </CardSubtitle>
                        <Row>
                          <Col xs="3">
                            <FormGroup>
                              <strong>
                                <Label htmlFor="woodtype">Woodtype</Label>
                              </strong>
                              <Input
                                placeholder={part.woodtype.NAME}
                                disabled
                              />
                            </FormGroup>
                          </Col>
                          <Col xs="3">
                            <FormGroup>
                              <strong>
                                <Label htmlFor="design">Design</Label>
                              </strong>

                              <Input placeholder={part.design.NAME} disabled />
                            </FormGroup>
                          </Col>
                          <Col xs="3">
                            <FormGroup>
                              <strong>
                                <Label htmlFor="edge">Edge</Label>
                              </strong>
                              <Input placeholder={part.edges.NAME} disabled />
                            </FormGroup>
                          </Col>
                          <Col xs="3">
                            <FormGroup>
                              <strong>
                                <Label htmlFor="mould">Mould</Label>
                              </strong>
                              <Input placeholder={part.moulds.NAME} disabled />
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col xs="4">
                            <FormGroup>
                              <strong>
                                <Label htmlFor="panel">Panel</Label>
                              </strong>
                              <Input placeholder={part.panels.PANEL} disabled />
                            </FormGroup>
                          </Col>

                          <Col xs="4">
                            <FormGroup>
                              <strong>
                                <Label htmlFor="grade-thickness">Finish</Label>
                              </strong>
                              <Input placeholder={part.finish.name} disabled />
                            </FormGroup>
                          </Col>

                          <Col xs="4">
                            <FormGroup>
                              <strong>
                                <Label htmlFor="finish">Hinges</Label>
                              </strong>
                              <Input placeholder={part.hinges.Name} disabled />
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col xs="4">
                            <FormGroup>
                              <strong>
                                <Label for="exampleText">Job Notes</Label>
                              </strong>
                            </FormGroup>
                          </Col>
                        </Row>

                        <div>
                          <CardSubtitle className="mt-4 mb-1">
                            <h5>Dimensions</h5>
                          </CardSubtitle>
                          <div className="mt-1" />

                          {part.dimensions.map((info, index) => {
                            return (
                              <Fragment key={index}>
                                <Table>
                                  <thead>
                                    <tr>
                                      <th>Qty</th>
                                      <th>Width</th>
                                      <th>Height</th>

                                      <th>Panel High</th>
                                      <th>Panels Wide</th>
                                      <th>Price</th>
                                      <th />
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <Input
                                          placeholder={info.qty}
                                          disabled
                                        />
                                      </td>
                                      <td>
                                        <Input
                                          placeholder={info.width}
                                          disabled
                                        />
                                      </td>
                                      <td>
                                        <Input
                                          placeholder={info.height}
                                          disabled
                                        />
                                      </td>

                                      <td>
                                        <Input
                                          placeholder={info.panelsH}
                                          disabled
                                        />
                                      </td>
                                      <td>
                                        <Input
                                          placeholder={info.panelsW}
                                          disabled
                                        />
                                      </td>
                                      <td>
                                        <Input
                                          disabled
                                          type="text"
                                          className="form-control"
                                          placeholder={
                                            '$' +
                                            order.linePrice[i][index].toFixed(
                                              2
                                            ) || 0
                                          }
                                        />
                                      </td>
                                      <td />
                                    </tr>

                                    <tr>
                                      <td>
                                        <strong>
                                          <p>Left Stile</p>
                                        </strong>
                                        <Input
                                          placeholder={info.leftStile}
                                          disabled
                                        />
                                      </td>
                                      <td>
                                        <strong>
                                          <p>Right Stile</p>
                                        </strong>
                                        <Input
                                          placeholder={info.rightStile}
                                          disabled
                                        />
                                      </td>
                                      <td>
                                        <strong>
                                          <p>Top Rail</p>
                                        </strong>
                                        <Input
                                          placeholder={info.topRail}
                                          disabled
                                        />
                                      </td>
                                      <td>
                                        <strong>
                                          <p>Bottom Rail</p>
                                        </strong>
                                        <Input
                                          placeholder={info.bottomRail}
                                          disabled
                                        />
                                      </td>
                                      <td>
                                        <strong>
                                          <p>Hori. Mid Rail</p>
                                        </strong>
                                        <Input
                                          placeholder={
                                            info.horizontalMidRailSize
                                          }
                                          disabled
                                        />
                                      </td>
                                      <td>
                                        <strong>
                                          <p>Vert. Mid Rail</p>
                                        </strong>
                                        <Input
                                          placeholder={info.verticalMidRailSize}
                                          disabled
                                        />
                                      </td>
                                    </tr>
                                    <tr />
                                  </tbody>
                                </Table>
                                <Row>
                                  <Col>
                                    <strong>Notes</strong>
                                    <Input disabled />
                                  </Col>
                                  <Col />
                                  <Col />
                                </Row>
                                <br />
                              </Fragment>
                            );
                          })}
                        </div>
                        <hr />
                        <hr />
                      </div>
                    ))}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col />
            <Col />
            <Col />
            <Col>
              <div><strong>Total:</strong> <Input placeholder={`$${order.total}`} disabled style={{ width: '200px' }} /></div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default DoorSelect;
