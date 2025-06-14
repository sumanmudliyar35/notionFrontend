// src/pages/login/style.ts
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #2c2c2c;
`;

export const Card = styled.div`
  width: 360px;
  padding: 32px 24px;
  background: #202020;

  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

export const Title = styled.h2`
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  color: #888;
  margin-bottom: 24px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ForgotLink = styled.a`
  text-align: right;
  font-size: 12px;
  color: #1890ff;
  cursor: pointer;
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 16px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }

  &::before {
    margin-right: 8px;
  }

  &::after {
    margin-left: 8px;
  }
`;

export const LinkText = styled.p`
  font-size: 14px;
  margin-top: 24px;

  a {
    color: #1890ff;
    cursor: pointer;
    text-decoration: none;
  }
`;

export const Logo = styled.img`
  width: 150px
`;
