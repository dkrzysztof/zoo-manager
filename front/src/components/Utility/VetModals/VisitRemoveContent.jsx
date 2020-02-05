import React from 'react';
import { Container, Icon, Header, Button } from 'semantic-ui-react';
import Store from '../../../Store';
import axios from 'axios';
import setHeaders from '../../../utils/setHeaders';

class VisitRemoveContent extends React.Component {
    state ={
        id: ''
    }
  static contextType = Store;


  onButtonClick = async () => {
    await axios({
      url: `/vet-visits/${this.state.id}/vet`,
      method: 'delete',
      data: this.state,
      headers: setHeaders(),
    }).then(res => {console.log(res.status)}, err => {console.log(err)});
    };

    componentDidMount(){
        this.setState({id: this.context.selectionID});
    }

  render() {
    return( 
    <Container>
      <Container textAlign='center'>
      <Header size="large" textAlign="center">
      Remove Visit
      </Header>
      <Icon name="doctor" color="grey" size="massive" ></Icon>
      <Header size="medium" color="red">Are you sure, you want to remove selected visit?</Header>
      <Button type="submit" onClick={this.onButtonClick}>
                    Remove
                </Button>
      </Container>
      
    </Container>
      );
  }
}

export default VisitRemoveContent;