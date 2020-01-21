import React from 'react';
import { Container } from 'semantic-ui-react';
import AnimalPattern from './AnimalPattern';

class AnimalsTable extends React.Component {
  state = { 
      results: [] 
    };

  arrayToTable = arr => {
    let key = 0;
    return arr.map(elem => {
      return <AnimalPattern animal={elem} key={key++} />;
    });
  };

  render() {
    return <Container>{this.arrayToTable(this.state.results)}</Container>;
  }
}

export default AnimalsTable;