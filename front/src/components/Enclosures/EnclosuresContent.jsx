import React from 'react';
import {  Grid, GridColumn, Segment } from 'semantic-ui-react';
import ActionMenu from "../Utility/ActionMenu";


class EnclosuresContent extends React.Component {
    state = {
        
    }
    
    render() {
        return (
            <Grid columns={16}>
                <GridColumn width={3}>
                    <ActionMenu />
                </GridColumn>
                <GridColumn width={12}>
                    <Segment inverted color="grey">
                        
                    </Segment>
                </GridColumn>
            </Grid>
        );
    }
}

export default EnclosuresContent;
