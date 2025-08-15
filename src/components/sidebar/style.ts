import styled from 'styled-components';

export const SidebarWrapper = styled.aside<{ $collapsed: boolean }>`
  width: ${(props) => (props.$collapsed ? '10px' : '220px')};
  background: #202020;
  color: white;
  padding: 16px 8px;
  overflow-y: auto;
  // height:100vh;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  border-right: 1px solid #2c2c2c;

  &:hover {
    width: 220px;

    & > .hover-menu {
      display: flex;
    }
  }
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 8px;
`;

export const HoverMenu = styled(Menu)`
  display: none;
`;

export const MenuItem = styled.div`
  padding: 6px;
  border-radius: 6px;
  display: flex;
  cursor: pointer;
  font-size: 14px;
  color: #e0e0e0;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #2a2a2a;
    color: white;
  }
`;



export const menuChildren = styled.div`
display: flex;
flex-direction: column;
gap: 4px;
  padding-left: 24px;
  `;
