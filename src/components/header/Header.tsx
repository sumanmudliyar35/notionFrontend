import React from 'react';
import * as styled from './style';
import GreaterIcon from '../../assets/icons/GreaterIcon';
import LessthanIcon from '../../assets/icons/LessthanIcon';
import MenuIcon from '../../assets/icons/MenuIcon';

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const name= localStorage.getItem('name') || 'User';
  return (
    <styled.HeaderWrapper>
      <styled.ToggleButton onClick={onToggle}>
        {collapsed ? <MenuIcon /> : <LessthanIcon />}
      </styled.ToggleButton>
      <span>{name}</span>
    </styled.HeaderWrapper>
  );
};

export default Header;
