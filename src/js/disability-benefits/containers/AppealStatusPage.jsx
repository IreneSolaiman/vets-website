import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import moment from 'moment';
import _ from 'lodash';

import { getAppeals } from '../actions';
import AskVAQuestions from '../components/AskVAQuestions';
import { appealStatusDescriptions } from '../utils/appeal-helpers.jsx';

class AppealStatusPage extends React.Component {
  componentDidMount() {
    if (!this.props.appeal) {
      this.props.getAppeals();
    }
  }

  renderStatusNextAction(lastEvent) {
    const eventType = lastEvent.type;
    const { nextAction } = appealStatusDescriptions[eventType];
    const className = `next-action ${eventType}`;
    let title = nextAction.title;

    switch (eventType) {
      case 'form9':
        break;
      case 'soc':
        title = `${title} ${moment(lastEvent.date).add(60, 'days').format('MMM DD, YYYY')}`;
        break;
      default:
        break;
    }

    return (
      <div className={className}>
        <h5>{title}</h5>
        {nextAction.description}
      </div>
    );
  }

  renderPreviousActivity(lastEvent, eventHistory) {
    if (lastEvent.type === 'nod') {
      return (
        <div>
          <p>
            The NOD is the first step in your appeal. As your appeal moves through the process, the history of your appeal will be added here. On average, Veterans with appeals in the NOD stage, wait about 532 days for VBA to complete the necessary action.
          </p>
        </div>
      );
    }

    return (
      <table className="events-list">
        <tbody>
          {eventHistory.map((e, i) => {
            return (
              <tr key={i}>
                <td><i className="fa fa-check-circle"></i></td>
                <td className="date">
                  <strong>{moment(e.date).format('MMM DD, YYYY')}</strong>
                </td>
                <td>{appealStatusDescriptions[e.type].status.title}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  render() {
    if (!this.props.appeal) {
      return null;
    }

    const { appeal } = this.props;
    const events = _.orderBy(appeal.attributes.events, [(e) => {
      return moment(e.date).unix();
    }], ['desc']);
    const lastEvent = events[0];
    const { status } = appealStatusDescriptions[lastEvent.type];

    return (
      <div className="claims-status">
        <div className="row">
          <div>
            <h1>Your Compensation Appeal Status</h1>
            <p>This information is accurate as of {moment().format('MMM DD, YYYY')}</p>
          </div>
        </div>
        <div className="row">
          <div className="small-12 usa-width-two-thirds medium-8 columns">
            <div className="row">
              <div className="next-action-container">
                {this.renderStatusNextAction(lastEvent)}
              </div>
            </div>
            <div className="row">
              <div className="last-status">
                <div className="content">
                  <i className="fa fa-check-circle"></i>
                  <h5>{status.title}</h5>
                  <strong>{moment(lastEvent.date).format('MMM DD, YYYY')}</strong>

                  {status.description}
                  <Link to="appeals/learn-more">Learn more about the appeals process</Link>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="previous-activity">
                <h4>Previous Activity for Your Appeal</h4>
                {this.renderPreviousActivity(lastEvent, events.slice(1))}
              </div>
            </div>
          </div>
          <div className="small-12 usa-width-one-third medium-4 columns">
            <AskVAQuestions/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const claimsState = state.disability.status;
  const appeal = claimsState.claims.appeals.filter(a => {
    return a.id === ownProps.params.id;
  })[0];

  return {
    appeal,
  };
}

const mapDispatchToProps = {
  getAppeals,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppealStatusPage));

export { AppealStatusPage };
