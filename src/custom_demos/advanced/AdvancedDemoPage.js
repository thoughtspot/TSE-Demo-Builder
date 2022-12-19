import React, { useState, useEffect, setState } from 'react';
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent} from '@thoughtspot/visual-embed-sdk';
import { SearchEmbed, LiveboardEmbed, AppEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/react';
import ColumnList from './ColumnList';
import DataObjView from './DataObjView'
import {  Heading, Box, HStack

} from '@chakra-ui/react';
function AdvancedDemoPage(props){
    const{
        worksheet
    } = props
    const embedRef = useEmbedRef();
    const [dataObj,setDataObj] = useState('')
    const [selectedView, setSelectedView] = useState('search')
    const [searchString, setSearchString] = useState('')
    const [selectedFilters, setSelectedFilters] = useState('')
    function onEmbedRendered(){
        embedRef.current.on(EmbedEvent.QueryChanged,(resp) => {
            console.log("data!",resp)
            // const event = new CustomEvent('popup', {detail: {data: resp.data.search}});
            // window.dispatchEvent(event)
        })
    }
    
    function updateSearch(selectedColumns,selectedFilters,chartFilter){
        var searchString =""
        for (var i in selectedColumns){
            searchString += "["+selectedColumns[i]+"] "
        }
        for (var i in selectedFilters){
            searchString += "["+selectedFilters[i].col+"]."+"'"+selectedFilters[i].val+"' "
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
        setSearchString(searchString)
        setSelectedFilters(selectedFilters)
        const event = new CustomEvent('searchQuery', {detail: {data: searchString}});
        window.dispatchEvent(event)

    }
    var breadcrumbs = []
    for (var filter of selectedFilters){
        breadcrumbs.push(<div style={{width:'auto',marginLeft:'15px',display:'flex',alignItems:'center'}}>
            <FilterBreadcrumb col={filter.col} val={filter.val} removeFilter={removeFilter}></FilterBreadcrumb>
        </div>)
    }
    function removeFilter(filter){
        setSelectedFilters(
            selectedFilters.filter((e)=>(e.val !== filter)),
        )
    }
    return(
        <Box textAlign="left" fontSize="xl" alignItems="flex-start" p={30} h="100%" overflowY={"auto"}>
            <Heading as='h1' fontSize={32} marginBottom={2}>Search String Builder</Heading>  
            <Heading as='h2' fontSize={18} marginBottom={4}>Custom interface for search analysis</Heading>  
            <HStack marginTop={5} alignItems={"flex-start"} spacing={30} style={{fontFamily:'Open Sans',maxHeight:'300px'}}>
            <div style={{height:'240px',display:'flex',flexDirection:'column',width:'25%', padding: '15px', boxShadow: 'rgb(230 230 230) 0px 0px 15px'}}>
                    <Heading as='h2' fontSize={18} marginBottom={4}>Instructions</Heading>  
                    <div style={{display:'flex',flexDirection:'row',minHeight:'50px',alignItems:'center'}}>
                        <div style={{width:'50px',color:'#cccccccc',display:'flex',alignItems:'center'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -1.5 24 24" width="24" fill="currentColor"><path d="M4 .565h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-12a4 4 0 0 1 4-4z"></path></svg>
                        </div>
                        <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',fontSize:'12px'}}>
                         Click on the box beside a column to add it to the report.
                        </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'row',minHeight:'50px',alignItems:'center'}}>
                        <div style={{width:'50px',color:'#cccccccc',display:'flex',alignItems:'center'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2.5 24 24" width="24" fill="currentColor"><path d="M1.08.858h15.84a1 1 0 0 1 .78 1.625l-6.48 8.101a1 1 0 0 0-.22.625v5.149a1 1 0 0 1-.4.8l-2 1.5a1 1 0 0 1-1.6-.8v-6.65a1 1 0 0 0-.22-.624L.3 2.483A1 1 0 0 1 1.08.858z"></path></svg>
                        </div>
                        <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',fontSize:'12px'}}>
                        Click on the funnel icon to filter on that column. 
                        </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'row',minHeight:'50px',alignItems:'center'}}>
                        <div style={{fontSize:14,width:'50px',color:'#cccccccc',display:'flex',alignItems:'center'}}>
                        TML
                        </div>
                        <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',fontSize:'12px'}}>
                        {searchString}
                        </div>
                    </div>
                </div>
                <div style={{width:'75%'}}>
                <ColumnList key={worksheet} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} worksheet={worksheet} updateSearch={updateSearch} ></ColumnList>
                </div>
            </HStack>     
            <div style={{display:'flex',maxHeight:'50px',flexDirection:'row',alignItems:'center'}}>
                <div className={selectedView=="search" ?"advancedToggleButton selected" : "advancedToggleButton"} onClick={()=>setSelectedView('search')}>Explore (SDK)</div>
                <div className={selectedView=="table" ?"advancedToggleButton selected" : "advancedToggleButton"}  onClick={()=>setSelectedView('table')}>Table (REST)</div>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                {breadcrumbs}
                </div>

            </div>
            <div style={{
                display:'flex',
                flex:2,
                minHeight:'600px',
                maxHeight:'700px',
                width:'calc(100vw - 80px)',
                boxShadow:'0px 0px 15px #e0e0e0',
                marginTop:'15px',
            }}>
                
                {selectedView == 'search' ? 
                <SearchEmbed 
                ref={embedRef} 
                onLoad={onEmbedRendered} 
                searchOptions={{
                    searchTokenString: searchString,
                    executeSearch: true,
                }}
                dataSources={[worksheet]} 
                hideDataSources={true} 
                frameParams={{width:'calc(100vw - 80px)',height:'100%'}}></SearchEmbed>
                : null }
                {selectedView == 'table' ? 
                <DataObjView  key={searchString} worksheet={worksheet} queryString={searchString}></DataObjView>
                : null }
            </div>
        </Box>
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

function FilterBreadcrumb(props){
    const {
        col,
        val,
        removeFilter
    } = props
    const [isHover, setIsHover] = useState(false)
    return(
        <div onMouseEnter={()=>setIsHover(true)} onMouseLeave={()=>setIsHover(false)}
        style={{display:'flex',flexDirection:'row',width:'125px',height:'30px',background:'#efefef',borderRadius:'15px',fontSize:'12px'}}>
            <div style={{alignItems:'center',display:'flex',marginLeft:'10px',width:'auto'}}>
                {col}
            </div>
            <div style={{alignItems:'center',display:'flex',marginLeft:'5px',width:'auto',overflow:'hidden',fontWeight:600}}>
                {val}
            </div>
            {isHover ? 
            <div style={{position:'relative',right:'0px',width:'20px'}} onClick={()=>removeFilter(val)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="16" fill="currentColor"><path d="M11.414 10l2.829-2.828a1 1 0 1 0-1.415-1.415L10 8.586 7.172 5.757a1 1 0 0 0-1.415 1.415L8.586 10l-2.829 2.828a1 1 0 0 0 1.415 1.415L10 11.414l2.828 2.829a1 1 0 0 0 1.415-1.415L11.414 10zM10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z"></path></svg>
            </div>
            : null}
        </div>
    )
}