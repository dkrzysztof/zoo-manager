import React from 'react';
import { Grid, Segment, GridColumn } from 'semantic-ui-react';
import WorkerInfo from './WorkerInfo';
import NavButton from './NavButton';

class HomepageContent extends React.Component {
    state = {
        
    }
    
    render() {
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
                            <NavButton icon="paw" color ="green" description = "Animals"/>
                        </Segment>
                        <Segment>
                            <NavButton icon="doctor" color ="grey" description = "Veterinary Visits"/>
                        </Segment>
                    </GridColumn>
                    <GridColumn>
                        <Segment>
                            <NavButton icon="users" color ="blue" description = "Zoo workers"/>
                        </Segment>
                        <Segment>
                            <NavButton icon="chess board" color ="brown" description = "Enclosures"/>
                        </Segment>
                    </GridColumn>
                </Grid.Row>
            </Grid>
        );
    }
}

export default HomepageContent;
