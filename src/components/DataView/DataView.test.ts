import { wrapInTestApp } from '@backstage/test-utils';
import {describe, expect, test } from '@jest/globals';
import { shallow, mount, render, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { lightTheme, darkTheme } from './GraphThemes';
import { DataView } from '../DataView';

let dataViewComponent = DataView;
configure({adapter: new Adapter()});

describe('DataView test suite', () => {
    test('loads correct theme values into graph', () => {
        const wrapper = mount(wrapInTestApp(dataViewComponent));
        console.log(wrapper.context())
        expect(wrapper.context().theme).toBeUndefined();
    });
});