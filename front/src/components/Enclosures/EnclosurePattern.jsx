import React from 'react';
import { Segment, Grid, GridColumn, Container } from 'semantic-ui-react';
import Store from '../../Store';

class EnclosurePattern extends React.Component {
    state = {
        selected: false,
    };

    static contextType = Store;

    handleClick = async () => {
        let isSelected = !this.state.selected;
        this.setState({ selected: isSelected });
        await this.context.changeStore(
            'selectionID',
            this.props.enclosure.place_id
        );
        await this.context.changeStore('selectionType', 'enclosure');
    };

    render() {
        return (
            <Container onClick={this.handleClick}>
                {this.context.selectionID !== this.props.enclosure.place_id ? (
                    <Segment>
                        <Grid columns={12}>
                            <GridColumn width={2}>
                                {this.props.enclosure.place_id}
                            </GridColumn>
                            <GridColumn width={6}>
                                {this.props.enclosure.name}
                            </GridColumn>
                            <GridColumn width={4}>
                                {this.props.enclosure.place_condition}
                            </GridColumn>
                            <GridColumn width={4}>
                                {this.props.enclosure.capacity}
                            </GridColumn>
                        </Grid>
                    </Segment>
                ) : (
                    <Segment inverted>
                        <Grid columns={12}>
                            <GridColumn width={2}>
                                {this.props.enclosure.place_id}
                            </GridColumn>
                            <GridColumn width={6}>
                                {this.props.enclosure.name}
                            </GridColumn>
                            <GridColumn width={4}>
                                {this.props.enclosure.place_condition}
                            </GridColumn>
                            <GridColumn width={4}>
                                {this.props.enclosure.capacity}
                            </GridColumn>
                        </Grid>
                    </Segment>
                )}
            </Container>
        );
    }
}

export default EnclosurePattern;
