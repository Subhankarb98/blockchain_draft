import { useState } from 'react';

function Mine () {
    const [isLoading, setIsLoading] = useState(false);
    const [, setData] = useState({data: []});

    var localnode = 'http://127.0.0.1:5001';

    // GET request
    const getTransactions = async () => {
        const response = await fetch(localnode+'/get_transactions', {
            method: 'GET'
        }); 
        const result = await response.json();
        setData(result);

        const element = document.getElementById('pool');
        var list = result.transactions
        if (element){
            var ml = `<table class="table mx-5 my-2">
                    <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Sender</th>
                        <th scope="col">Receiver</th>
                        <th scope="col">Amount</th>
                    </tr>
                    </thead>`;

            ml += `<tbody>`;
            for (var i=0; i<list.length; i++){
                ml += `<tr>
                    <th scope="row">${list[i].id}</th>
                    <td>${list[i].sender}</td>
                    <td>${list[i].receiver}</td>
                    <td>${list[i].amount}</td>
                    </tr>`;
            }
            ml += `</tbody>`;
            ml += `</table>`;
            element.innerHTML = ml;
        } else {
            console.error('Element not found');
        }
    };

    // GET request
    async function mineBlock() {
        setIsLoading(true);
        const response = await fetch(localnode+'/mine_block',{
            method: 'GET',
        });
        const result = await response.json();
        // setData2(result);
        const block = document.getElementById('block');
        // console.log(result)
        if (block) {
            block.innerHTML += `<h4 style="color: green">${result.message}</h4>`
            block.innerHTML += `<hr style={{ border: '1px solid #000', margin: '20px 0' }} />`
            block.innerHTML += `<h4>Block ${result.index}</h4>`;
            block.innerHTML += `<p> <b>Index</b>: ${result.index}</p>`;
            block.innerHTML += `<p> <b>Previous Hash</b>: ${result.prev_hash}</p>`;
            block.innerHTML += `<p> <b>Proof</b>: ${result.proof}</p>`;
            block.innerHTML += `<p> <b>TimeStamp</b>: ${result.timestamp}</p>`;
            block.innerHTML += `<div class="dropdown"><b>Transactions</b>:<button class="btn btn-light dropdown-toggle" data-toggle="dropdown">${result.transactions.length}</button> <ol class="dropdown-menu"><li class="dropdown-item">Action</li><li class="dropdown-item">Action</li></ol></div>`;
        } else {
            console.error('Element not found.')
        }
        setIsLoading(false);
    }

    return (
        <div className="my-2">
            <button className="btn btn-light mx-5 my-2" onClick={getTransactions}>Show Mempool</button>
            <div id='pool'></div>
            <button className="btn btn-success my-5 mx-5 btn-lg" onClick={mineBlock}>🛠 Mine Block</button>
            {isLoading ? <h5 className='mx-5 my-2'>Mining......</h5> : null}
            <div className='mx-5 my-5' id='block'></div>
        </div>
    );
};

export default Mine;
