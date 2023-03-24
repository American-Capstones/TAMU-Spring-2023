import React from 'react';

type ErrorMessage = {
    message: string;
}

export const Error = ({ message }: ErrorMessage) => { 
    return (
        <>
            <div style={{ alignItems: 'center', justifyContent: 'center'}}>
                <h1>Error - Failed to retrieve data</h1>
                <div>{message}</div>
            </div>
        </>
    )
};