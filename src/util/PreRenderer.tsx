import {
    Action,
    EmbedEvent,
    HostEvent,
    LiveboardEmbed,
    RuntimeFilterOp
  } from "@thoughtspot/visual-embed-sdk";
import React from "react";
  import { useRef, useEffect, useContext, createContext, useState } from "react";
  
  const prerenderdLiveboardContext = createContext<any>({});
  
  export const PrerenderedLiveboardShell = () => {
    const ref = useRef(null);
    const lb = useRef<LiveboardEmbed | null>(null);
    const { isVisible, liveboardId, coords } = useContext(
      prerenderdLiveboardContext
    );
    useEffect(() => {
      if (!ref.current) {
        return;
      }
      lb.current = new LiveboardEmbed(ref.current, {
        visibleActions: [Action.Explore],
        frameParams: {
          height: "1200px"
        }
      });
      lb.current.prerenderGeneric();
    }, []);
    useEffect(() => {
      if (!liveboardId) {
        return;
      }
      lb.current?.navigateToLiveboard(liveboardId);
    }, [liveboardId]);
    return (
      <div
        id="prerender"
        style={{
          opacity: isVisible ? 1 : 0,
          ...coords,
          position: "absolute"
        }}
        ref={ref}
      ></div>
    );
  };
  
  export const PrerenderdLiveboardProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [liveboardId, setLiveboardId] = useState();
    const [coords, setCoords] = useState({
      left: 0,
      top: 0,
      height: 0,
      width: 0
    });
    return (
      <prerenderdLiveboardContext.Provider
        value={{
          isVisible,
          setIsVisible,
          liveboardId,
          setLiveboardId,
          coords,
          setCoords
        }}
      >
        {children}
        <PrerenderedLiveboardShell />
      </prerenderdLiveboardContext.Provider>
    );
  };
  
  export const Liveboard = () => {
    const ref = useRef<HTMLElement | null>(null);
    const { setIsVisible, setLiveboardId, setCoords } = useContext(
      prerenderdLiveboardContext
    );
    useEffect(() => {
      if (!ref.current) {
        return;
      }
      setLiveboardId("c7366d05-dc19-4aae-8f72-e8acf1d641e1");
      const coords = ref.current.getBoundingClientRect();
      const offset = getOffset(ref.current);
      setCoords({
        height: coords.height,
        width: coords.width,
        top: offset.top,
        left: offset.left
      });
      setIsVisible(true);
    }, []);
    //@ts-ignore
    return <div ref={ref}></div>;
  };
  
  function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }
  