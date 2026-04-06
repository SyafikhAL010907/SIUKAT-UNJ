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
    fromMonth: new Date(this.props.startYear, 0),
    month: new Date(this.props.startYear, 0),
    // monthsID: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    weekdaysShortID: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
  }

  handleYearMonthChange = month => {
    this.setState({ month });
  }

  render(){    
    return (
      <DayPickerInput
          /* onDayClick={this.handleDayClick}
          selectedDays={this.state.selectedDay} */
          {...this.props.input}
          placeholder={this.props.placeholder}
          autoComplete="off"
          className="form-control"
          format={"DD MMMM YYYY"}

          dayPickerProps={
            {
              // months: this.state.monthsID,
              weekdaysShort: this.state.weekdaysShortID,
              firstDayOfWeek: 1,
              months: months,
              month: this.state.month,
              fromMonth: this.state.fromMonth,
              toMonth: toMonth,
              captionElement: <YearMonthForm onChange={this.handleYearMonthChange} fromMonth={this.state.fromMonth}/>
            }
          }
          />
    );
  }
}

export default InputDayPicker