import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header : React.FC = () => {
    return (
        <header className="header">
            <div className= "header-logo"> Bitcoin Explorer</div>
            <nav className= "header-nav">
                <ul>
                    <li><a href='/'>Home</a></li>
                    <li><a href="/metrics">Metrics</a></li>
                    <li><a href="/about">About</a></li>
                    <li><Link to="/prices">Prices</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;