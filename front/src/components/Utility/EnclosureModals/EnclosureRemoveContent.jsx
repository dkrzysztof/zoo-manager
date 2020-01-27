import React from 'react';
import { Container, Icon, Header, Button } from 'semantic-ui-react';
import Store from '../../../Store';
import axios from 'axios';
import setHeaders from '../../../utils/setHeaders';

class EnclosureRemoveContent extends React.Component {
    state ={
        id: ''
    }
  static contextType = Store;


  onButtonClick = async () => {
    await axios({
      url: `/animal-places/${this.state.id}`,
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
      Remove Animal Place
      </Header>
      <Icon name="chess board" color="brown" size="massive" ></Icon>
      <Header size="medium" color="red">Are you sure, you want to remove selected animal place?</Header>
      <Button type="submit" onClick={this.onButtonClick}>
                    Remove
                </Button>
      </Container>
      
    </Container>
      );
  }
}

export default EnclosureRemoveContent;