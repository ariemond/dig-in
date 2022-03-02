import React, {useState} from 'react';
import DateView from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../DatePicker/datepicker.scss';


function DatePicker() {

    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div className="date-picker">
            <DateView 
                selected={selectedDate} 
                onChange={date => setSelectedDate(date)}
                minDate={new Date()}
                className="date-picker__input"/>
        </div>
    );
};

export default DatePicker
