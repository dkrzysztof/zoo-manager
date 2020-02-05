import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import Store from '../../Store';

const AppBar = () => {
    const { changeStore} = useContext(Store);
    const handleLogout = () => {
        changeStore('isLogged', false);
        changeStore('me', null);
        window.location.reload();
    };

    return (
        <Menu size="massive" fluid widths={9}>
            <Menu.Item />
            <br></br>
            <Menu.Item
                icon="home"
                color="grey"
                as={NavLink}
                to="/"
                activeClassName="active"
                exact
            />
            <br></br>
            <Menu.Item
                icon="paw"
                color="green"
                as={NavLink}
                to="/animals"
                activeClassName="active"
                exact
                id="animalsNav"
            />
            <br></br>
            <Menu.Item
                icon="users"
                color="blue"
                as={NavLink}
                to="/workers"
                activeClassName="active"
                exact
            />
            <br></br>
            <Menu.Item
                icon="chess board"
                color="brown"
                as={NavLink}
                to="/enclosures"
                activeClassName="active"
                exact
                id="enclosureNav"
            />
            <br></br>
            <Menu.Item
                icon="doctor"
                color="grey"
                as={NavLink}
                to="/vets"
                activeClassName="active"
                exact
            />
            <br></br>
            <Menu.Item
                icon="setting"
                color="grey"
                as={NavLink}
                to="/settings"
                activeClassName="active"
                exact
            />
            <br></br>
            <Menu.Item
                color="red"
                as={Link}
                name="Log out"
                to="/"
                onClick={handleLogout}
            />

            <br></br>
            <Menu.Item />
            <br></br>
        </Menu>
    );
};

export default AppBar;
