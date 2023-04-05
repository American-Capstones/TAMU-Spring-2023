import { useLocation } from 'react-router-dom';
import { Breadcrumbs as BC, Link } from '@backstage/core-components';
import React from 'react';
import { Typography } from '@material-ui/core';

type Link = {
    url: string,
    name: string
}

export const Breadcrumbs = ({} : {}) => {
    const pathname = useLocation().pathname;
    let crumbs = pathname.split('/').slice(2).filter((crumb) => !['team', 'topic'].includes(crumb));

    const links = crumbs.slice(0, crumbs.length - 1);
    const current = crumbs.slice(-1)[0];

    let newLinks: Link[] = [];
    let aggregate = '';
    links.forEach((link) => {
        newLinks.push({
            url: `.${aggregate}/${link}`,
            name: link
        })
        aggregate = `${aggregate}/${link}`
    })

    return (
        <>
        {current &&
            <BC style={{
                color: 'white',
                marginLeft: 16,
                marginBottom: '1.28rem'
            }} separator={'/'}>
                {newLinks?.map((link, i) =>
                    <Link key={i} to={link.url} >{decodeURI(link.name)}</Link>
                )}
                <Typography>{decodeURI(current)}</Typography>
            </BC>
        }
        </>
    )
}
