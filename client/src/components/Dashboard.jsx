import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import EventList from './EventList';
// TODO: Remove event fixture after replacing with real data
import eventFixture from '../../test/fixtures/event_list';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  componentDidMount () {
    // TODO: Fetch events for this user from DB
    this.setState({
      events: eventFixture
    });
  }

  render () {
    console.log(this.state.events);
    return (
      <div>
        <h1>Dashboard</h1>
        <Link to="/create">Create event</Link>
        {/* <EventList /> */}
      </div>
    );
  }
}

export default Dashboard;
