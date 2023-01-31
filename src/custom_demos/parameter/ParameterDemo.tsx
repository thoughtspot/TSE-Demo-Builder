import React, { useEffect, useState } from 'react';
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent, RuntimeFilterOp} from '@thoughtspot/visual-embed-sdk';
import SurveyLiveboard from "../surveys/SurveyLiveboard"
import {
  ChakraProvider,
  Box,
  VStack,
  extendTheme,
  filter,
  Th,
  Table,
  Tbody,
  Td,
  Tr,
  Thead,
  HStack,
  Heading

} from '@chakra-ui/react';
import { MultiSelect } from 'chakra-multiselect'
import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk/react';

export default function ParameterDemo(props){
    const {
        tsURL
    } = props

    const [accounts,setAccounts] = useState([])
    const [primaryAccount, setPrimaryAccount] = useState('')
    const [secondaryAccount, setSecondaryAccount] = useState('')

    const worsheetUUID = 'd3845440-5af6-451b-8e12-36b40591fc9f'
    useEffect(()=>{
        let queryString = "[Account ID] [Account Balance] > 1000 top 100"

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
              var possibleAccounts = []
              for (var row of data.data){
                possibleAccounts.push({
                    label: row[0], value: row[0]
                  })
              }
              setAccounts(possibleAccounts)
        })
    },[])

    function setPrimaryAccountValue(val){
        setPrimaryAccount(val)
    }
    function setSecondaryAccountValue(val){
        setSecondaryAccount(val)
    }
    let runtimeFilters = [
        {
            columnName: 'Account ID',
            operator: RuntimeFilterOp.IN,
            values: [primaryAccount,secondaryAccount]
        },
        {
            columnName: 'PrimaryAccount',
            operator: RuntimeFilterOp.EQ,
            values: [primaryAccount]
        }
    ]
    return (
        <Box textAlign="left" fontSize="xl" alignItems="flex-start" p={30} h="100%" overflowY={"auto"}>
        <MultiSelect 
                fontSize={14}
                value={primaryAccount ? primaryAccount : []}
                options={accounts ? accounts : []}
                label='Primary Account'
                onChange={setPrimaryAccountValue}
                single={true}
                />
                <MultiSelect 
                fontSize={14}
                value={secondaryAccount ? secondaryAccount : []}
                options={accounts ? accounts : []}
                label='Secondary Account'
                onChange={setSecondaryAccountValue}
                single={true}
                />
                <LiveboardEmbed
                    runtimeFilters = {runtimeFilters}
                    liveboardId='0322296d-d84c-44eb-b6e3-adda76570573'
                ></LiveboardEmbed>
        </Box>
    )
}