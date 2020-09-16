import React, { Fragment } from 'react';
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput
} from 'reactstrap';
import DropdownList from 'react-widgets/lib/DropdownList';
import Multiselect from 'react-widgets/lib/Multiselect';
import 'react-widgets/dist/css/react-widgets.css';
import { Checkbox as CheckboxUI } from 'semantic-ui-react';


export const renderMultiSelect = ({
  input,
  data,
  valueField,
  textField,
  edit,
  meta: { touched, error, warning }
}) => (
  <div>
    <Multiselect
      {...input}
      onBlur={() => input.onBlur()}
      value={input.value || []} // requires value to be an array
      data={data}
      valueField={valueField}
      textField={textField}
      placeholder="Add Misc Items"
      disabled={edit}
    />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </div>
);

export const renderDropdownListFilter = ({
  input,
  data,
  valueField,
  textField,
  edit,
  meta: { touched, error, warning }
}) => (
  <div>
    <DropdownList
      {...input}
      data={data}
      valueField={valueField}
      textField={textField}
      placeholder="Select"
      onChange={input.onChange}
      filter
      disabled={edit}
    />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </div>
);


export const renderDropdownList = ({
  input,
  data,
  valueField,
  textField,
  edit,
  meta: { touched, error, warning }
}) => (
  <div>
    <DropdownList
      {...input}
      data={data}
      valueField={valueField}
      textField={textField}
      placeholder="Select"
      onChange={input.onChange}
      disabled={edit}
    />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </div>
);

export const renderField = ({
  input,
  edit,
  meta: { touched, error, warning },
  ...custom
}) => (
  <Fragment>
    <Input {...input} disabled={edit} autoComplete="new-password" />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);

export const renderSwitch = ({
  input,
  edit,
  meta: { touched, error, warning },
  ...custom
}) => (
  <Fragment>
    <CustomInput type="switch" {...input} disabled={edit} autoComplete="new-password" />
    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);

export const renderPrice = ({
  input,
  props,
  edit,
  meta: { touched, error, warning },
  ...custom
}) => (
  <Fragment>
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <Input {...input} {...custom} disabled={edit} autocomplete="new-password" />
    </InputGroup>

    {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);


export const renderCheckboxToggle = ({
  input: { value, onChange, ...input },
  edit,
  meta: { touched, error },
  ...rest
}) => (
  <div>
    <CheckboxUI
      toggle
      {...input}
      {...rest}
      defaultChecked={!!value}
      checked={value ? true : false}
      onChange={(e, data) => onChange(data.checked)}
      type="checkbox"
      disabled={edit}
    />
    {touched && error && <span>{error}</span>}
  </div>
);

export const renderCheckbox = ({
  input: { value, onChange, ...input },
  meta: { touched, error },
  ...rest
}) => (
  <div>
    <CheckboxUI
      {...input}
      {...rest}
      defaultChecked={!!value}
      onChange={(e, data) => onChange(data.checked)}
      type="checkbox"

    />
    {touched && error && <span>{error}</span>}
  </div>
);

export const renderFieldDisabled = ({ input, props, meta: { touched, error, warning }, ...custom }) => (
  <Fragment>
    <Input {...input} {...custom} disabled style={{ display: 'none' }} />
    {touched &&
            ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                (warning && <span style={{ color: 'red' }}>{warning}</span>))}
  </Fragment>
);