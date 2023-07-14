import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React from 'react';

export const BackButton = ({ }: {}) => {
    const navigate = useNavigate();
    const pathname = useLocation().pathname;
    const end = pathname.split('/').length - 1;
    const onRoot: boolean = (end == 1);
    const lastPath = pathname.split('/').slice(2, end).join('/');

    const goBack = () => {
        navigate(`./${lastPath}`);
    }

    return (
        <>
            {!onRoot &&
                <ArrowBackIcon onClick={goBack} role='button' />
            }
        </>
    )
}