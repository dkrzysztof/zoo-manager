import React from 'react';
import { Grid, Segment, GridColumn } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import WorkerInfo from './WorkerInfo';
import NavButton from './NavButton';
import Store from '../../Store';

class HomepageContent extends React.Component {
    state = {};

    static contextType = Store;

    render() {
        if (!this.context.isLogged) return <Redirect to="/login" />;
        return (
            <Grid columns={3} divided>
                <Grid.Row>
                    <GridColumn>
                        <Segment>
                            <WorkerInfo />
                        </Segment>
                    </GridColumn>
                    <GridColumn>
                        <Segment>
                            <NavButton
                                icon="paw"
                                color="green"
                                description="Animals"
                                link="/animals"
                            />
                        </Segment>
                        <Segment>
                            <NavButton
                                icon="doctor"
                                color="grey"
                                description="Veterinary Visits"
                                link="/vets"
                            />
                        </Segment>
                    </GridColumn>
                    <GridColumn>
                        <Segment>
                            <NavButton
                                icon="users"
                                color="blue"
                                description="Zoo workers"
                                link="/workers"
                            />
                        </Segment>
                        <Segment>
                            <NavButton
                                icon="chess board"
                                color="brown"
                                description="Enclosures"
                                link="/enclosures"
                            />
                        </Segment>
                    </GridColumn>
                </Grid.Row>
            </Grid>
        );
    }
}

export default HomepageContent;
