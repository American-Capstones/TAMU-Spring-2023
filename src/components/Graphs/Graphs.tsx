import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { Box, Grid } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { lightTheme, darkTheme } from './GraphThemes';
import { GraphsProps } from '../../utils/types';

export const Graphs = ({ barData, lineData }: GraphsProps) => {
    const darkThemeMq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const dataTheme = darkThemeMq ? darkTheme : lightTheme;
    
    return (
        
        <Grid container item justifyContent='center' spacing={8}>
            <Grid item>
                <InfoCard variant='flex'>
                    <Box
                        style={{
                            width: "30rem",
                            height: "15rem"
                        }}>
                        <ResponsiveBar
                            colors={{scheme: 'red_blue'}}
                            data={barData}
                            indexBy="severity"
                            keys={["count"]}
                            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                            theme={dataTheme}
                            padding={0.2}
                            valueScale={{ type: 'linear' }}
                            indexScale={{ type: 'band', round: true }}
                            colorBy="indexValue"
                            defs={[
                                {
                                    id: 'dots',
                                    type: 'patternDots',
                                    background: 'inherit',
                                    color: '#38bcb2',
                                    size: 4,
                                    padding: 1,
                                    stagger: true
                                },
                                {
                                    id: 'lines',
                                    type: 'patternLines',
                                    background: 'inherit',
                                    color: '#eed312',
                                    rotation: -45,
                                    lineWidth: 6,
                                    spacing: 10
                                }
                            ]}
                            borderColor={{
                                from: 'color',
                                modifiers: [
                                    [
                                        'darker',
                                        1.6
                                    ]
                                ]
                            }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Severity',
                                legendPosition: 'middle',
                                legendOffset: 32
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Count',
                                legendPosition: 'middle',
                                legendOffset: -40
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            legends={[
                                {
                                    dataFrom: 'indexes',
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 120,
                                    translateY: 0,
                                    itemsSpacing: 2,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 0.85,
                                    symbolSize: 20,
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                            role="application"
                            ariaLabel="Nivo bar chart"
                            barAriaLabel={function (e) { return e.indexValue.toString() }}
                        />
                    </Box>
                </InfoCard>
            </Grid>
            <Grid item>
                <InfoCard variant='flex'>
                    <Box style={{
                        width:"30rem",
                        height:"15rem"
                    }}>
                        <ResponsiveLine
                            colors={{scheme: 'red_blue'}}
                            data={lineData}
                            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                            xScale={{ type: 'point' }}
                            yScale={{
                                type: 'linear',
                                min: 'auto',
                                max: 'auto',
                                stacked: true,
                                reverse: false
                            }}
                            theme={dataTheme}
                            yFormat=" >-.2f"
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Month',
                                legendOffset: 36,
                                legendPosition: 'middle'
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Count',
                                legendOffset: -40,
                                legendPosition: 'middle'
                            }}
                            pointSize={10}
                            pointColor={{ theme: 'background' }}
                            pointBorderWidth={2}
                            pointBorderColor={{ from: 'serieColor' }}
                            pointLabelYOffset={-12}
                            useMesh={true}
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 100,
                                    translateY: 0,
                                    itemsSpacing: 0,
                                    itemDirection: 'left-to-right',
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemOpacity: 0.75,
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemBackground: 'rgba(0, 0, 0, .03)',
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    </Box>
                </InfoCard>
            </Grid>
        </Grid>
    );
};


                