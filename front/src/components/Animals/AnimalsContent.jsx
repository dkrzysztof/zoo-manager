import React from 'react';
import { Grid, GridColumn, Segment } from 'semantic-ui-react';
import ActionMenu from "../Utility/ActionMenu";
import setHeaders from '../../utils/setHeaders';
import axios from 'axios';
import AnimalsTable from './AnimalsTable';
import Store from '../../Store';

class AnimalsContent extends React.Component {
    state ={
        results: [],
    };

    static contextType = Store;
    
    animalsTableRef = React.createRef();

    getAnimals = async () => {
        await axios({
            method:'get',
            url: '/animals',
            headers: setHeaders(),
        }).then(
            response => { this.setState({ results: response.data});
            }, error => {
                console.log(error);
            }
        );
    }

    componentDidMount() {
        this.context.changeStore('selectionType', 'animal')
        this.getAnimals();
    }

    componentDidUpdate() {
        this.animalsTableRef.current.setState({ results: this.state.results });
    }

    render() {
        return (
            <Grid columns={16}>
                <GridColumn width={3}>
                    <ActionMenu/>
                </GridColumn>
                <GridColumn width={12}>
                    <Segment inverted color="grey">
                        <Segment>
                            <Grid columns = {16}>
                                <GridColumn width={2}>
                                    Nr
                                </GridColumn>
                                <GridColumn width={3}>
                                    Species
                                </GridColumn>
                                <GridColumn width={3}>
                                    Name
                                </GridColumn>
                                <GridColumn width={3}>
                                    Birth date
                                </GridColumn>
                                <GridColumn width={3}>
                                    Health
                                </GridColumn>
                                <GridColumn width={2}>
                                    Age
                                </GridColumn>
                            </Grid>
                        </Segment>
                        <AnimalsTable ref={this.animalsTableRef} />
                    </Segment>
                </GridColumn>
            </Grid>
        );
    }
}

export default AnimalsContent;
