import React from 'react';
import { Container, Icon, Header} from 'semantic-ui-react';


class NavButton extends React.Component {
    state = {
        
    }

    handleClick = (e) => {
        e.preventDefault();
        window.location.href=this.props.link
    }
    
    render() {
        return (
            <Container textAlign='center' onClick={this.handleClick}>
               <Icon name={this.props.icon} size="massive" color={this.props.color}></Icon>
               <Header>{this.props.description}</Header>
            </Container>
        );
    }
}

export default NavButton;
