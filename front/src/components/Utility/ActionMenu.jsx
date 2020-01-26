import React from 'react';
import { Icon, Button, Segment, Modal, ModalContent } from 'semantic-ui-react';
import AnimalAddContent from './AnimalModals/AnimalAddContent';

class ActionMenu extends React.Component {
    state = { visible: false };

    render() {
        return (
            <Segment compact>
                <Modal
                    size="tiny"
                    trigger={
                        <Button>
                            <Icon name="plus" size="huge" />
                        </Button>
                    }
                >
                    <ModalContent>
                        <AnimalAddContent />
                    </ModalContent>
                </Modal>
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
