
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
    maxWidth: 'inherit'
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
    maxWidth:'225px',
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
    width: '250px',
    top: '75px',
    marginLeft:'-10px',
    zIndex:99,
  },
  hoverMenuVertical : {
    position: 'absolute',
    width: '250px',
    paddingRight:'10px',
    left: '150px',
    marginTop:'-29px',
    zIndex:99
  }
}



/*        customisations: {
          style: {
            customCSS: {
              variables: {
                "--ts-var-button--secondary-color": settings.buttonColor ? settings.buttonColor : 'initial' ,
                // "--ts-var-button--secondary-color":settings.secondaryColor,
                // "--ts-var-button--secondary-background":settings.primaryColor+"cc",
                // "--ts-var-viz-background":settings.primaryColor+"ee",
                // "--ts-var-viz-title-color":settings.secondaryColor,
                "--ts-var-root-background":settings.backgroundColor ? settings.backgroundColor  : 'initial',
              },
              // rules_UNSTABLE: {
              //   '[data-testid="sage-search-bar"]':{
              //     "background":settings.primaryColor,
              //     "color":settings.secondaryColor
              //   },
              //   '[data-testid="sage-completions-dropdown"]':{
              //     "background":settings.primaryColor,
              //     "color":settings.secondaryColor
              //   },
              //   '[data-testid="answer-header-action-menu"]':{
              //     "background":settings.primaryColor,
              //     "color":settings.secondaryColor+" !important"
              //   },
              //   '[data-testid="answer-config-panel"]':{
              //     "background":settings.primaryColor,
              //     "color":settings.secondaryColor
              //   },
              //   '[data-testid="answer-content-loading-indicator"]':{
              //     "background-color":settings.primaryColor+"77"
              //   },
              //   '[class*="_measure"]':{
              //     "background-color":"#0dce85 !important",
              //     "border-bottom":"1px solid #0dce85"
              //   },
              //   '[class*="_attribute"]':{
              //     "background-color":"#2770ef !important",
              //     "border-bottom":"1px solid #2770ef"
              //   },
              //   '.axis-label-title':{
              //     "color":settings.secondaryColor+" !important"
              //   },
              //   '.highcharts-yaxis-labels text':{
              //     "color":settings.secondaryColor+" !important",
              //     "fill":settings.secondaryColor+" !important"
              //   },
              //   '.highcharts-xaxis-labels text':{
              //     "color":settings.secondaryColor+" !important",
              //     "fill":settings.secondaryColor+" !important"
              //   },
              //   '[class*="completionText"]':{
              //     "color":settings.secondaryColor+" !important"
              //   },
              //   '[class*="completionSubtext"]':{
              //     "color":settings.secondaryColor+"66 !important"
              //   },
              //   '[class*="completion"]:hover':{
              //     "background":settings.primaryColor+"66 !important"
              //   },
              //   '[class*="footerHelpContainer"]':{
              //     "background":settings.primaryColor+"66 !important"
              //   },
              //   '[class*="_selected"]':{
              //     "background":settings.secondaryColor+"11 !important"
              //   },
              //   '[class*="answerEditPane"], [class*="answerConfigPanelNav"]':{
              //     "border-left":"1px solid "+settings.secondaryColor+"11 !important"
              //   },
              //   '[class*="headerText"]':{
              //     "color":settings.secondaryColor+" !important"
              //   },
              //   '[class*="labelText"]':{
              //     "color":settings.secondaryColor+"cc !important"
              //   },
              //   '[class*="_input"]':{
              //     "background-color":settings.primaryColor+"cc !important",
              //     "color":settings.secondaryColor+" !important"
              //   },
              //   '[class*="_itemText"] p':{
              //     "color":settings.secondaryColor+" !important"
              //   },
              //   '[class*="buttonSelected"], [class*="buttonWithIcon"]:hover':{
              //     "background-color":settings.secondaryColor+"33 !important"
              //   },
              //   '[class*="undoRedoResetWrapper"]':{
              //     "background":settings.primaryColor+" !important",
              //     "color":settings.secondaryColor+" !important"
              //   },
              //   '[class*="buttonWithIcon"]':{
              //     "color":settings.secondaryColor+" !important"
              //   },
              //   '[class*="_positionable"]':{
              //     "background":settings.primaryColor+" !important"
              //   },
              //   '[class*="_container"]':{
              //     "background-color":"transparent !important"
              //   },
              // }
            },
          },
        },
        callPrefetch: true,
      });
    }
    catch(err){
      alert("could not connect to thoughtspot")
    }
    if (settings.username){
      
      //getToken()
    }
  }

  loadDefaultFilters();
  loadRestContent();


}, [initKey])*/