import React from 'react';
import {
    Container,
    Modal,
    Icon,
    ModalContent,
    Header,
    Segment,
    Grid,
} from 'semantic-ui-react';
import WorkerAddContent from '../Utility/WorkerModals/WorkerAddContent';
import WorkerRemoveContent from '../Utility/WorkerModals/WorkerRemoveContent';
import Store from '../../Store';

class WorkersContent extends React.Component {
    static contextType = Store;

    componentDidMount() {
        this.context.changeStore('selectionType', 'worker');
    }

    render() {
        return (
            <Grid columns={16}>
                <Grid.Column width={8} textAlign="center">
                    <Segment>
                        <Modal
                            size="tiny"
                            trigger={
                                <Container>
                                    <Icon
                                        name="add user"
                                        size="massive"
                                        color="green"
                                    ></Icon>
                                    <Header>Add Worker</Header>
                                </Container>
                            }
                        >
                            <ModalContent>
                                <WorkerAddContent />
                            </ModalContent>
                        </Modal>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={8} textAlign="center">
                    <Segment>
                        <Modal
                            size="tiny"
                            trigger={
                                <Container>
                                    <Icon
                                        name="user delete"
                                        size="massive"
                                        color="red"
                                    ></Icon>
                                    <Header>Remove Worker</Header>
                                </Container>
                            }
                        >
                            <ModalContent>
                                <WorkerRemoveContent />
                            </ModalContent>
                        </Modal>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

export default WorkersContent;
