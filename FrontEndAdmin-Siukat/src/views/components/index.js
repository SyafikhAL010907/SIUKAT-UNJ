import React  from 'react'
import { Input, FormFeedback } from 'reactstrap'
import InputDayPicker from './InputDayPicker'
import SummaryCmahasiswa from './SummaryCmahasiswa'
import DataTable from './DataTable'
import Loader from './Loader'
import DashboardChartMetadata from './DashboardChartMetadata'
import Exports from './Exports'

const money = value => /^[0-9]+$/.test(value) ? undefined : 'Selain angka (0-9) tidak diperbolehkan'

const InputBs = (props) => {
    const { input, meta: { error, warning} , ...rest } = props;
    return (
        <span>
            <Input {...input} {...rest} valid={((error || warning) && (false))}/>
            {((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
        </span>
    )
}

const InputFileBs = (props) => {
    const { input, meta: { error, warning} , ...rest } = props;
    delete input.value
    return (
        <span>
            <Input className="form-control" {...input} {...rest} valid={((error || warning) && (false))}/>
        </span>
    )
}

export {
    InputBs,
    InputFileBs,
    InputDayPicker,
    DataTable,
    Loader,
    SummaryCmahasiswa,
    money,
    Exports,

    DashboardChartMetadata,
}