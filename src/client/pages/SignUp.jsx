import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Form, Grid, Header, Segment,
} from 'semantic-ui-react';

class SignUp extends React.Component {
  static propTypes = {
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  };

  render() {
    return (
      <div className='signup-container'>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Form size='large' className='signup-form'>
              <Segment raised>
                <Header as='h2' textAlign='center'>
                  REGISTER
                </Header>
                <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' required/>
                <Form.Input fluid icon='at' iconPosition='left' placeholder='E-mail address' value={this.props.email} readOnly disabled/>
                <Form.Input fluid placeholder='First Name' defaultValue={this.props.firstName}/>
                <Form.Input fluid placeholder='Last Name' defaultValue={this.props.lastName}/>
                <Form.Input fluid placeholder='Invitation Code'/>
                <Button fluid size='large'>
                  Submit
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default SignUp;
