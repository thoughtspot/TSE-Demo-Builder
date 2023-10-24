
const DarkModeColors = {
    primary: "#343434",
    secondary: '#efefef'
  }
  const PurpleGreenColors = {
    primary: "#304286",
    secondary: "#ffffff",
    button: "#86BDBB",
    backgound: "#EDF2F7"
  
  }
  export enum StyleOptionList {
    None = 'None',
    DarkMode =  'DarkMode',
    DarkModeTwo = 'DarkModeTwo',
    PurpleGreen = 'PurpleGreen',
    BlueHeader = 'BlueHeader',
    Newspaper = 'Newspaper',
    OrangeWhite = 'OrangeWhite',
    Greenish = 'Greenish'
  }
  
  export const StyleOptions = [
    {
      name: StyleOptionList.DarkModeTwo,
      customCssUrl: "cdn.jsdelivr.net/gh/thoughtspot/custom-css-demo/dark5.css"
    },
    { name: StyleOptionList.Newspaper,
      customCssUrl: "cdn.jsdelivr.net/gh/thoughtspot/custom-css-demo/complete.css"
    },
    {
      name: StyleOptionList.DarkMode,
      customizations: {
        style: {
          customCSS: {
            variables: {
              "--ts-var-button--secondary-color": DarkModeColors.secondary,
              "--ts-var-button--secondary-background":DarkModeColors.primary+"cc",
              "--ts-var-viz-description-color":"#bbb",
              "--ts-var-viz-background":"#424242",
              "--ts-var-viz-title-color":DarkModeColors.secondary,
              "--ts-var-menu-background":DarkModeColors.primary,
              "--ts-var-root-background":DarkModeColors.primary,
              "--ts-var-axis-data-label-color":"#efefef",
            },
            rules_UNSTABLE: {
              ".kpi-module__sublabel":{
                'color': '#bbb'
              },
              ".pinboard-content-module__tile ":{
                'background': "#424242 !important"
              },
              '.menu-module__item:hover':{
                "background":DarkModeColors.primary+"ee !iimportant",
              },
              ".kpi-module__hero":{
                "color":"#ffffff"
              },
              '.highcharts-data-label':{
                'color':'#ffffff !important',
                'text-shadow':'none !important'
              },
              '.rdLoadingIndicatorLowOpacity':{
                "background":"none !important"
              },
              '[data-testid="sage-search-bar"]':{
                "background":DarkModeColors.primary,
                "color":DarkModeColors.secondary
              },
              '[data-testid="sage-completions-dropdown"]':{
                "background":DarkModeColors.primary,
                "color":DarkModeColors.secondary
              },
              '[data-testid="answer-header-action-menu"]':{
                "background":DarkModeColors.primary,
                "color":DarkModeColors.secondary+" !important"
              },
              '[data-testid="answer-config-panel"]':{
                "background":DarkModeColors.primary,
                "color":DarkModeColors.secondary
              },
              '[data-testid="answer-content-loading-indicator"]':{
                "background-color":"none"
              },
              '[class*="_measure"]':{
                "background-color":"#0dce85 !important",
                "border-bottom":"1px solid #0dce85"
              },
              '[class*="_attribute"]':{
                "background-color":"#2770ef !important",
                "border-bottom":"1px solid #2770ef"
              },
              '.axis-label-title':{
                "color":DarkModeColors.secondary+" !important"
              },
              '.highcharts-yaxis-labels text':{
                "color":DarkModeColors.secondary+" !important",
                "fill":DarkModeColors.secondary+" !important"
              },
              '.highcharts-xaxis-labels text':{
                "color":DarkModeColors.secondary+" !important",
                "fill":DarkModeColors.secondary+" !important"
              },
              '[class*="completionText"]':{
                "color":DarkModeColors.secondary+" !important"
              },
              '[class*="completionSubtext"]':{
                "color":DarkModeColors.secondary+"66 !important"
              },
              '[class*="completion"]:hover':{
                "background":DarkModeColors.primary+"66 !important"
              },
              '[class*="footerHelpContainer"]':{
                "background":DarkModeColors.primary+"66 !important"
              },
              '[class*="_selected"]':{
                "background":DarkModeColors.secondary+"11 !important"
              },
              '[class*="answerEditPane"], [class*="answerConfigPanelNav"]':{
                "border-left":"1px solid "+DarkModeColors.secondary+"11 !important"
              },
              '[class*="headerText"]':{
                "color":DarkModeColors.secondary+" !important"
              },
              '[class*="labelText"]':{
                "color":DarkModeColors.secondary+"cc !important"
              },
              '[class*="_input"]':{
                "background-color":DarkModeColors.primary+"cc !important",
                "color":DarkModeColors.secondary+" !important"
              },
              '[class*="_itemText"] p':{
                "color":DarkModeColors.secondary+" !important"
              },
              '[class*="buttonSelected"], [class*="buttonWithIcon"]:hover':{
                "background-color":DarkModeColors.secondary+"33 !important"
              },
              '[class*="undoRedoResetWrapper"]':{
                "background":DarkModeColors.primary+" !important",
                "color":DarkModeColors.secondary+" !important"
              },
              '[class*="buttonWithIcon"]':{
                "color":DarkModeColors.secondary+" !important"
              },
              '[class*="_positionable"]':{
                "background":DarkModeColors.primary+" !important"
              },
              '[class*="_container"]':{
                "background-color":"transparent !important"
              },
            }
          },
        },
      }
    },
    {
      name: StyleOptionList.PurpleGreen,
      customizations: {
        style: {
          customCSS: {
            variables: {
              "--ts-var-button--secondary-color": PurpleGreenColors.button,
              "--ts-var-root-background": PurpleGreenColors.backgound,
              "--ts-var-root-font-family":'Trebuchet MS !important',
              "--ts-var-button--secondary-background":"#d9e9ec",
              "--ts-var-viz-title-color":"#545454",
              "--ts-var-viz-description-color":"#bcbcbc",
              "--ts-var-chip-background":"#dddeed",
              "--ts-var-chip-color":"#7d7ca6"
            },
            rules_UNSTABLE: {
              ".pinboard-edit-header-module__editActionHeader": {
                "background":"white",
                "color":"black"
              },
              ".answer-title-module__titleText":{
                "font-size":"26px",
                "font-weight":"400",
              },
              ".pinboard-content-module__tile":{
                "box-shadow":"none !important"
              },
              ".kpi-module__hero":{
                "font-size":"42px !important",
                "font-weight":"400 !important"
              }
            }
          },
        },
      },
    },
    {
      name: StyleOptionList.BlueHeader,
      customizations: {
        style: {
          customCSS: {
            variables: {
              "--ts-var-button--secondary-color": "#454545",
              "--ts-var-root-background": "#F7FAFE",
              "--ts-var-root-font-family":'Trebuchet MS !important',
              "--ts-var-button--secondary-background":"#F8F9FA",
              "--ts-var-viz-title-color":"#3D66A4",
              "--ts-var-viz-description-color":"#BCBCBC",
              "--ts-var-chip-background":"#F8F9FA",
              "--ts-var-chip-color":"#454545"
            },
            rules_UNSTABLE: {
              ".pinboard-header-module__pinboardHeaderContainer":{
                "box-shadow":"none !important",
                "border":"2px solid #EBF3FD"
              },
              ".chip-base-module__chip.chip-base-module__sizeMedium":{
                "height":"3rem !important"
              },
              '[data-testid="filter-panel-chip"]':{
                "border":"1px solid #CCCCCC",
              },
              ".answer-actions-container-module__answerActionContainer":{
                "background":"#EBF3FD",
                "padding":"5px"
              },
              ".pinboard-edit-header-module__editActionHeader": {
                "background":"white",
                "color":"black"
              },
              ".answer-title-module__titleText":{
                "font-size":"16px",
                "font-weight":"600",
              },
              '[data-testid="description-box"]':{
                "display" : "none !important"
              },
              ".answer-content-module__answerContent":{
                "padding": ".8571428571rem 1.1428571429rem !important"
              },
              ".pinboard-content-module__tile":{
                "box-shadow":"none !important",
                "border":"2px solid #EBF3FD",
              },
              ".answer-content-module__compactVizContainer .answer-content-module__answerVizContainer":{
                "padding":"0px"
              }
            }
          },
        }
      },
    },{
        name: StyleOptionList.OrangeWhite,
        customizations: {
          style: {
            customCSS: {
              variables: {
                "--ts-var-button--secondary-color": "#454545",
                "--ts-var-root-background": "#FFFFFF",
                "--ts-var-root-font-family":'Trebuchet MS !important',
                "--ts-var-button--secondary-background":"#F8F9FA",
                "--ts-var-viz-title-color":"#3D66A4",
                "--ts-var-viz-description-color":"#BCBCBC",
                "--ts-var-chip-background":"none",
                "--ts-var-chip-border-radius":"5px",
                "--ts-var-chip-color":"#454545",
                "--ag-header-background-color":"#fff",
                "--ag-header-column-separator-color":"rgba(234,237,242,0)",
                "--ag-row-height":"45px !important"
              },
              rules_UNSTABLE: {
                ".pinboard-header-module__pinboardHeaderContainer":{
                  "box-shadow":"none !important",
                },
                ".chip-base-module__chip.chip-base-module__sizeMedium":{
                  "height":"3rem !important"
                },
                '[data-testid="filter-panel-chip"]':{
                  "border":"1px solid #CCCCCC",
                },
                ".answer-actions-container-module__answerActionContainer":{
                  "padding":"5px"
                },
                ".pinboard-edit-header-module__editActionHeader": {
                  "background":"white",
                  "color":"black"
                },
                ".answer-title-module__titleText":{
                  "font-size":"0px !important",
                  "font-weight":"600",
                },
                '[data-testid="description-box"]':{
                  "display" : "none !important"
                },
                ".answer-content-module__answerContent":{
                  "padding": ".8571428571rem 1.1428571429rem !important"
                },
                ".pinboard-content-module__tile":{
                  "box-shadow":"none !important",
                },
                ".answer-content-module__compactVizContainer .answer-content-module__answerVizContainer":{
                  "padding":"0px"
                },
                ".ag-header-viewport":{
                  "border-bottom":"1px solid var(--ag-border-color,#eaedf2) !important"
                },
                ".ag-theme-alpine .ag-root-wrapper": {
                  "border":"none !important"
                  /* border-color: var(--ag-border-color,#eaedf2); */
                },
                ".ag-theme-alpine .ag-ltr .ag-cell":{
                  "border-right":"none !important"
                },
                ".ag-header":{
                  "min-height":'70px !important'
                },
                ".ag-cell":{
                  "text-align":"center"
                },
                ".ag-header-cell":{
                  "text-align":"center"
                }
              }
            },
          },
        },
    },
    {
      name: StyleOptionList.Greenish,
      customizations: {
        style: {
          customCSS: {
            variables: {
              "--ts-var-button--secondary-color": "#454545",
              "--ts-var-root-background": "#f6f7f7",
              "--ts-var-viz-border-radius": "0px",
              "--ts-var-root-font-family":'Trebuchet MS !important',
              "--ts-var-button--secondary-background":"#F8F9FA",
              "--ts-var-viz-description-color":"#BCBCBC",
              "--ts-var-chip-background":"#FFFFFF",
              "--ts-var-chip-border-radius":"0",
              "--ts-var-chip-color":"#454545"
            },
            rules_UNSTABLE: {
              
              ".answer-content-module__compactVizContainer .answer-content-module__answerVizContainer":{
                "padding":"20px"
              },
              ".verified-label-module__verifiedLabel":{
                "display":"none !important"
              },
              ".answer-title-module__titleText":{
                "font-size": "22px",
                "font-weight": 400
              },
              ".tile-size-s .kpi-module__hero, .tile-small .kpi-module__hero, .kpi-module__hero":{
                "font-size": "22px !important"
              },
              ".chip-base-module__filter":{
                "border": "1px solid #cccccc"
              },
              ".chip-base-module__chip.chip-base-module__sizeMedium":{
                "height":"3rem !important"
              },
            }
          },
        }
      },
    }
  ]
  