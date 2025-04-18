import { useState } from 'react';

function Home () { 
    const [, setData] = useState({data: []});
    var network = ["http://127.0.0.1:5001"];

    var localnode = 'http://127.0.0.1:5001';

    const handleClick = async () => {
        const response = await fetch(localnode+'/connect_node', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "nodes": network
            })
        }); 
        const result = await response.json();
        setData(result);
        const element = document.getElementById('message');
        if (element){
            element.innerHTML = result.message;
        } else {
            console.error('Element not found');
        }
    };


    var [, setData2] = useState({data: new Set()});

    const showNodes = async () => {
        const response = await fetch(localnode+'/connect_node', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "nodes": network
            })
        }); 
        const result = await response.json();
        setData2(result.total_nodes);
        // console.log(nodes);
        const element = document.getElementById('nodes');
        if (element){
            element.innerHTML = result.total_nodes;
        } else {
            console.error('Element not found');
        }
    };

    return (
        <div>
            <img className="vw-100" src="../blockimage2.jpg" alt="Description of image"></img>
            <section className="text-center container">
            <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto">
                <h1>Welcome to FarCoin.</h1>
                <p className="lead text-body-secondary">A new cryptocurrency made in India for ......(??)......</p>
                
                <button onClick={handleClick} className="btn btn-primary my-2 mx-2">Connect to Network</button>
                <button onClick={showNodes} className="btn btn-secondary my-2 mx-2">View Network</button>
                <p id='message' style={{"color": "#0d6efd"}}></p>
                <ol id='nodes' style={{"color":"#6c757d"}}></ol>
            </div>
            </div>
        </section>
        <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div className="col-md-4 d-flex align-items-center">
            <span className="text-muted">© 2025 FarCoin Company, Inc</span>
            </div>
        </footer>
        </div>
        </div>
        
    );
};

export default Home;