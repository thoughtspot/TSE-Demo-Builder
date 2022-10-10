import React, { useState, useEffect, setState } from 'react';
import D3Chart from './D3Chart.js'
function DataObjView(props){
    const {
        worksheet
    } = props
    const [dataObj, setDataObj] = useState('')
    const [queryString, setQueryString] = useState('')
    const [chartFilter,setChartFilter] = useState('')
    function getData(newQueryString){
        var queryStr = newQueryString ? newQueryString : queryString
        if (queryStr){
            var query = chartFilter ? queryStr +  "'" + chartFilter + "' " : queryStr
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
                    if (newQueryString){
                        setQueryString(newQueryString)
                    }
            })
        }
    }
    useEffect(() => {
        window.addEventListener('chartFilter', function(e){
            console.log("chart Fil111",e.detail.name)
            setChartFilter(e.detail.name, getData(null))
            
        })
        window.addEventListener('searchQuery', function(e){
            var newQueryString = e.detail.data
            getData(newQueryString)

        })
    },[])
    if (!dataObj){
        return (
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',boxShadow:'0px 0px 5px #e0e0e0', minHeight:'250px',maxHeight:'250px'}}>Search Data Will go Here</div>
        )
    }
    var ths = []
    for (var idx in dataObj.columnNames){
        ths.push(<th>{dataObj.columnNames[idx]}</th>)
    }
    var data = dataObj.data
    if (data){
        var trs = []
        for (var row of data){
            var tds = []
            for (var col of row){
                tds.push(<td>{col}</td>)
            }
            trs.push(<tr>{tds}</tr>)
        }
    }


    return (
        <div style={{minHeight:'250px',maxHeight:'250px',display:'flex',flexDirection:'row'}}>
            <table>
                <thead>
                    {ths}
                </thead>
                <tbody>
                    {trs}
                </tbody>
            </table>
            <D3Chart data={data}></D3Chart>

        </div>
    )
}
export default DataObjView;