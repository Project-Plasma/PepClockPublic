import React from 'react';
import DateTimeField from 'react-bootstrap-datetimepicker';
import moment from 'moment';
import {WithContext as ReactTags} from 'react-tag-input';

class EventForm extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className="col-xs-12">

        <div className="row">
          <form className="col-lg-7">
            <div className="form-group">
              <label>Name your event</label>
              <input type="text" className="form-control" name="eventName" placeholder="e.g. Happy Birthday Lisa!" onChange={this.props.handleChange}/>
            </div>
            <div className="form-group">
              <label>Recipient's first name</label>
              <input type="text" className="form-control" name="firstName" placeholder="Lisa" onChange={this.props.handleChange}/>
            </div>
            <div className="form-group">
              <label>Recipient's last name</label>
              <input type="text" className="form-control" name="lastName" placeholder="Johnson" onChange={this.props.handleChange}/>
            </div>
            <div className="form-group">
              <label>Recipient's email</label>
              <input type="email" className="form-control" name="email" placeholder="lisa@gmail.com" onChange={this.props.handleChange}/>
            </div>
          </form>
        </div>

        <div className="row">
          <div className="col-lg-7">
            <div className="form-group">
              <label>Delivery date and time</label>
              <DateTimeField
                minDate={moment().subtract(1, 'days')}
                defaultText="Select the event date and time"
                onChange={this.props.handleDateChange}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-7">
            <div className="form-group">
              <label>Invite others by email</label>
              <ReactTags tags={this.props.tags}
                handleDelete={this.props.handleDelete}
                handleAddition={this.props.handleAddition}
                placeholder="Enter email or paste a list separated by commas"
                maxLength="50"
                delimiters={[13, 44]}
                classNames={{tagInputField: 'form-control input-md', tag: 'btn btn-info', remove: ''}}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={this.props.handleSubmit}>Create your event!</button>

      </div>
    );
  }
}

export default EventForm;
