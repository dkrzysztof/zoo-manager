import React from 'react';
import { Icon, Button, Segment, Modal } from 'semantic-ui-react';

class ActionMenu extends React.Component {
    state = { visible: false };

    render() {
        return (
            <Segment compact>
                <Modal
                    trigger={
                        <Button>
                            <Icon name="plus" size="huge" />
                        </Button>
                    }
                    content="Dodaj"
                ></Modal>
                <br></br>
                <br></br>
                <Modal
                    trigger={
                        <Button>
                            <Icon name="minus" size="huge" />
                        </Button>
                    }
                    content="Usuń"
                ></Modal>

                <br></br>
                <br></br>
                <Modal
                    trigger={
                        <Button>
                            <Icon name="edit outline" size="huge" />
                        </Button>
                    }
                    content="Zmień"
                ></Modal>
            </Segment>
        );
    }
}

export default ActionMenu;
