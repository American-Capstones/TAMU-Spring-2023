import React, { useEffect, useState } from 'react';
import { SelectOrg } from '../../Utility';
import { useLocation } from "react-router-dom";
import { Alert } from '@mui/material';
import { Typography, useMediaQuery } from '@material-ui/core';
import heroImage from '../../../assets/images/hero.png';

export const OrgChoice = () => {

    const desktopImageStyle: React.CSSProperties = {
        borderRadius: '100%',
        position: 'absolute',
        bottom: 0,
        right: 0,
        maxWidth: '30%',
        opacity: 0.75,
        backgroundColor: 'lightgray',
    }

    const mobileImageStyle: React.CSSProperties = {
        borderRadius: '100%',
        position: 'absolute',
        bottom: 0,
        right: 0,
        maxWidth: '80%',
        zIndex: -1,
        opacity: 0.10,
        backgroundColor: 'lightgray',
    }

    const desktopDivStyle: React.CSSProperties = {
        marginTop: '10vh',
    }

    const mobileDivStyle: React.CSSProperties = {
    }

    const location = useLocation();
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const [imageStyle, setImageStyle] = useState<React.CSSProperties>(desktopImageStyle);
    const [divStyle, setDivStyle] = useState<React.CSSProperties>(desktopDivStyle);

    useEffect(() => {
        if (isDesktop) {
            setImageStyle(desktopImageStyle);
            setDivStyle(desktopDivStyle);
        }
        else {
            setImageStyle(mobileImageStyle);
            setDivStyle(mobileDivStyle);
        }
    }, [isDesktop])


    return (
        <>
            {location.state && location.state.error &&
                <Alert severity='error' style={{ marginBottom: '1rem' }}>{location.state.error}</Alert>
            }
            <div style={divStyle}>
                <Typography variant='h4' style={{ marginBottom: "1.2rem", fontSize: '3.96em' }}>Let's roll up our sleeves,<br />and get to work!</Typography>
                <Typography variant='h4' style={{ marginBottom: "4rem", fontSize: '1.72em', color: '#777d87', maxWidth: '40ch' }}>Select an organization and squash those nasty dependency vulnerabilities</Typography>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    {location.state != undefined && location.state.error &&
                        <Alert severity='error'>{location.state.error}</Alert>
                    }
                    <SelectOrg />
                </div>
            </div>
            <div style={{
                width: '100%'
            }}>

                <div
                    style={imageStyle}
                >
                    <img style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '100%',
                        position: 'relative',
                        objectFit: 'cover',
                        objectPosition: 'bottom right',
                        overflow: 'visible',
                        // Mask the image so it fades from the bottom
                        maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                    }} src={heroImage} />
                </div>
            </div>
        </>
    );
};
