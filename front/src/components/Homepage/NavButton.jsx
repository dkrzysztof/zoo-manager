import React from 'react';
import { Container, Icon, Header} from 'semantic-ui-react';

class NavButton extends React.Component {
    state = {
        
    }
    
    render() {
        return (
            <Container textAlign='center'>
               <Icon name={this.props.icon} size="massive" color={this.props.color}></Icon>
               <Header>{this.props.description}</Header>
            </Container>
        );
    }
}

export default NavButton;
