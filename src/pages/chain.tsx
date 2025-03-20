import { useState } from 'react';

function Chain (){
    const [data, setData] = useState({data: []});

    var localnode = 'http://127.0.0.1:5000';
    
    // GET request
    async function fetchData() {
        const response = await fetch(localnode+'/get_chain',{
            method: 'GET',
        });
        const result = await response.json();
        setData(result);
    }
    // fetchData();

    async function replaceChain() {
        const response = await fetch(localnode+'/replace_chain',{
            method: 'GET',
        });
        fetchData();
    }

    var len = data.length;
    const blocks = document.getElementById('blocks');
    if (blocks){
        blocks.innerHTML = `<div id="list-example" className="list-group">`;
        for (var i=len-1; i >= 0; i--) {
            blocks.innerHTML += `<a className="list-group-item list-group-item-action" href="#list-item-${i+1}"><button type="button" class="btn btn-outline-primary btn-lg mx-2 my-2">Block ${i+1}</button></a>`;
        }
        blocks.innerHTML += `</div>`;
    } else {
        console.error('Element not found.')
    }

    var chain = data.chain;
    const chainElement = document.getElementById('chain');
    if (chainElement) {
        chainElement.innerHTML = `<div data-bs-spy="scroll" data-bs-target="#list-example" data-bs-smooth-scroll="true" className="scrollspy-example" tabindex="0">`;
        for (var i=len-1; i >= 0; i--) {
            chainElement.innerHTML += `<div id='list-item-${i+1}' class="my-2">`;
            chainElement.innerHTML += `<h4>Block ${i+1}</h4>`;
            chainElement.innerHTML += `<p> <b>Index</b>: ${chain[i].index}</p>`;
            chainElement.innerHTML += `<p> <b>Previous Hash</b>: ${chain[i].prev_hash}</p>`;
            chainElement.innerHTML += `<p> <b>Proof</b>: ${chain[i].proof}</p>`;
            chainElement.innerHTML += `<p> <b>TimeStamp</b>: ${chain[i].timestamp}</p>`;
            chainElement.innerHTML += `<div class="dropdown"><b>Transactions</b>:<button class="btn btn-light dropdown-toggle" data-toggle="dropdown">${chain[i].transactions.length}</button> <ol class="dropdown-menu"><li class="dropdown-item">Action</li><li class="dropdown-item">Action</li></ol></div>`;
            chainElement.innerHTML += `<hr style={{ border: '1px solid #000', margin: '20px 0' }} />`;
            chainElement.innerHTML += `</div>`;
        }
        chainElement.innerHTML += `</div>`; 
    } else {
        console.error('Element not found.');
    }


    return (
        
        <div>
        <div className='mx-3 my-3'>
        <div className='mx-2'>
        <button className="btn btn-primary mx-2" onClick={fetchData}>Get Chain</button>
        <button className='btn btn-light mx-2' onClick={replaceChain}>Refresh</button>
        </div>
        </div>
        <div className="row">
        <div className="col-5 mx-3 my-3 flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center" style={{"overflow-y": "scroll", "height": "500px"}} id="blocks">
        </div>
        <div className="col mx-3 my-3 p-4 gap-4 py-md-5" style={{"overflow-y": "scroll", "height": "500px", "backgroundColor": "#F7F9F2"}} id="chain">
        </div>
        </div>
        <div className="dropdown">
        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
        </button>
        <ul className="dropdown-menu">
            <li><button className="dropdown-item" type="button">Dropdown item</button></li>
            <li><button className="dropdown-item" type="button">Dropdown item</button></li>
            <li><button className="dropdown-item" type="button">Dropdown item</button></li>
        </ul>
        </div>
        </div>
    );
};

export default Chain;
