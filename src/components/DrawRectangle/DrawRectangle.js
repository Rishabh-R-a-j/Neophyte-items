import Item from "./Item";
import store from "./store.png";
import { Button } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";

function DrawRectangle() {
    
    const handleSave = () => { };
    const handleClose = () => { };

    const [borderCoordinates, setBorderCoordinates] = useState([]);
    const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
    const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
    const [currentCoords, setCurrentCoords] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [metrics, setMetrics] = useState([]);
    const [imgWidth, setImgWidth] = useState();
    const [imgHeight, setImgHeight] = useState();
   
    const canvasRef = useRef(null);

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setBorderCoordinates([]);
        setMetrics([]);
        setStartCoords({ x: 0, y: 0 });
        setEndCoords({ x: 0, y: 0 });
        setCurrentCoords({ x: 0, y: 0 });
        setIsDragging(false);
    };

    const handleImgLoad = (e) => {
        setImgWidth(e.target.width);
        setImgHeight(e.target.height);
    }

    //clear the canvas

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        const ctx = canvas.getContext("2d");

        //clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the saved borders
        borderCoordinates.forEach((border) => {
            const { startCoords, endCoords } = border;
            const left = Math.min(startCoords.x, endCoords.x);
            const top = Math.min(startCoords.y, endCoords.y);
            const width = Math.abs(startCoords.x - endCoords.x);
            const height = Math.abs(startCoords.y - endCoords.y);
            ctx.strokeStyle = "white";
            ctx.strokeRect(left, top, width, height);
            //write a text beneath the border
            ctx.fillStyle = "white";
            ctx.font = "13px Arial";
            ctx.fillText(
                `Bay ${borderCoordinates.indexOf(border) + 1}`,
                left + width / 2 - 20,
                top + height + 20
            );
        });

        // Draw the current border
        if (isDragging) {
            const left = Math.min(startCoords.x, currentCoords.x);
            const top = Math.min(startCoords.y, currentCoords.y);
            const width = Math.abs(startCoords.x - currentCoords.x);
            const height = Math.abs(startCoords.y - currentCoords.y);
            ctx.strokeStyle = "white";
            ctx.strokeRect(left, top, width, height);
        } else {
            console.log("border coordinates", borderCoordinates);
        }
    }, [borderCoordinates, startCoords, endCoords, currentCoords, isDragging]);

    const handleMouseDown = (event) => {
        event.preventDefault(); // Prevent default behavior to avoid text selection
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setStartCoords({ x, y });
        setCurrentCoords({ x, y }); // Set current coordinates initially to start coordinates
        setIsDragging(true);
    };

    const handleMouseMove = (event) => {
        if (!isDragging) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setCurrentCoords({ x, y });
    };

    const handleMouseUp = (event) => {
        setIsDragging(false);
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setEndCoords({ x, y });
        console.log("The starting and ending coordinates are");
        console.log(`startCoordinate ${startCoords.x} ${startCoords.y}`);
        setBorderCoordinates([
            ...borderCoordinates,
            { startCoords, endCoords: { x, y } },
        ]);
    };
    function handleUndo(){
        let n=borderCoordinates.length;
        borderCoordinates.splice(n-1,1);
        setBorderCoordinates([...borderCoordinates]);
    }
    return (
        <main className="container">
            <nav class="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
                <a class="navbar-brand">Neophyte</a>
                <div class="d-flex flex-row-reverse">
                    <div class="p-2"><button type="button" class="btn btn-danger ">close</button></div>
                    <div class="p-2">
                        <button type="button" class="btn btn-info" onClick={handleClear}>Clear</button>
                    </div>
                    <div class="p-2"><button type="button" class="btn btn-secondary" >Save</button></div>
                    <div class="p-2"><button type="button" class="btn btn-primary" onClick={handleUndo}>Undo</button></div>

                </div>
            </nav>
            <div className="container">
                <div className="d-flex flex-row">
                    <div
                        onMouseDown={(event) => handleMouseDown(event)}
                        onMouseMove={(event) => handleMouseMove(event)}
                        onMouseUp={(event) => handleMouseUp(event)}
                    >
                        <div class="outsideWrapper">
                            <div class="insideWrapper">
                                <img alt="store" className="coveredImage" src={store} onLoad={(e) => handleImgLoad(e)} />
                                <canvas
                                    ref={canvasRef}
                                    className="coveringCanvas"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="container">
  <div class="row">
    <div class="p-3 col-sm">
    Bay No.
    </div>
    <div class="p-3 col-sm">
    Brand
    </div>
    <div class="p-3 col-sm">
    Actions
    </div>
  </div>
  {
    borderCoordinates.map((border) => {
        const n=borderCoordinates.indexOf(border)+1;
        return(
        <Item no={n} brand={`Bay${n}`} action="act" func={(n)=>{borderCoordinates.splice(n-1,1); setBorderCoordinates([...borderCoordinates])}}/>)
        })
  }
</div>
                </div>
            </div>

        </main>
    );
}
export default DrawRectangle;