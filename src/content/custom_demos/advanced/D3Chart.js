import { useState,useEffect,useRef } from "react";
import * as d3 from "d3"

function D3Chart(props){
    const {
        data
    } = props
    const svg = useRef(null);

    useEffect(()=>{
        if (data && data[0].length > 2){
            var packedData = convertToCirclePack(data)
            var svgData = chart({'name':'charty','children':packedData})
            svgData.setAttribute("height",600)
            if(svg.current){
                svg.current.innerHTML = ""
                svg.current.appendChild(svgData)
            } 
        }
    });


    return (
        <div style={{display:'flex',flex:1, justifyContent:'center',alignItems:'center'}} ref={svg}>
            {!data || data[0].length <= 2 ?
                <span>Select 2 <span style={{color:"#2b4594"}}>Dimensions</span> and a <span style={{color:"green"}}>Metric</span></span>
            : null}
        </div>
    )
}
export default D3Chart
function chart(data){
    var height = 600
    var width = 600
    var format = d3.format(",d")
    var color = d3.scaleLinear()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl)
    const root = d3.pack()
            .size([width, height])
            .padding(3)
        (d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value))
    let focus = root;
    let view;
  
    const svg = d3.create("svg")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("background", color(0))
        .style("cursor", "pointer")
        .on("click", handleResetClick);
  
    const node = svg.append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
        .attr("fill", d => d.children ? color(d.depth) : "white")
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function() { d3.select(this).attr("stroke", null); })
        .on("click", handleClick);
  
    const label = svg.append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => d.data.name);
  
    zoomTo([root.x, root.y, root.r * 2]);
    function handleClick(event, d){
        console.log("clicky!!!!",event,d)
        var ev = new CustomEvent('chartFilter', {detail:{'name':d.data.name,'depth': d.depth}});
        window.dispatchEvent(ev)
        return focus !== d && (zoom(event, d), event.stopPropagation())
    }
    function handleResetClick(event){
        zoom(event, root)
        var ev = new CustomEvent('chartFilter', {detail:{'name':'','depth': 0}});
        window.dispatchEvent(ev)
    }
    function zoomTo(v) {
      const k = width / v[2];
  
      view = v;
  
      label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }
  
    function zoom(event, d) {
      const focus0 = focus;
  
      focus = d;
  
      const transition = svg.transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
          });
  
      label
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .transition(transition)
          .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }
  
    return svg.node();
  }

  function convertToCirclePack(data){
      //find first numeric column
      var outObj = []
      for (var i=0;i<data.length;i++){
        var row = data[i]
        for (var j=1;j<row.length-1;j++){
            outObj = addChild(outObj,row,0)
        }
      } 
      console.log("out obj",outObj)
      return outObj;
  }

 function addChild(currentObj,row,iteration){

    var idx = currentObj.findIndex(x => x.name === row[iteration]);
    if  (idx != -1 && currentObj[idx].children){
        var nextObj = currentObj[idx].children
        if (iteration==row.length){
            currentObj[idx]['value'] = row[iteration]
            return currentObj
        }else{
            currentObj[idx].children = addChild(nextObj,row,iteration+1)
        }
    }else{
        if (iteration==row.length-2){
            currentObj[currentObj.length] = { 
                'name': row[iteration],
                'value': row[iteration+1]
            }
        }else{
            currentObj[currentObj.length] = { 
                'name': row[iteration],
                'children': addChild([],row,iteration+1)
            }
        }
    }
    return currentObj;
  }