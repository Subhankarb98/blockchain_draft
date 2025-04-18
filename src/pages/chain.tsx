import { useState } from 'react';

function Chain (){
    const [data, setData] = useState({data: []});

    var localnode = 'http://127.0.0.1:5001';
    
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
        <button className='btn btn-light mx-2' onClick={replaceChain}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
        </svg></button>
        </div>
        </div>
        <div className="row">
        <div className="col-5 mx-3 my-3 flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center" style={{"overflow-y": "scroll", "height": "500px"}} id="blocks">
        </div>
        <div className="col mx-3 my-3 p-4 gap-4 py-md-5" style={{"overflow-y": "scroll", "height": "500px", "backgroundColor": "#F7F9F2"}} id="chain">
        </div>
        </div>
        </div>
    );
};

export default Chain;