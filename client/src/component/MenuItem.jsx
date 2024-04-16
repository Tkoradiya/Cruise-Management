// MenuItem.js
import React from 'react';

const MenuItem = ({ label, onClick }) => {
    return <div className="menu-item" onClick={onClick}>{label}</div>;
}

export default MenuItem;
