import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import Player from './components/Player';
import { getLocalCopy } from './services/translate';
import NoVideo from './components/NoVideo';
import { GetExpanse } from './services/expanse';

function App() {

  let [videoId, setVideoId] = useState<string | null>(null);
  let [language, setLanguage] = useState<Record <string, Record<string, string>> | null>(null);
  let [expanse, setExpanse] = useState<Object | null>(null);

  // Get URL Params
  useEffect(() => {
    // Set Language
    setLanguage(getLocalCopy());
    
    // Get the Video ID
    let urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('data')) {
      let url = atob(urlParams.get('data')?.split('.')[1] as string);
      try {
        let xml = new XMLHttpRequest();
        xml.open("GET", url, false);
        xml.overrideMimeType("application/json");
        xml.send();
        if(xml.status === 200 && xml.readyState === 4) {
          setExpanse(JSON.parse(xml.responseText));
        }
      } catch(e) {
        console.log(e);
      }
    }
    if(urlParams.has('id')) {
      let id = urlParams.get('id');
      setVideoId(id?.toString() ?? null);
    }

  }, [videoId])

  return (
    <div className="App" >
      {(videoId && expanse !== null) ? 
        <Player lang={language} expanse={expanse} videoId={videoId} />
      : 
        <NoVideo lang={language}/>
      }
    </div>
  );
}

export default App;
