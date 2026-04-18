import React from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import moment from "moment";

const currentYear = new Date().getFullYear();
// const fromMonth = new Date(1900, 0);
const toMonth = new Date(currentYear, 11);

// Component will receive date, locale and localeUtils props
const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
let YearMonthForm = (props) => {
  const {
    date,
    // localeUtils,
    fromMonth,
    onChange,
  } = props;

  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleChange = function handleChange(e) {
    console.log(e.target);
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
  state = {
    fromMonth: new Date(this.props.startYear || currentYear, 0),
    month: new Date(this.props.startYear || currentYear, 0),
    // monthsID: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    weekdaysShortID: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  };

  handleYearMonthChange = (month) => {
    this.setState({ month });
  };

  render() {
    const { value } = this.props.input;
    const formattedValue = value ? moment(value).format("YYYY-MM-DD") : "";

    return (
      <div
        className={`relative ${this.props.disabled ? "cursor-not-allowed text-gray-400" : ""}`}
      >
        <DayPickerInput
          value={formattedValue}
          onBlur={this.props.input.onBlur}
          onFocus={this.props.input.onFocus}
          onDayChange={(day) => {
            if (!this.props.disabled) {
              // Kirim balik dalam format string YYYY-MM-DD biar konsisten dengan initialValues
              this.props.input.onChange(
                day ? moment(day).format("YYYY-MM-DD") : "",
              );
            }
          }}
          placeholder={this.props.placeholder}
          autoComplete="off"
          format={"YYYY-MM-DD"}
          component={React.forwardRef((props, ref) => (
            <input
              {...props}
              ref={ref}
              disabled={this.props.disabled}
              readOnly={this.props.disabled}
              className={`${props.className} ${this.props.disabled ? "bg-gray-100 cursor-not-allowed opacity-75" : ""}`}
            />
          ))}
          className={this.props.className || "form-control"}
          dayPickerProps={{
            onDayClick: (day, modifiers) => {
              if (this.props.disabled || modifiers.disabled) return;
            },
            weekdaysShort: this.state.weekdaysShortID,
            firstDayOfWeek: 1,
            months: months,
            month: this.state.month,
            fromMonth: this.state.fromMonth,
            toMonth: toMonth,
            captionElement: (
              <YearMonthForm
                onChange={this.handleYearMonthChange}
                fromMonth={this.state.fromMonth}
              />
            ),
            footer: !this.props.disabled && (
              <div className="p-3 border-t border-gray-100 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    this.props.input.onChange("");
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors py-1 px-3 border border-red-100 rounded-lg hover:bg-red-50"
                >
                  <i className="fa fa-trash-o mr-1"></i> Hapus Tanggal
                </button>
              </div>
            ),
          }}
        />
      </div>
    );
  }
}

export default InputDayPicker;
