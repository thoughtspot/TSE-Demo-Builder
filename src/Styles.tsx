
interface StyleSheet {
    [key: string]: React.CSSProperties;
  }
export const styles : StyleSheet = {
    leftMenu : {
    background: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    borderRight: '1px solid #dddddd',
    width: '150px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 0px 15px #dddddd'
  },
  topMenu : {
    background: 'var(--primary-color)',
    color: 'var(--secondary-color)',
    borderBottom: '1px solid #dddddd',
    width: '100%',
    height: '75px',
    minHeight: '75px',
    display: 'flex',
    flexDirection: 'row',
    boxShadow: '0px 0px 15px #dddddd'
  },
  verticalContainer : {
    display:'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100vh',
    overflow: 'hidden'
  },
  horizontalContainer : {
    display:'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100vh',
    overflow: 'hidden'
  
  },
  logoImageHolderVertical : {
    height: '150px',
    width: '150px',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    marginTop:'20px',
    marginBottom:'20px'
  },
  logoImageHolderHorizontal : {
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    marginLeft:'20px',
    marginRight:'100px',
  },
  verticalLogoImage : {
    width:'75px',
  },
  horizontalLogoImage : {
    height:'50px',
  },
  horizontalIcons : {
    display:'flex',
    flexDirection:'column',
    justifyContent:'center', 
    alignItems:'flex-end',
    width:'100%',
    marginRight: '15px'
  },
  verticalIcons : {
    display:'flex',
    flexDirection:'column',
    alignItems:'center', 
    justifyContent:'flex-end',
    height:'100vh'
  },
  contentLinkVertical : {
    fontSize:'14px',
    fontFamily: "'Open Sans', sans-serif",
    paddingLeft:'15px',
    paddingTop:'10px',
    paddingBottom:'10px',
    marginBottom: '5px'
  },
  contentLinkHorizontal : {
    maxWidth:'165px',
    height:'50px',
    display:'flex',
    alignItems: 'center',
    flexShrink:0,
    paddingLeft:'10px',
    paddingRight:'25px',
  },
  horizontalLink : {
    display:'flex',
    alignItems: 'flex-end',
    flexShrink:0,
  },
  hoverMenuHorizontal : {
    position: 'absolute',
    width: '200px',
    top: '75px',
    marginLeft:'-10px',
  },
  hoverMenuVertical : {
    position: 'absolute',
    width: '200px',
    paddingRight:'10px',
    left: '150px',
    marginTop:'-29px',
  }
}