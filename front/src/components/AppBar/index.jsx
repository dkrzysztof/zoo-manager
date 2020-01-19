import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const AppBar = () => {
  return (
      <Menu size ="massive" fluid widths={8}>
        <Menu.Item   /><br></br>
        <Menu.Item  icon="home" color='gray' as={NavLink} to="/" activeClassName="active" exact /><br></br>
        <Menu.Item  icon="paw" color='green' as={NavLink} to="/animals" activeClassName="active" exact /><br></br>
        <Menu.Item  icon="users" color='blue' as={NavLink} to="/workers" activeClassName="active" exact /><br></br>
        <Menu.Item  icon="chess board" color='brown' as={NavLink} to="/enclosures" activeClassName="active" exact /><br></br>
        <Menu.Item  icon="doctor" color='grey' as={NavLink} to="/vets" activeClassName="active" exact /><br></br>
        <Menu.Item  icon="setting" color='grey' as={NavLink} to="/settings" activeClassName="active" exact /><br></br>
        <Menu.Item  /><br></br>
      </Menu>
  );
};

export default AppBar;