import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface FormProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
}

export const Form = ({ title, onSubmit, children }: FormProps) => {
  return (
    <StyledWrapper>
      <form className="form" onSubmit={onSubmit}>
        <p className="heading">{title}</p>
        {children}
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: white;
    padding: 2.5em;
    border-radius: 25px;
    transition: .4s ease-in-out;
    box-shadow: rgba(0, 0, 0, 0.4) 1px 2px 2px;
    width: 100%;
    max-width: 400px;
  }

  .heading {
    color: black;
    padding-bottom: 2em;
    text-align: center;
    font-weight: bold;
    font-size: 1.2em;
  }

  input, select {
    border-radius: 5px;
    border: 1px solid whitesmoke;
    background-color: whitesmoke;
    outline: none;
    padding: 0.7em;
    transition: .4s ease-in-out;
  
    &:focus {
      background: #ffffff;
      box-shadow: inset 2px 5px 10px rgba(0,0,0,0.3);
    }
  }

  button {
    margin-top: 2em;
    align-self: center;
    padding: 0.7em;
    padding-left: 1em;
    padding-right: 1em;
    border-radius: 10px;
    border: none;
    color: black;
    transition: .4s ease-in-out;
    box-shadow: rgba(0, 0, 0, 0.4) 1px 1px 1px;
    background-color: white;
    cursor: pointer;

    &:active {
      transition: .2s;
      transform: translateX(0em) translateY(0em);
      box-shadow: none;
    }
  }
`;