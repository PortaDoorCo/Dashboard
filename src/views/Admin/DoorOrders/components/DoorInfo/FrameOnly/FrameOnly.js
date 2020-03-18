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
import { Field } from "redux-form";
import {
  getWoodtypes,
  get_Face_Frame_Designs,
  get_Face_Frame_Top_Rails,
  getFurnitureFeet,
  getEdges,
  getPanels,
  getAppliedMoulds,
  getFinish
} from "../../../../../../redux/part_list/actions";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from "js-cookie";
import { renderMultiSelect, renderDropdownList, renderDropdownListFilter, renderField } from '../../RenderInputs/renderInputs'

const required = value => (value ? undefined : 'Required');


class Frame_Only extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    const cookie = await Cookies.get("jwt");
    const {
      getWoodtypes,
      get_Face_Frame_Designs,
      get_Face_Frame_Top_Rails,
      getFurnitureFeet,
      getEdges,
      getPanels,
      getAppliedMoulds,
      getFinish
    } = this.props;

    if(cookie){
      await getWoodtypes(cookie);
      await get_Face_Frame_Designs(cookie);
      await get_Face_Frame_Top_Rails(cookie);
      await getFurnitureFeet(cookie);
      await getEdges(cookie);
      await getPanels(cookie);
      await getAppliedMoulds(cookie);
      await getFinish(cookie);
      
    } else {
      alert('not logged in')
    }
  }


  render() {
    const {
      part,
      woodtypes,
      face_frame_designs,
      face_frame_top_rails,
      furniture_feets,
      edges,
      panels,
      applied_moulds,
      finishes
    } = this.props;
    return (
      <div>
        <Row>
          <Col xs="4">
            <FormGroup>
              <Label htmlFor="woodtype">Woodtype</Label>
              <Field
                name={`${part}.woodtype`}
                component={renderDropdownListFilter}
                data={woodtypes}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>

          <Col xs="4">
            <FormGroup>
              <Label htmlFor="design">Design</Label>
              <Field
                name={`${part}.design`}
                component={renderDropdownListFilter}
                data={face_frame_designs}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>

          <Col xs="4">
            <FormGroup>
              <Label htmlFor="mould">Edge</Label>
              <Field
                name={`${part}.edges`}
                component={renderDropdownList}
                data={edges}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>

        <Col xs="6">
            <FormGroup>
              <Label htmlFor="hinges">Top Rail Design</Label>
              <Field
                name={`${part}.face_frame_top_rail`}
                component={renderDropdownList}
                data={face_frame_top_rails}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>


          <Col xs="6">
            <FormGroup>
              <Label htmlFor="hinges">Furniture Feet</Label>
              <Field
                name={`${part}.furniture_feets`}
                component={renderDropdownList}
                data={furniture_feets}
                valueField="value"
                textField="NAME"
                validate={required}
              />
            </FormGroup>
          </Col>

        </Row>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  woodtypes: state.part_list.woodtypes,
  face_frame_designs: state.part_list.face_frame_designs,
  face_frame_top_rails: state.part_list.face_frame_top_rails,
  furniture_feets: state.part_list.furniture_feets,
  edges: state.part_list.edges,
  panels: state.part_list.panels,
  profiles: state.part_list.profiles,
  applied_moulds: state.part_list.applied_moulds,
  finishes: state.part_list.finishes
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getWoodtypes,
      get_Face_Frame_Designs,
      get_Face_Frame_Top_Rails,
      getFurnitureFeet,
      getEdges,
      getPanels,
      getAppliedMoulds,
      getFinish
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Frame_Only);
