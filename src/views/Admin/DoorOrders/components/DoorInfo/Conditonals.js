import React, { useState, Fragment, useEffect } from "react";
import {
    Label,
    Table,
    Input,
    Row,
    Col,
    Button
} from "reactstrap";

import 'semantic-ui-css/semantic.min.css';
import { Field } from "redux-form";
import { renderField, renderFieldDisabled } from '../RenderInputs/renderInputs'
import CopeDoor from './Cope/Door'
import MiterDoor from './Miter/Door'
import MTDoor from './MT/Door'

import CopeDF from './Cope/DF'
import MiterDF from './Miter/DF'
import MT_DF from './MT/DF'
import FaceFrame from '../DoorInfo/Face_Frame/FaceFrame'
import One_Piece_Door from './One_Piece/One_Piece'
import Slab_Door from './Slab_Door/Slab_Door'


const Conditionals = ({ formState, part, index, isValid, part_list }) => {

    if(formState && formState.part_list){


        //Doors
        if (formState.part_list[index].orderType.value === "Door") {

            if (formState.part_list[index].construction.value === "Cope") {
                return (
                    <CopeDoor
                        part={part}
                        index={index}
                        isValid={isValid}
                        part_list={part_list}
                        formState={formState}
                    />
                )
            }
        
            if(formState.part_list[index].construction.value === "M"){
                return (
                    <MiterDoor
                    part={part}
                    index={index}
                    isValid={isValid}
                    part_list={part_list}
                    formState={formState}
                  />
                )
            }
        
            if(formState.part_list[index].construction.value === "MT"){
                return (
                    <MTDoor
                    part={part}
                    index={index}
                    isValid={isValid}
                    part_list={part_list}
                    formState={formState}
                  />
                )
            }
        }

        //Drawer Fronts
        if (formState.part_list[index].orderType.value === "DF") {
            if (formState.part_list[index].construction.value === "Cope") {
                return (
                    <CopeDF
                        part={part}
                        index={index}
                        isValid={isValid}
                        part_list={part_list}
                        formState={formState}
                    />
                )
            }
            if (formState.part_list[index].construction.value === "M") {
                return (
                    <MiterDF
                        part={part}
                        index={index}
                        isValid={isValid}
                        part_list={part_list}
                        formState={formState}
                    />
                )
            }
            if (formState.part_list[index].construction.value === "MT") {
                return (
                    <MT_DF
                        part={part}
                        index={index}
                        isValid={isValid}
                        part_list={part_list}
                        formState={formState}
                    />
                )
            }
        }

        //Frame Only Doors
        if(formState.part_list[index].orderType.value === "Face_Frame"){
            return (
                <FaceFrame
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
            />
            )
        }


        //One Piece Doors
        if(formState.part_list[index].orderType.value === "One_Piece"){
            return (
                <One_Piece_Door
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
            />
            )
        }


        //Slab Doors
        if(formState.part_list[index].orderType.value === "Slab_Door"){
            return (
                <Slab_Door
                part={part}
                index={index}
                isValid={isValid}
                part_list={part_list}
                formState={formState}
            />
            )
        }









        else {
            return null
        }

       
    } else {
        return null
    }
    

}

export default Conditionals;