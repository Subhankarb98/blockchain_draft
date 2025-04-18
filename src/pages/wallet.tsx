import { useState } from 'react';

function Wallet () {
    const [, setData] = useState({data: []});
    var localnode = 'http://127.0.0.1:5001';

    const Wallet = async () => {
        const response = await fetch(localnode+'/wallet', {
            method: 'GET'
        }); 
        const result = await response.json();
        setData(result);

        const element = document.getElementById('head');
        if (element) {
            var ml = `<p>Public Key: <b>${result.publicKey}</b></p>`;
            ml += `<p>Balance: <b>${result.Balance} FRC</b></p>`;
            ml += `<p>Transactions:</p>`;
            ml += `<table class="table my-2">
                    <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Sender</th>
                        <th scope="col">Receiver</th>
                        <th scope="col">Amount</th>
                    </tr>
                    </thead>`;

            ml += `<tbody>`;
            for (var i=0; i<result.Txs.length; i++){
                if (result.Txs[i].sender == result.publicKey){
                    var col = 'red';
                } else {
                    col = 'green';
                }
                ml += `<tr>
                    <th scope="row">${result.Txs[i].id}</th>
                    <td>${result.Txs[i].sender}</td>
                    <td>${result.Txs[i].receiver}</td>
                    <td style="color: ${col}">${result.Txs[i].amount} FRC</td>
                    </tr>`;
            }
            ml += `</tbody>`;
            ml += `</table>`;
            element.innerHTML = ml;
        } else {
            console.error('Element not found.');
        }
    }
    // Wallet();

    return (
        <div className="my-2">
            <button onClick={Wallet} className="btn btn-primary my-3 mx-5">Profile</button>
            <div className='mx-5 my-5' id='head' />
        </div>
    );
}

export default Wallet;