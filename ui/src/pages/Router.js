import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Thermostat from './Thermostat/ThermostatController';

class Routing extends React.Component {
  componentDidUpdate(prevProps) {
    const { history, currentUrl } = this.props;
    if (prevProps.currentUrl !== currentUrl) {
      history.push(currentUrl);
    }
  }

  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/thermostat" component={Thermostat} />
          <Redirect from="*" to="/thermostat" />
        </Switch>
      </main>
    );
  }
}
const Navigation = withRouter(Routing);
const mapStateToProps = (state) => ({
  currentUrl: state.application.store.currentUrl,
});
const ConnectedNavigation = connect(mapStateToProps)(Navigation);

export default () => (
  <Router>
    <ConnectedNavigation />
  </Router>
);
