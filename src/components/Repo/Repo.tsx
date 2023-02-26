import React from 'react';
import { Grid } from '@material-ui/core';
import {
  InfoCard, 
  TabbedLayout,
} from '@backstage/core-components';
import { ExampleFetchComponent } from '../ExampleFetchComponent';



export const Repo = ({  }: { }) => {

  return (
    <div>
        <h1>Repository Vulnerabilities</h1>
        <Grid container spacing={3}>
            <Grid item xs={6}>
            <InfoCard title="Critical">
                <ExampleFetchComponent />
            </InfoCard>
            </Grid>
            <Grid item xs={6}>
            <InfoCard title="High">
                <ExampleFetchComponent />
            </InfoCard>
            </Grid>
            <Grid item xs={6}>
            <InfoCard title="Moderate">
                <ExampleFetchComponent />
            </InfoCard>
            </Grid>
            <Grid item xs={6}>
            <InfoCard title="Low">
                <ExampleFetchComponent />
            </InfoCard>
            </Grid>
        </Grid>
    </div> 
  );
};