import React from 'react';
import '../DinerForm/dinerForm.scss';
import DatePicker from '../DatePicker/DatePicker';


class DinerForm extends React.Component {
    state = {
        location: "",
        selectedDate: ((new Date()).getTime()) / 1000      //convert to firebase timestamp format
    }
    
    handleDateChange = (date) => {
        this.setState({
            selectedDate: date
        });
    };

    updateLocation = e => {
        this.setState({
            location: e.target.value
        });
    };

    handleSubmit = () => {
        console.log(this.state.selectedDate)
        this.props.history.push({
            pathname: '/chefs',
            search: `?location=${this.state.location}&date=${this.state.selectedDate}`
        });
    };

    render(){
        return (
            <section className="diner">
                <h2 className="diner__header">Get Started:</h2>
                <div className="diner__form-div">
                    <form onSubmit={this.handleSubmit} className="diner__form">
                        <h5 className="diner__location-header">Where are you located?</h5>
                        <input 
                            className="diner__input-location"
                            name="location"
                            type="text"
                            placeholder="City"
                            value={this.state.location}
                            onChange={this.updateLocation}/>
                        <h5 className="diner__date-header">When would you like your meal?</h5>
                        <div className="diner__day-picker">
                            <DatePicker/>
                        </div>
                        <button className="diner__button">Submit</button>
                    </form>
                </div>
             </section>
        );
    };
};
                
export default DinerForm