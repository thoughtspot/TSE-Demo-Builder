import { Button, Heading, HStack, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { Action, RuntimeFilterOp } from "@thoughtspot/visual-embed-sdk";
import { LiveboardEmbed } from "@thoughtspot/visual-embed-sdk/react";
import { MultiSelect } from "chakra-multiselect";
import { now } from "moment";
import React, { useEffect, useState } from "react";

const tabMap = {
    "clicks":"b7042be4-7741-4b6f-b6db-5a77b3523fd1",
    "impressions":"5cff610e-496e-4bd4-82f3-b6858f51d73b",
    "views":"98182503-4fee-4972-9dbb-f4bbdf569f70"
}
const worsheetUUID = "b8ebc39d-1d36-453b-905e-6ef669858c30"
const campgaingIDCol = "Campaign Name"

export default function ABTest(props){
    const {
        tsURL,
    } = props

    const [selectedView, setSelectedView] = useState('test')
    const [possibleIds,setPossibleIds] = useState([])
    const [tests,setTests] = useState([])
    const [selectedTest, setSelectedTest] = useState(null) 
    const [renderKey,setRenderKey] = useState(null)
    function runTest(metric){
        let testId = possibleIds[Math.floor(Math.random() * possibleIds.length)]
        let testCopy = tests
        var d = new Date();
        testCopy.push({
            "id": testId,
            "metric": metric,
            "time": d.toLocaleString()
        })
        setTests(testCopy)
        setSelectedTest(testId)
    }

    useEffect(()=>{
        let queryString = "["+campgaingIDCol+"]"
    
        var url = tsURL + "/callosum/v1/tspublic/v1/searchdata?query_string="+encodeURIComponent(queryString)+
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
              var possibleCampaigns = []
              for (var row of data.data){
                possibleCampaigns.push(row[0])
              }
              setPossibleIds(possibleCampaigns)
        })
    },[])
    return (
        <Stack px={24} py={2} direction="column" height="100%">
            <Stack direction="row" marginBottom={8} py={6} borderBottom={"1px solid #f2f2f2"}>
                <Button onClick={()=>setSelectedView('test')} backgroundColor={selectedView=="test"?"#cdcdcd":null}>
                    A/B Testing
                </Button>
                <Button onClick={()=>setSelectedView('report')} backgroundColor={selectedView=="report"?"#cdcdcd":null}>
                    Reporting
                </Button>
            </Stack>
            {selectedView=='test' ? 
                <Stack>
                    <ABTestPage runTest={runTest}></ABTestPage>
                    <ABBrowse tests={tests}></ABBrowse>
                </Stack>
            :
                <Stack height="100%" overflow={"auto"} spacing={2}>
                    <Heading mb={2}>Test Results</Heading>
                    <TestSelector setSelectedTest={setSelectedTest} tests={tests} selectedTest={selectedTest}></TestSelector>
                    <Text>
                    <b>Optimized Metric: </b> {tests.filter((row)=>row.id==selectedTest)[0].metric}
                    </Text>
                    <Text>
                    <b>Test Run Time:</b> {tests.filter((row)=>row.id==selectedTest)[0].time}
                    </Text>
                    <ABLiveboard key={selectedTest} selectedMetric={tests.filter((row)=>row.id==selectedTest)[0].metric} selectedTest={selectedTest}></ABLiveboard>
                </Stack>
            }


        </Stack>
    )
}
function ABTestPage(props){
    const {
        runTest
    } = props

    const [selectedMetric,setSelectedMetric] = useState('clicks')

    function toggleRunTest(){
        runTest(selectedMetric)
    }

    return (
        <Stack>
            <Heading mb={2}>New Test</Heading>
            <Text fontWeight={600} >Configure Test Parameters</Text>
            <Stack p={8}>
            <Text >A bunch of stuff is configured here.</Text>

            </Stack>
            <Text fontWeight={600} >Optimize For Metric</Text>
            <Stack direction={"row"}>
                <Button 
                onClick={()=>setSelectedMetric('clicks')} 
                backgroundColor={selectedMetric=="clicks"?"#cdcdcd":null}>
                    Clicks
                </Button>
                <Button 
                onClick={()=>setSelectedMetric('impressions') }
                backgroundColor={selectedMetric=="impressions"?"#cdcdcd":null}>
                    Impressions
                </Button>
                <Button 
                onClick={()=>setSelectedMetric('views')}
                backgroundColor={selectedMetric=="views"?"#cdcdcd":null}>
                    Views
                </Button>
            </Stack>
            <Stack py={8}>
            <Button 
                onClick={toggleRunTest}>
                    Conduct New Test
            </Button>
            </Stack>

        </Stack>
    )
}
function ABLiveboard(props){
    const {
        selectedMetric,
        selectedTest
    } = props
    let runFilters=[
        {
            columnName: campgaingIDCol,
            operator: RuntimeFilterOp.EQ,
            values: [encodeURIComponent(selectedTest)]
        }
    ]
    console.log(selectedMetric,selectedTest,"runFilters,",runFilters)
    return (
        <Stack height="100%">
            <LiveboardEmbed 
                liveboardId={"5efcaf3f-f4ce-4016-9e12-e820e4f992c3"} 
                activeTabId={tabMap[selectedMetric]}
                hiddenActions={[Action.Edit,Action.Share]}
                frameParams={{width:'100%',height:'100%'}}
                runtimeFilters={runFilters}
                fullHeight={true}
                />
        </Stack>

    )
}
function ABBrowse(props){
    const {
        tests
    } = props

    var ths = []
    for (var idx of ["Test ID","Metric","Time"]){
        ths.push(<Th>{idx}</Th>)
    }
    if (tests){
        var trs = []
        for (var row of tests){
            var tds = []
            for (var col of Object.values(row)){
                tds.push(<Td>{col ? col.toLocaleString() : null}</Td>)
            }
            trs.push(<Tr>{tds}</Tr>)
        }
    }


    return (
        <Stack>
            <Heading mb={2}>Previous Tests</Heading>
            <Table>
                <Thead>
                    {ths}
                </Thead>
                <Tbody>
                    {trs}
                </Tbody>
            </Table>
        </Stack>

    )
}
function TestSelector(props){
    const {
        setSelectedTest,
        selectedTest,
        tests
    } = props 
    let opts = []
    for (var row of tests){
        opts.push({
          label: row.id, value: row.id
        })
    }
    return (
        <MultiSelect 
            fontSize={14}
            value={selectedTest ? selectedTest : ''}
            options={opts ? opts : []}
            label='Choose a Test'
            onChange={setSelectedTest}
            single/>
    )
}