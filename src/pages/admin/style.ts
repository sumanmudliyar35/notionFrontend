import styled from "styled-components";
import { Button } from 'antd';


export const mainPageContainer = styled.div`
display: flex;
flex-direction: column;
gap: 10px;
`;




export const AddMemberButton = styled(Button)`
  width: fit-content;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
`;