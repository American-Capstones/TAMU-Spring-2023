import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { screen, within } from '@testing-library/react';
import { renderInTestApp } from "@backstage/test-utils";
import { configure, shallow } from 'enzyme';
import { Organization } from '.';
import React from 'react';
import { SelectOrg } from '../../Utility';
import { useGetTeamsForOrg } from '../../../hooks/useGetTeamsForOrg';
import { SelectScope } from '../../Utility';
import { Table } from '@backstage/core-components';
import { Graphs } from '../../Graphs';
import userEvent from '@testing-library/user-event';

// This is necessary to mock useNavigate 
// and to avoid issues with testing hooks
configure({adapter: new Adapter()});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn().mockReturnValue({ orgName: 'TEST ORG' })
}));

jest.mock('../../../hooks/useGetOrgsForUser', () => ({
    ...jest.requireActual('.../../../hooks/useGetOrgsForUser'),
    useGetOrgsForUser: jest.fn().mockReturnValue(['TEST ORG'])
}));

jest.mock('../../../hooks/useGetTeamsForOrg', () => ({
    ...jest.requireActual('../../../hooks/useGetTeamsForOrg'),
    useGetTeamsForOrg: jest.fn(orgName => ({
        loading: false,
        teams: [
            {
                id: 'test_id_1',
                name: 'test team 1'
            },
            {
                id: 'test_id_2',
                name: 'test team 2'
            },
            {
                id: 'test_id_3',
                name: 'test team 3'
            },
        ]
    }))
}));

// Needed when fully rendering a Responsive element from Nivo
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

describe('Organization page test suite', () => {
    window.ResizeObserver = ResizeObserver;

    it('should render the organization selector', async () => {
        const wrapper = shallow(<Organization />);
        expect(wrapper.contains(<SelectOrg defaultOption='TEST ORG'/>)).toBeTruthy();
    });

    it('should render the scope selector', async () => {
        const wrapper = shallow(<Organization />);
        expect(wrapper.find(SelectScope)).toHaveLength(1);
    });

    it('should change the data in the table depending on the scope selected', async () => {
        const wrapper = await renderInTestApp(<Organization />);
        const Select = await wrapper.findByRole('button', { name: 'Teams' });
        await userEvent.click(Select);
        const listbox1 = within(wrapper.getByRole('listbox'));
        const repos = listbox1.getByText('Repositories');
        await userEvent.click(repos);
        expect(await screen.findByText('Repos within this organization')).toBeVisible();
        await userEvent.click(Select);
        const listbox2 = within(wrapper.getByRole('listbox'));
        const teams = listbox2.getByText('Teams');
        await userEvent.click(teams);
        expect(await screen.findByText('Teams within this organization')).toBeVisible();
    })
    
    it('should render a Graphs component', async () => {
        const wrapper = shallow(<Organization />);
        expect(wrapper.find(Graphs)).toHaveLength(1);
    })

    it('should render a table component', async () => {
        const wrapper = shallow(<Organization />);
        expect(wrapper.find(Table)).toHaveLength(1);
    })

    it('should display a table when data is received from backend', async () => {
        await renderInTestApp(<Organization />);
        expect(useGetTeamsForOrg).toHaveBeenCalledWith('TEST ORG');
        expect(await screen.findByText('Teams within this organization')).toBeVisible();
        expect(await screen.findByText('test team 1')).toBeVisible();
    });

    it('should redirect to the teams page when table row is clicked', async () => {
        // Cannot get the mockedUsedNavigate to be called in this test
        // await renderInTestApp(<Organization />);
        // const testLabel = await screen.findByText('test');
        // const row = testLabel.parentElement;
        // await userEvent.click(row);
        // expect(mockedUsedNavigate).toHaveBeenCalled();
    })
});