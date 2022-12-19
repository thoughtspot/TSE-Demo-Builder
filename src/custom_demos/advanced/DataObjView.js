import { HStack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState, useEffect, setState } from 'react';
import D3Chart from './D3Chart.js'
function DataObjView(props){
    const {
        worksheet,
        queryString
    } = props
    const [dataObj, setDataObj] = useState('')
    const [chartFilter,setChartFilter] = useState('')

    useEffect(() => {
        if (queryString){
            console.log("queryStringing")
            var query = chartFilter ? queryString +  "'" + chartFilter + "' " : queryString
            var url = "https://se-thoughtspot-cloud.thoughtspot.cloud/callosum/v1/tspublic/v1/searchdata?query_string="+encodeURIComponent(query)+
            "&data_source_guid="+worksheet+"&batchsize=-1&pagenumber=-1&offset=-1&formattype=COMPACT"
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
                    setDataObj(data)
            })
        }
        window.addEventListener('chartFilter', function(e){
            console.log("chart Fil111",e.detail.name)
            
        })
    },[queryString])
    if (!dataObj){
        return (
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',boxShadow:'0px 0px 5px #e0e0e0', minHeight:'250px',maxHeight:'250px'}}>Search Data Will go Here</div>
        )
    }
    var ths = []
    for (var idx in dataObj.columnNames){
        ths.push(<Th>{dataObj.columnNames[idx]}</Th>)
    }
    var data = dataObj.data
    if (data){
        var trs = []
        for (var row of data){
            var tds = []
            for (var col of row){
                tds.push(<Td>{col ? col.toLocaleString() : null}</Td>)
            }
            trs.push(<Tr>{tds}</Tr>)
        }
    }


    return (
        <HStack spacing={20} padding={30}>
            <div style={{flex:1, overflowY:'auto'}}>
                <Table>
                    <Thead>
                        {ths}
                    </Thead>
                    <Tbody>
                        {trs}
                    </Tbody>
                </Table>
            </div>
            <div style={{flex:1}}>
            <D3Chart data={data}></D3Chart>
            </div>

        </HStack>
    )
}
export default DataObjView;