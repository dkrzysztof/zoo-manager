import React from 'react';
import { Icon, Button, Segment, Modal, ModalContent } from 'semantic-ui-react';
import Store from '../../Store';
import AnimalAddContent from './AnimalModals/AnimalAddContent';
import AnimalRemoveContent from './AnimalModals/AnimalRemoveContent';
import AnimalModifyContent from './AnimalModals/AnimalModifyContent';
import EnclosureAddContent from './EnclosureModals/EnclosureAddContent';
import EnclosureRemoveContent from './EnclosureModals/EnclosureRemoveContent';
import EnclosureModifyContent from './EnclosureModals/EnclosureModifyContent';
import WorkerAddContent from './WorkerModals/WorkerAddContent';
import WorkerRemoveContent from './WorkerModals/WorkerRemoveContent';
import WorkerModifyContent from './WorkerModals/WorkerModifyContent';

class ActionMenu extends React.Component {
    state = { visible: false };
    static contextType = Store;

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
                        {this.context.selectionType === 'animal' ? <AnimalAddContent /> : null}
                        {this.context.selectionType === 'enclosure' ? <EnclosureAddContent /> : null}
                        {this.context.selectionType === 'worker' ? <WorkerAddContent /> : null}
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
                >
                    <ModalContent>
                        {this.context.selectionType === 'animal' ? <AnimalRemoveContent /> : null}
                        {this.context.selectionType === 'enclosure' ? <EnclosureRemoveContent /> : null}
                        {this.context.selectionType === 'worker' ? <WorkerRemoveContent /> : null}
                    </ModalContent> 
                </Modal>
                <br></br>
                <br></br>
                <Modal
                    trigger={
                        <Button>
                            <Icon name="edit outline" size="huge" />
                        </Button>
                    }
                >
                    <ModalContent>
                    {this.context.selectionType === 'animal' ? <AnimalModifyContent /> : null}
                        {this.context.selectionType === 'enclosure' ? <EnclosureModifyContent /> : null}
                        {this.context.selectionType === 'worker' ? <WorkerModifyContent /> : null}
                    </ModalContent> 
                </Modal>
            </Segment>
        );
    }
}

export default ActionMenu;
