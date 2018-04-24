import React from 'react';

import Layout from '../../components/layout/Layout';
import Pagination from '../../components/pagination/Pagination';
import EditBox from '../../components/edit-box/EditBox';
import ConfirmBox from '../../components/confirm-box/ConfirmBox';

import gs from '../../components/global.css';
import s from './InvitationPage.css';
import apiFetch from "../../utils/ApiFetch";
import Constants from "../../config/Constants";
import cx from "classnames";

export default class InvitationPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      invitations: [],
    };
  }

  fetchInvitations() {
    apiFetch('GET', `${Constants.API_INVITATION}`)
      .then(json => this.setState({
        invitations: json,
      }));
  }

  onAccept(invitation) {
    const { key } = invitation;
    apiFetch('POST', `${Constants.API_INVITATION}/${key}/accept`)
      .then(json => {
        console.log('>>accept<<', json);
        this.fetchInvitations();
      });
  }

  onDecline(invitation) {
    const { key } = invitation;
    apiFetch('POST', `${Constants.API_INVITATION}/${key}/decline`)
      .then(json => {
        console.log('>>decline<<', json);
        this.fetchInvitations();
      });
  }

  componentWillMount() {
    this.fetchInvitations();
  }


  render() {
    const {invitations} = this.state;
    console.log('>>invitation<<', invitations);
    return (
      <Layout loggedIn>
        <div className={gs.adminRoot}>
          <div className={gs.adminContainer}>
            <table className={gs.dataTable}>
              <thead>
              <tr>
                <th>Requesters' name</th>
                <th>Student's name</th>
                <th>Requested at</th>
                <th>Status</th>
                <th/>
              </tr>
              </thead>
              <tbody>
              {
                (invitations || []).map(invitation => {
                  return (
                    <tr key={invitation.key}>
                      <td className={gs.nameCell}>
                        {invitation.inviter.name}
                      </td>
                      <td className={gs.idCell}>
                        {invitation.patient.firstName}
                        {' '}
                        {invitation.patient.lastName}
                      </td>
                      <td>
                        {new Date(invitation.created_at).toLocaleString()}
                      </td>
                      <td>
                        {Constants.LOCALIZED_STATUS[invitation.status]}
                      </td>
                      { invitation.status === 'Pending' ? (
                        <td>
                          <button
                            className={gs.shadowButton}
                            onClick={() => this.onAccept(invitation)}
                          >
                            Accept
                          </button>
                        </td>
                      ) : null}
                      { invitation.status !== 'Pending' ? (
                        <td colSpan={2} />
                      ) : null}
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    );
  }

};