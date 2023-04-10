import { BackButton } from "./BackButton";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from "@backstage/test-utils";
import { configure } from 'enzyme';
import React from 'react';

configure({ adapter: new Adapter() });

const loc = { pathname: '/dd/path1/path2' }
const root = { pathname: '/dd' }
const RouterDom = require('react-router-dom')
const mockedNav = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNav,
}));

describe('BackButton test suite', () => {
    it('should render', async () => {
        jest.spyOn(RouterDom, 'useLocation').mockImplementation(() => loc)
        await renderInTestApp(<BackButton />);
        expect(screen.getByTestId('ArrowBackIcon')).toBeInTheDocument();
    })

    it('should navigate to previous page when clicked', async () => {
        jest.spyOn(RouterDom, 'useLocation').mockImplementation(() => loc)
        await renderInTestApp(<BackButton />);
        const button = await screen.findByTestId('ArrowBackIcon');
        await userEvent.click(button);

        expect(mockedNav).toHaveBeenCalledWith('./path1');
    })

    it('should not render on the root of plugin', async () => {
        jest.spyOn(RouterDom, 'useLocation').mockImplementation(() => root)
        await renderInTestApp(<BackButton />);
        expect(screen.queryByTestId('ArrowBackIcon')).toBeNull();
    })
})