import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useEffect, useState } from 'react';
import HighchartsMore from 'highcharts/highcharts-more'
import { Stack } from '@chakra-ui/react';
import { MultiSelect } from 'chakra-multiselect';
import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk/react';
import { Action, RuntimeFilterOp } from '@thoughtspot/visual-embed-sdk';

export default function WordCloudDemo(props){
    const {
        tsURL
    }=props
    const [sales,setSales] = useState(0)
    const [basketSize,setBasketSize] = useState(0)
    const [numberOfCustomers,setNumberOfCustomers] = useState(0)

    const [region,setRegion] = useState('west')
    HighchartsMore(Highcharts)

    var gaugeMap = [
        {name:'Sales',value: sales,max:10000000,prefix:'$'},
        {name: 'Number of Transactions', value: basketSize,max:200000,prefix:''},
        {name:'Number of Customers', value: numberOfCustomers,max:5000,prefix:''}
    ]
    let allOptions = []
    for (var kpi of gaugeMap){
        let options = {
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false,
                height: '80%',
            },
        
            title: {
                text: kpi.name
            },
        
            pane: {
                startAngle: -90,
                endAngle: 89.9,
                background: null,
                center: ['50%', '50%'],
                size: '90%'
            },
        
            // the value axis
            yAxis: {
                min: 0,
                max: kpi.max,
                tickPixelInterval: 40,
                tickPosition: 'inside',
                tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
                tickLength: 20,
                tickWidth: 2,
                minorTickInterval: null,
                labels: {
                    distance: 20,
                    style: {
                        fontSize: '14px'
                    }
                },
                plotBands: [{
                    from: 0,
                    to: kpi.max*.75,
                    color: '#DF5353', // green
                    thickness: 20
                }, {
                    from: kpi.max*.75,
                    to: kpi.max*.9,
                    color: '#DDDF0D', // yellow
                    thickness: 20
                }, {
                    from: kpi.max*.9,
                    to: kpi.max,
                    color: '#55BF3B', // red
                    thickness: 20
                }]
            },
        
            series: [{
                name: 'Sales',
                data: [kpi.value],
                tooltip: {
                    valuePrefix: '$'
                },
                dataLabels: {
                    format: kpi.prefix+'{y}'.toLocaleString() ,
                    borderWidth: 0,
                    color: (
                        Highcharts.defaultOptions.title &&
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || '#333333',
                    style: {
                        fontSize: '16px'
                    }
                },
                dial: {
                    radius: '80%',
                    backgroundColor: 'gray',
                    baseWidth: 12,
                    baseLength: '0%',
                    rearLength: '0%'
                },
                pivot: {
                    backgroundColor: 'gray',
                    radius: 6
                }
        
            }]
        
        };
        allOptions.push(options)
    
    }
    
    useEffect(()=>{
        let queryString = "[Sales] [Number of Transactions] [Number of Customers] "
        if (region && region!=''){
            queryString = queryString + "[Store Region].'"+region+"'"
        } 
        let worsheetUUID = "782b50d1-fe89-4fee-812f-b5f9eb0a552d"
        var url = tsURL + "callosum/v1/tspublic/v1/searchdata?query_string="+encodeURIComponent(queryString)+
        "&data_source_guid="+worsheetUUID+"&batchsize=-1&pagenumber=-1&offset=-1&formattype=COMPACT"
        fetch(url,
        {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method:'POST',
            credentials: 'include',
        })
        .then(response => response.json()).then(
            data => {
            setSales(parseInt(data.data[0][0]))
            setBasketSize(parseInt(data.data[0][1]))
            setNumberOfCustomers(parseInt(data.data[0][2]))

        })
    },[region])
    let opts = [
        {label: 'east', value: 'east'},
        {label: 'west', value: 'west'},
        {label: 'south', value: 'south'},
        {label: 'midwest', value: 'midwest'},

    ]
    function toggleRegion(value){
        setRegion(value)
    }
    return (
        <Stack height="100%">
            <MultiSelect 
            fontSize={14}
            value={region ? region : ''}
            options={opts ? opts : []}
            label='Choose a Region'
            onChange={toggleRegion}
            single/>
            <Stack direction="row"  height="30%">
            <HighchartsReact containerProps={{ style: { height: "100%" } }} highcharts={Highcharts} options={allOptions[0]} />
            <HighchartsReact containerProps={{ style: { height: "100%" } }} highcharts={Highcharts} options={allOptions[1]} />
            <HighchartsReact containerProps={{ style: { height: "100%" } }} highcharts={Highcharts} options={allOptions[2]} />
            </Stack>
            <Stack height="100%">
            <LiveboardEmbed 
                liveboardId={"5fc750d7-dd94-4638-995c-31f0434ce2a0"} 
                hiddenActions={[Action.Edit,Action.Share]}
                frameParams={{width:'100%',height:'100%'}}
                runtimeFilters={[
                {
                    columnName:'Store Region',
                    operator: RuntimeFilterOp.EQ,
                    values: [region]
                }
                ]}
                customizations={{
                    style: {
                      customCSS: {
                        rules_UNSTABLE: {
                          ".pinboard-header-module__pinboardHeaderContainer": {
                            "display":"none !important",
                          }
                        }
                      },
                    },
                  }}
                />
            </Stack>

        </Stack>
    )
}