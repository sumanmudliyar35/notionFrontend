import styled from "styled-components";

export const FilterToggleContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  user-select: none;
`;

export const FilterToggleTrack = styled.div<{ enabled: boolean }>`
  width: 36px;
  height: 20px;
  background-color: ${({ enabled }) => (enabled ? '#4CAF50' : '#666')};
  border-radius: 20px;
  position: relative;
  transition: background-color 0.2s;
`;

export const FilterToggleThumb = styled.div<{ enabled: boolean }>`
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${({ enabled }) => (enabled ? '18px' : '2px')};
  transition: left 0.2s;
`;

