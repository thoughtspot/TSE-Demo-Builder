import React, { useState } from "react";
import { styles } from "../util/Styles";

export default function NavigationLink(props){
    const {
      id,
      name,
      content,
      type,
      renderLink,
      children,
      isHorizontal
    } = props
    
    const [hoverVisible, setHoverVisible] = useState(false)
  
    function handleLinkClick(){
      renderLink(type, content, name)
    }
    var isDropdown=false;
    if (children){
      if (children.length>0){
        isDropdown=true;
      }
    }
  
    function handleMouseEnter(){
      setHoverVisible(true)
    }
    function handleMouseLeave(){
      setHoverVisible(false)
    }

    return(
      <div style={isHorizontal ? styles.horizontalLink : {width:"100%"}}>
  
        {isDropdown 
          ?
          <div style={isHorizontal ? styles.contentLinkHorizontal : styles.contentLinkVertical} className={isHorizontal? "contentLinkHorizontal":"contentLinkVertical"} onMouseEnter={handleMouseLeave} onMouseLeave={handleMouseEnter}>
              {name}
              {hoverVisible ? 
                null
              : 
              <div style={isHorizontal ? styles.hoverMenuHorizontal : styles.hoverMenuVertical} className='hoverMenu'>
                {children}
              </div>}
  
          </div>
          :
          <div style={isHorizontal ? styles.contentLinkHorizontal : styles.contentLinkVertical} className={isHorizontal? "contentLinkHorizontal":"contentLinkVertical"} onClick={handleLinkClick}>
              {name}
          </div>      
        }      
    </div>)
  }
  