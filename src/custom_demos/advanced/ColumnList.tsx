import { VStack,Heading } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
function ColumnList(props){
    const {
        worksheet,
        selectedFilters,
        setSelectedFilters,
        selectedColumns,
        setSelectedColumns
    } = props
    function toggleColumn(col){
        if (selectedColumns.includes(col)){
            setSelectedColumns(selectedColumns.filter((e)=>(e !== col)))
        }else{
            setSelectedColumns([...selectedColumns, col])
        }
        
    }
    function toggleFilter(filter,col){
        console.log(filter,"filter!!")
        if (selectedColumns.includes(filter)){
            setSelectedFilters(
                selectedFilters.filter((e)=>(e.val !== filter)),
            )
        }else{
            setSelectedFilters(
                [...selectedFilters, {val:filter,col:col}], 
            )
        }
    }
    const [columns,setColumns] = useState([])
    useEffect(() => {
        getWorksheet()
    }, [])
    function getWorksheet(){
        let formData = 'export_ids=%5B'+worksheet+'%5D&formattype=JSON&export_associated=false'
        let url = 'https://se-thoughtspot-cloud.thoughtspot.cloud/callosum/v1/tspublic/v1/metadata/tml/export'
        fetch(url,
        {
          headers: {
            'Accept': 'text/plain',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method:'POST',
          credentials: 'include',
          body: formData
        })
        .then(response => response.text()).then(
          data => {
              var fileinfo = JSON.parse(data)
              var tml = JSON.parse(fileinfo.object[0].edoc)
              console.log(tml.worksheet.worksheet_columns)
              setColumns(tml.worksheet.worksheet_columns)
        })
      }
      var tables = {}
      for (var col of columns){
        var table = col.column_id ? col.column_id.split("::")[0] : 'FORMULAS'
        tables[table] ? tables[table].push({name:col.name,type:col.properties.column_type}) : tables[table] = [{name:col.name,type:col.properties.column_type}]
      }

      var menu = []
      for (var tableName of Object.keys(tables)){
        var colOptions = []
        for (var col of tables[tableName]){
            colOptions.push(
                <Column worksheet={worksheet} col={col} selectedFilters={selectedFilters} toggleColumn={toggleColumn} toggleFilter={toggleFilter} isSelected={selectedColumns && selectedColumns.includes(col.name)}></Column>
            )
        }
        menu.push(<div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',minWidth:'220px',maxWidth:'calc(vw / 6)',paddingLeft:'10px',height:'90%'}}>
            <Heading as='h2' fontSize={18} marginBottom={1} marginTop={3}> 
                {tableName.replace("_1","").replace("_"," ")}
            </Heading>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',overflow:'auto',scrollbarWidth:'thin',marginRight:'10px',height:'100%'}}>
            {colOptions}
            </div>
            </div>)
      }
      return (
        <div style={{height:'260px',width:'calc(100%)',padding:'5px',boxShadow:'0px 0px 15px #e6e6e6',flexDirection:'column',display:'flex'}}>
                {/* <div style={{margin:'10px',fontWeight:600,height:'25px'}}>Configuration</div> */}
                <div style={{marginLeft:'10px',marginRight:'10px',width:'calc(100% - 20px)',display:'flex',flexDirection:'row',overflowX:'auto'}}>
                    {menu}
                </div>
        </div>

      )
}
export default ColumnList

function Column(props){
    const {
        worksheet,
        col,
        selectedFilters,
        isSelected,
        toggleColumn,
        toggleFilter
    } = props
    const [filterListVisible, setFilterListVisible] = useState(false)
    function toggleColumnSelector(){
        toggleColumn(col.name)
    }
    function toggleFilterSelection(){
        setFilterListVisible(!filterListVisible)
    }
    return(
        <div className="columnSelector" >
            <div  onClick={toggleColumnSelector} style={{marginRight:'5px', width:'18px',color:isSelected?'#898989':'#efefef',display:'flex',alignItems:'center'}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -1.5 24 24" width="18" fill="currentColor"><path d="M4 .565h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-12a4 4 0 0 1 4-4z"></path></svg>
            </div>
            <div  onClick={toggleFilterSelection} style={{marginRight:'5px', width:'18px',color:'#cccccccc',display:'flex',alignItems:'center'}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2.5 24 24" width="18" fill="currentColor"><path d="M1.08.858h15.84a1 1 0 0 1 .78 1.625l-6.48 8.101a1 1 0 0 0-.22.625v5.149a1 1 0 0 1-.4.8l-2 1.5a1 1 0 0 1-1.6-.8v-6.65a1 1 0 0 0-.22-.624L.3 2.483A1 1 0 0 1 1.08.858z"></path></svg>
            </div>
            <div style={{fontSize:13,display:'flex',alignItems:'center',color:col.type=="MEASURE" ? "green" : "#2b4594"}}> {col.name}</div>
            {filterListVisible?
                <div>
                    <div onClick={toggleFilterSelection} style={{zIndex:998,position:'fixed',top:0,left:0,width:'100vh',height:'100vh'}}>
                    </div>
                    <FilterPopup worksheet={worksheet} col={col.name} toggleFilter={toggleFilter} selectedFilters={selectedFilters}></FilterPopup>
                </div>
            :null}
        </div>
        
    )
}

function FilterPopup(props){
    const {
        worksheet,
        col,
        toggleFilter,
        selectedFilters
    } = props
    
    const [filterValues, setFilterValues] = useState('')

    useEffect(() => {
        var queryString = '['+col+']'
        for (var filter of selectedFilters){
            queryString+= '['+filter.col+'].'+"'"+filter.val+"'"
        }
        if (queryString){
            var url = "https://se-thoughtspot-cloud.thoughtspot.cloud/callosum/v1/tspublic/v1/searchdata?query_string="+encodeURIComponent(queryString)+
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
                    setFilterValues(data.data)
            })
        }
    },[])
    var filterOptions = []
    for (var i=0;i<filterValues.length;i++){
        var val = filterValues[i][0];
        if (val){
            filterOptions.push(<Filter value={val} col={col} toggleFilter={toggleFilter}></Filter>)
        }
    }
    return(
        <div style={{boxShadow:'0px 0px 25px #e0e0e0',height:'350px',width:'250px', top:'100px',zIndex:999,display:'flex',flexDirection:'column',position:'absolute',background:'#ffffff',padding:'10px'}}>
            <Heading as='h2' fontSize={18} marginBottom={4}>Select {col}</Heading>  
   
            <VStack height={320} overflowY="auto" overflowX='hidden'>
            {filterOptions}
            </VStack>

        </div>


    )
}
function Filter(props){
    const {
        value,
        col,
        toggleFilter
    } = props
    function toggleFilterValue(){
        toggleFilter(value,col)
    }
    return (
        <div className="filterPicker" 
            onClick={toggleFilterValue}
            style={{height:'35px',
            padding:'10px',
            display:'flex',
            fontSize:'13px',
            justifyContent:'flex-start',
            alignItems:'center',
            borderRadius:'5px'}}>
            {value}
        </div>
    )
}