import React  from 'react';
import { Input, FormFeedback } from 'reactstrap';
import { SyaratFoto, SyaratScan } from './SyaratFile';
import { AlertFormLengkap, AlertFormBelumLengkap } from './AlertFormLengkap';
import InputDayPicker from './InputDayPicker';

const required = value => value ? undefined : 'Kolom wajib diisi';
const money = value => /^[0-9]+$/.test(value) ? undefined : 'Selain angka (0-9) tidak diperbolehkan';

const InputBs = (props) => {
    const { input, meta: { error, warning} , ...rest } = props;
    return (
        <span>
            <Input {...input} {...rest} valid={((error || warning) && (false))}/>
            {((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
        </span>
    );
};

const InputFileBs = (props) => {
    const { input, meta: { error, warning} , ...rest } = props;
    delete input.value;
    return (
        <span>
            <Input className="form-control" {...input} {...rest} valid={((error || warning) && (false))}/>
        </span>
    );
};

export {
    InputBs,
    InputFileBs,
    InputDayPicker,
    required,
    money,

    SyaratFoto,
    SyaratScan,
    AlertFormLengkap,
    AlertFormBelumLengkap,
};