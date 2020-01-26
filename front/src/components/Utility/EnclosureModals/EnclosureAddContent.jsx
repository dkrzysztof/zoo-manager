import React from 'react';
import { Container, Icon, Header } from 'semantic-ui-react';
import Store from '../../../Store';


class EnclosureAddContent extends React.Component {

  static contextType = Store;


  componentDidMount(){
    
  }


  render() {
    return( 
    <Container>
      <Container textAlign='center'>
      <Header size="large" textAlign="center">
      Add New Animal
      </Header>
      <Icon name="paw" color="green" size="massive" textAlign="center"></Icon>
      </Container>
      
    </Container>
      );
  }
}

export default EnclosureAddContent;