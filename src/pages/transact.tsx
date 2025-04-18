import { useState } from 'react';

function Transact () {

    const [, setData] = useState({data: []});

    var localnode = 'http://127.0.0.1:5001';
    
    // GET request
    const getTransactions = async () => {
        const response = await fetch(localnode+'/get_transactions', {
            method: 'GET'
        }); 
        const result = await response.json();
        setData(result);

        const element = document.getElementById('message');
        var list = result.transactions
        if (element){
            var ml = `<table class="table mx-2 my-2">
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

    const handleSubmit = async (e) => {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        
        const response = await fetch(localnode+'/add_transaction', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "sender": formJson.sender,
                "receiver": formJson.receiver,
                "amount": formJson.amount
            })
        });
        const result = await response.json();
        setData(result);
        // getTransactions();
        const element = document.getElementById('added');
        if (element){
            element.innerHTML = `${result.message}`
        } else {
            console.error('Element not found.')
        }
    };


    return (
        <div className="mx-3 my-2">
            <div className='mx-5 my-5 p-4' style={{"backgroundColor": "#F7F9F2"}}>
                <h5>Add transaction</h5>
                <form method="post" onSubmit={handleSubmit}>
                    <p>Sender: <input name='sender' required/></p>
                    <p>Receiver: <input name='receiver' required/></p>
                    <p>Amount: <input type='number' step={0.1} name='amount' required/></p>
                    <button className="btn btn-danger btn-sm" type="submit">ADD</button>
                </form>
                <b id='added' style={{"color": "red"}}></b>
            </div>
            <button className="btn btn-light mx-2 my-2" onClick={getTransactions}>Show Mempool</button>
            <div id='message' />
        </div>
    );
};

export default Transact;