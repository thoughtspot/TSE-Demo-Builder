import React, { useState, useEffect, setState } from 'react';
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent} from '@thoughtspot/visual-embed-sdk';
import { SearchEmbed, LiveboardEmbed, AppEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/react';
import ColumnList from './ColumnList';
import DataObjView from './DataObjView'
function AdvancedDemoPage(props){
    const{
        worksheet
    } = props
    const embedRef = useEmbedRef();
    const [dataObj,setDataObj] = useState('')
    const [selectedView, setSelectedView] = useState('search')
    function onEmbedRendered(){
        embedRef.current.on(EmbedEvent.QueryChanged,(resp) => {
            console.log("data!",resp)
            // const event = new CustomEvent('popup', {detail: {data: resp.data.search}});
            // window.dispatchEvent(event)
        })
    }
    
    function updateSearch(selectedColumns,selectedFilters,chartFilter){
        console.log("updating!!!",selectedColumns,selectedFilters,chartFilter)
        var searchString =""
        for (var i in selectedColumns){
            searchString += "["+selectedColumns[i]+"] "
        }
        for (var i in selectedFilters){
            searchString += "'"+selectedFilters[i]+"' "
        }
        if (chartFilter){
            searchString += "'"+chartFilter+"'"
        }
        if (embedRef.current){
            // embedRef.current.trigger(HostEvent.Search, {
            //     searchQuery: searchString,
            //     dataSources: []
            // });
            
            // embedRef.current.trigger(HostEvent.Filter, {
            //     searchQuery: searchString,
            //     executeSearch: true,
            // });
        }
        const event = new CustomEvent('searchQuery', {detail: {data: searchString}});
        window.dispatchEvent(event)
    }
    return(
        <div style={{display:'flex',flexDirection:'column'}}>
            <div style={{flex:1,display:'flex',flexDirection:'row',fontFamily:'Open Sans'}}>
                <div style={{width:'75%'}}>
                <ColumnList key={worksheet} worksheet={worksheet} updateSearch={updateSearch} ></ColumnList>
                </div>
                <div style={{height:'280px',display:'flex',flexDirection:'column',width:'25%',margin: '15px', padding: '15px', boxShadow: 'rgb(230 230 230) 0px 0px 15px'}}>
                    <div style={{height:'30px',fontWeight:600}}>Information</div>
                    <div style={{display:'flex',flexDirection:'row',minHeight:'50px',alignItems:'center'}}>
                        <div style={{width:'50px',color:'#cccccccc',display:'flex',alignItems:'center'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -1.5 24 24" width="24" fill="currentColor"><path d="M4 .565h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-12a4 4 0 0 1 4-4z"></path></svg>
                        </div>
                        <div style={{display:'flex',justifyContent:'center',alignItems:'center',fontSize:'12px'}}>
                         Click on the checkbox beside any column to add that column to the report.
                        </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'row',minHeight:'50px',alignItems:'center'}}>
                        <div style={{width:'50px',color:'#cccccccc',display:'flex',alignItems:'center'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2.5 24 24" width="24" fill="currentColor"><path d="M1.08.858h15.84a1 1 0 0 1 .78 1.625l-6.48 8.101a1 1 0 0 0-.22.625v5.149a1 1 0 0 1-.4.8l-2 1.5a1 1 0 0 1-1.6-.8v-6.65a1 1 0 0 0-.22-.624L.3 2.483A1 1 0 0 1 1.08.858z"></path></svg>
                        </div>
                        <div style={{display:'flex',justifyContent:'center',alignItems:'center',fontSize:'12px'}}>
                        Click on the filter icon beside the column to reveal the filter selection menu. 
                        </div>
                    </div>
                </div>
            </div>     
            <div style={{display:'flex',flexDirection:'row',alignItems:'center',marginLeft:'15px'}}>
                <div className={selectedView=="search" ?"advancedToggleButton selected" : "advancedToggleButton"} onClick={()=>setSelectedView('search')}>Explore</div>
                <div className={selectedView=="table" ?"advancedToggleButton selected" : "advancedToggleButton"}  onClick={()=>setSelectedView('table')}>Table</div>
                <div className={selectedView=="d3" ?"advancedToggleButton selected" : "advancedToggleButton"}  onClick={()=>setSelectedView('d3')}>Custom</div>
            </div>
            <div style={{
                display:'flex',
                flex:2,
                minHeight:'600px',
                width:'calc(100vw - 30px)',
                boxShadow:'0px 0px 15px #e0e0e0',
                marginTop:'15px',
                marginRight:'15px',
                marginLeft:'15px',
            }}>
                <SearchEmbed ref={embedRef} onLoad={onEmbedRendered} enabledActions={[]} dataSources={[worksheet]} hideDataSources={true} frameParams={{width:'calc(100vw - 30px)',height:'100%'}}></SearchEmbed>
            </div>
            <div style={{flex:1}}>
                <DataObjView worksheet={worksheet}></DataObjView>
            </div>
        </div>
    )
}
export default AdvancedDemoPage;

function SearchString(){
    const [queryString,setQueryString] = useState('')
    useEffect(() => {
        window.addEventListener('popup', function(e){
            setQueryString(e.detail.data)
        })

    },[])

    return (
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',fontSize:'16px',fontWeight:600}}>
            <div className="sectionTitle">3. Generate Query String</div>
            <div style={{marginLeft:'30px',marginTop:'10px',fontWeight:300}}>
            Query: {queryString}
            </div>
        </div>
    )
}

