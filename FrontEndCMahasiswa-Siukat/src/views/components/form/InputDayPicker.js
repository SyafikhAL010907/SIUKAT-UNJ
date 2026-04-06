import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
    formatDate,
    parseDate,
} from 'react-day-picker/moment';

import 'moment/locale/id';

const currentYear = new Date().getFullYear();
const fromMonth = new Date(1900, 0);
// const fromMonth = new Date(currentYear, 0);
const toMonth = new Date(currentYear, 11);
// const toMonth = new Date(currentYear + 10, 11);

// Component will receive date, locale and localeUtils props
const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

const weekdaysShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

let YearMonthForm = (props) => {
    const {
        date,
        // localeUtils,
        onChange,
    } = props;

    console.log(date);
    console.log(date.getFullYear());

    const years = [];
    for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
        years.push(i);
    }

    const handleChange = function handleChange(e) {
        const { year, month } = e.target.form;
        onChange(new Date(year.value, month.value));
    };

    return (
        <div className="DayPicker-Caption">
            <select name="month" onChange={handleChange} value={date.getMonth()}>
                {months.map((month, i) => (
                    <option key={i} value={i}>
                        {month}
                    </option>
                ))}
            </select>
            <select name="year" onChange={handleChange} value={date.getFullYear()}>
                {years.map((year, i) => (
                    <option key={i} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
};

class InputDayPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            month: fromMonth,
            selectedDay: undefined,
        };
    }

    handleYearMonthChange = (month) => {
        this.setState({ month });
    }

    handleDayChange = async (selectedDay) => {
        console.log(selectedDay);
        const { input } = this.props;
        await input.onChange(selectedDay);
    }

    render() {
        const { input } = this.props;
        console.log(input);
        return (
            <DayPickerInput
                {...input}
                onDayChange={this.handleDayChange}
                placeholder={this.props.placeholder}
                autoComplete="off"
                formatDate={formatDate}
                parseDate={parseDate}
                format={"DD MMMM YYYY"}
                inputProps={{
                    className: 'form-control',
                }}
                style={{ display: 'block' }}
                dayPickerProps={{
                    month: this.state.month,
                    weekdaysShort,
                    firstDayOfWeek: 1,
                    months,
                    fromMonth,
                    toMonth,
                    captionElement: ({ date, localeUtils }) => (
                        <YearMonthForm
                            date={date}
                            localeUtils={localeUtils}
                            onChange={this.handleYearMonthChange}
                        />
                    ),
                    locale: 'id',
                    localeUtils: MomentLocaleUtils,
                }}
            />
        );
    }
}

export default InputDayPicker;
