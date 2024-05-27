import React, { useState, useEffect } from 'react'
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode"
import { useNavigate } from 'react-router-dom';


const Some = () => {
    const navigate = useNavigate();
    const [result, setResult] = useState(false)
    const [cameraId, setCameraId] = useState(null);
    let scanner;


    useEffect(() => {
        setResult(false)
        if (!scanner?.getState()) {
            scanner = new Html5QrcodeScanner("reader", {
                qrbox: {
                    width: 250,
                    height: 250
                },
                fps: 5,

            })
            const success = (res) => {
                scanner.clear()
                setResult(true)
                setTimeout(() => {
                    navigate(`/my-share/room=${res}`, { replace: true });
                }, 1000);
            }
            scanner.render(success)
        }

    }, [cameraId, scanner])

    return (
        <>
            <div id="reader"></div>
            {result ? <div className='lds-roller'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div> : ""}
        </>
    )
}

export default Some