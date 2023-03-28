import React, { useState, useEffect } from "react"
import { MultiSelect } from "react-multi-select-component"
import { DateRangePicker } from 'react-date-range';
import { icons } from "../util/Icons";
import { RuntimeFilterOp } from "@thoughtspot/visual-embed-sdk";

export default function Filter(props){
    const {
      hasSelectAll,
      filterName,
      options,
      type,
      setFilter,
      setField,
      defaultValues
    } = props
    const [selectedFilter, setSelectedFilter] = useState([])
    const [popupVisible, setPopupVisible] = useState(false)
  
    useEffect(() => {
      if (defaultValues){
        setSelectedFilter(defaultValues)
      }else{
        if (type=='Date Filter'){
          const selectionRange = [{
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
          }]
          setSelectedFilter(selectionRange)
        }else{
          setSelectedFilter([])
  
        }
      }
    }, [])
    
    var overrideStrings = {
      "allItemsAreSelected": "All "+filterName,
      "search": "Search "+filterName,
      "selectAll": "Select All",
      "selectAllFiltered": "Select All (Filtered)",
      "selectSomeItems": filterName,
      "create": "Create",
    }
    function handleFieldChange(e){
      setSelectedFilter(e)
      var filterVals = []
      for (var i=0;i<e.length;i++){
        filterVals.push(e[i].value)
      }
      setField(filterName, filterVals)
    }
    function handleFilterChange(e){
      var filterVals = []
      for (var i=0;i<e.length;i++){
        filterVals.push(e[i].label)
      }
      var filtersObj  = {
        columnName: filterName,
        operator: RuntimeFilterOp.IN,
        values: filterVals
      }
      setSelectedFilter(e)
      setFilter(filtersObj)
    }
    function handleDateFilterChange(e){
      console.log(e,"range")
      if (e.selection.startDate)
      var filtersObj  = {
        columnName: filterName,
        operator: RuntimeFilterOp.BW_INC,
        values: [Math.floor(e.selection.startDate.getTime() / 1000), Math.floor(e.selection.endDate.getTime() / 1000)]
      }
      setSelectedFilter([e.selection])
      setFilter(filtersObj)
    }
    return (
      <div>
        {type == 'Field' || type == 'Filter' ?     
      <MultiSelect 
        labelledBy={null}
        hasSelectAll={hasSelectAll} 
        value={selectedFilter} 
        options={options} 
        onChange={type == 'Field' ? handleFieldChange: handleFilterChange} 
        overrideStrings={overrideStrings}/>
        :
        <div>
          <div style={{height:'38px',background:'#ffffff',color:'#999999',width:'140px',fontSize:'11px',border:'1px solid #ccc',borderRadius:'5px',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setPopupVisible(!popupVisible)}> 
            { selectedFilter[0] ? 
              <div style={{display:'flex',flexDirection:'row'}}>
                <div style={{marginRight:'10px'}}>
                {selectedFilter[0].startDate.toISOString().split('T')[0]} <br></br> {selectedFilter[0].endDate.toISOString().split('T')[0]}
                </div>
                {icons.CalendarIcon}  
              </div>
            :
            <div style={{display:'flex',flexDirection:'row'}}>
            <div>Select <br></br> Date Range</div>
            {icons.CalendarIcon}  
            </div>
            }
          </div>
          {popupVisible ? 
            <div style={{position:'absolute',left:'calc(100% - 600px)',boxShadow:'0px 0px 5px #cccccccc',borderRadius:'10px'}}>
              <DateRangePicker
                ranges={selectedFilter ? selectedFilter : [{
                  startDate: new Date(),
                  endDate: new Date(),
                  key: 'selection',
                }]}
                onChange={handleDateFilterChange}
              />
            </div>
          : null
  
          }
  
      </div>
        }
          </div>
      )
  }