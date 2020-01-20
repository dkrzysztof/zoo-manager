import React from 'react';
import {Icon, Button, Segment} from 'semantic-ui-react';

class ActionMenu extends React.Component {

    
    render() {
        return (
            <Segment compact >
                <Button>
                    <Icon name="plus" size="huge"/>
                </Button>
                <br></br>
                <br></br>
                <Button>
                    <Icon name="minus" size="huge"/>
                </Button>
                <br></br>
                <br></br>
                <Button>
                    <Icon name="edit outline" size="huge" />
                </Button>

            </Segment>
        );
    }
}

export default ActionMenu;