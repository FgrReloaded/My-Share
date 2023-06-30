import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import QRCode from "react-qr-code";
import "./App.css";
import randomstring from 'randomstring';
import { useNavigate } from 'react-router-dom';
import Some from './Some';



function Home() {
  const socketRef = useRef();
  const navigate = useNavigate();
  const host = process.env.SITE;
  const roomId = randomstring.generate(9);
  const [scanBtn, setScanBtn] = useState("Scan Code");
  const [showScan, setShowScan] = useState(false);
  const showScanner = (e) => {
    let d = document.getElementById("html5-qrcode-button-camera-stop")
    if (d) {
      d.click()
    }
    if (!showScan) {
      setShowScan(true);
      setScanBtn("Close Scanner");
    } else {
      setShowScan(false);
      setScanBtn("Scan Code");
    }
  }
  useEffect(() => {
    socketRef.current = io(host, {
      query: { roomId }
    });
    socketRef.current.on("request", (rooms) => {
      navigate(`/my-share/room=${rooms}`, { replace: true });
    })
  }, [navigate, roomId, host]);

  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 pt-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left md:mb-16 mb-3 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl font-medium text-gray-900">My Share<br className="hidden lg:inline-block" />
            </h1>
            <span className="subtitle sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Make Sharing Easy</span>
            <p className="mb-8 leading-relaxed read"><span className='text-red-600'> Visit this site from your other device and Scan the QR code </span> from your device to share any data including files such as images, sounds, documents etc. and any text, links on your devices in just one click.</p>
            <div div className="flex justify-center">
              <button onClick={showScanner} className={`showScan`}>{scanBtn}</button>
            </div>

          </div><div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <div className="container">
              {!showScan && (<div className="qrCode">
                <QRCode className="qr"
                  size={200}
                  value={roomId}
                />
              </div>)}
              {showScan &&
                <section className='scanner'>
                  <Some />
                </section>
              }
            </div>
          </div>

        </div>
      </section>

    </>

  )
}

export default Home