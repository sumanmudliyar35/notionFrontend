import React from 'react';
import type { ReactNode } from 'react';

import * as styled from './style'

interface MainContentProps {
  children: ReactNode;
    collapsed: boolean;

}



const MainContent: React.FC<MainContentProps> = ({ children, collapsed }) => {
  return <styled.MainWrapper>{children}</styled.MainWrapper>;
};

export default MainContent;
