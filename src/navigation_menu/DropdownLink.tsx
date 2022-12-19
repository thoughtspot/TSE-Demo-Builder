import React, { useState } from "react";
import { styles } from "../util/Styles";

export default function DropdownLink(props){
    const {
      name,
      content,
      type,
      renderLink,
      isHorizontal
    } = props
      
    function handleLinkClick(){
      renderLink(type, content, name)
    }
    return(
      <div style={isHorizontal ? styles.contentLinkHorizontal : styles.contentLinkVertical} className="dropdownLink" onClick={handleLinkClick}>
        {name}
      </div>    
    )
  }
  