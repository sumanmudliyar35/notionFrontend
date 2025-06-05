import styled from 'styled-components';

export const LayoutWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden; // prevent scroll bleed to LayoutWrapper
`;

export const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

export const FixedSidebar = styled.div<{ collapsed: boolean }>`
  position: fixed;
  top: 60px; // match header height
  // left: 0;
  // bottom: 0;
  // width: ${(props) => (props.collapsed ? '60px' : '220px')};
  // background: rgb(32, 32, 32);
  // color: white;
  // transition: width 0.3s ease;
  // z-index: 999;
  // overflow-y: auto;
`;

export const MainContentWrapper = styled.main<{ collapsed: boolean }>`
  margin-top: 60px; // leave space for header
  margin-left: ${(props) => (props.collapsed ? '60px' : '220px')};
  padding: 16px;
  flex: 1;
  overflow: auto;
  height: calc(100vh - 60px);
`;
