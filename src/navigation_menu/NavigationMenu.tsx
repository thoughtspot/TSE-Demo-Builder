import React, { useEffect, useState } from "react";
import { styles } from "../util/Styles";
import { icons } from "../util/Icons";
import NavigationLinks from "./NavigationLinks";
import Filters from "./Filters";

export default function NavigationMenu(props){
    const {
        url,
        logoImage,
        isHorizontal,
        showSettings,
        links,
        linkNames,
        linkContents,
        linkParents,
        linkTypes,
        setField,
        setFilter,
        selectedFilters,
        renderLink,
        renderName,
    } = props


    function openTS(){
        window.open(url,'_blank')
    }
    function openGit(){
        window.open('https://github.com/thoughtspot/TSE-Demo-Builder','_blank')
    }

    return (
        <div style={isHorizontal ? styles.topMenu : styles.leftMenu}>
            <div style={isHorizontal ? styles.logoImageHolderHorizontal: styles.logoImageHolderVertical}>
            <img src={logoImage} style={isHorizontal ? styles.horizontalLogoImage : styles.verticalLogoImage}></img>
            </div>
            <div>
        </div>
        <NavigationLinks
            url={url}
            isHorizontal={isHorizontal}
            links={links}
            linkNames={linkNames}
            linkContents={linkContents}
            linkParents={linkParents}
            linkTypes={linkTypes}
            renderLink={renderLink}
        ></NavigationLinks>
        <div style={isHorizontal ? styles.horizontalIcons : styles.verticalIcons}>
            {!isHorizontal ? 
              <div style={{margin:'10px',}}>
                <Filters
                      links={links}
                      linkTypes={linkTypes}
                      linkNames={linkNames}
                      linkParents={linkParents}
                      linkContents={linkContents}
                      setField={setField}
                      setFilter={setFilter}
                      selectedFilters={selectedFilters}
                      renderName={renderName}
                ></Filters>
              </div>
              : <div></div>
            }
        <div style={{display:'flex',flexDirection:'row',alignItems:'center', marginTop:'15px', marginBottom:'10px'}}>
            {isHorizontal ? 
              <div style={{display:'flex',flexDirection:'row',padding:'10px',}}>
                <Filters
                      links={links}
                      linkTypes={linkTypes}
                      linkNames={linkNames}
                      linkParents={linkParents}
                      linkContents={linkContents}
                      setField={setField}
                      setFilter={setFilter}
                      selectedFilters={selectedFilters}
                      renderName={renderName}
                      ></Filters>
              </div> 
              : <div></div>
            }
            <div onClick={showSettings} style={{marginRight:'5px'}}>
                {icons.SettingsIcon}
            </div>
            <div style={{width:'30px',height:'30px',marginRight:'5px'}} onClick={openTS} >
               {icons.TSLogo}
            </div>
            <div style={{width:'22px',height:'22px', marginRight:'5px'}} onClick={openGit}>
                {icons.GitHubLogo}
            </div>
          </div>
        </div>

      </div>
    )
}