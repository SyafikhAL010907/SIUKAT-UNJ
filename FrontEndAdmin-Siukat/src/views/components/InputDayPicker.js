import React from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput';
  
const currentYear = new Date().getFullYear();
// const fromMonth = new Date(1900, 0);
const toMonth = new Date(currentYear, 11);

// Component will receive date, locale and localeUtils props
const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
let YearMonthForm = (props) => {
  const { date, 
          // localeUtils,
          fromMonth,
          onChange } = props
          
  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleChange = function handleChange(e) {
    console.log(e.target)
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  }

  return (
    <div className="DayPicker-Caption">
      <select name="month" onChange={handleChange} value={date.getMonth()}>
        {months.map((month, i) => <option key={i} value={i}>{month}</option>)}
      </select>
      <select name="year" onChange={handleChange} value={date.getFullYear()}>
        {years.map((year, i) => <option key={i} value={year}>{year}</option>)}
      </select>
    </div>
  );
}

class InputDayPicker extends React.Component{  
  state = {
    fromMonth: new Date(this.props.startYear || currentYear, 0),
    month: new Date(this.props.startYear || currentYear, 0),
    // monthsID: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    weekdaysShortID: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
  }

  handleYearMonthChange = month => {
    this.setState({ month });
  }

  render(){    
    return (
      <div className="relative">
        <DayPickerInput
            {...this.props.input}
            placeholder={this.props.placeholder}
            autoComplete="off"
            className={this.props.className || "form-control"}
            format={"YYYY-MM-DD"}

            dayPickerProps={
              {
                weekdaysShort: this.state.weekdaysShortID,
                firstDayOfWeek: 1,
                months: months,
                month: this.state.month,
                fromMonth: this.state.fromMonth,
                toMonth: toMonth,
                captionElement: <YearMonthForm onChange={this.handleYearMonthChange} fromMonth={this.state.fromMonth}/>,
                footer: (
                  <div className="p-3 border-t border-gray-100 flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        this.props.input.onChange("");
                        // Use a little hack to close the overlay by triggering a click elsewhere or using internal ref if available
                        // But simple onChange("") usually works for clearing
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors py-1 px-3 border border-red-100 rounded-lg hover:bg-red-50"
                    >
                      <i className="fa fa-trash-o mr-1"></i> Hapus Tanggal
                    </button>
                  </div>
                )
              }
            }
            />
      </div>
    );
  }
}

export default InputDayPicker