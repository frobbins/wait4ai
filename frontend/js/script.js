let sequence = 1;

async function typeMessage(message, element) {
    for (let i = 0; i < message.length; i++) {
        element.innerHTML += message[i];
        await new Promise(resolve => setTimeout(resolve, 5)); // 60ms delay between each letter
    }
}

document.getElementById('send-thought').addEventListener('click', sendMessage);

async function sendMessage() {
    console.log("sendMessage called");  // Add this line
    const chatWindow = document.getElementById('chat-window');
    chatWindow.innerHTML = '';

    try {
        const response = await axios.get('https://ymwurigzfb.execute-api.us-east-1.amazonaws.com/lab/chat', {
            params: {
                sequence: sequence  // Pass the sequence number
            }
        });

        console.log(response.data);  // Debugging line

        sequence = parseInt(response.data.sequence, 10) || sequence;  // Update sequence
        sequence += 1;

        const thought = response.data.thought || 'No thought received';
        const thoughtResponse = response.data.response || 'No response received';
        const image = response.data.image;

        const thoughtElement = document.createElement('p');
        thoughtElement.innerHTML = '&#x1F914;  ';
        chatWindow.appendChild(thoughtElement);

        await typeMessage(thought, thoughtElement);

        setTimeout(async () => {
            const responseElement = document.createElement('p');
            responseElement.innerHTML = '&#x1F916; ';
            chatWindow.appendChild(responseElement);
            await typeMessage(thoughtResponse, responseElement);

            if (image) {
                const imgElement = document.createElement('img');
                imgElement.src = `./images/${image}`;
                imgElement.alt = 'Response image';
                imgElement.width = 200;  // You can set the dimensions as needed
                chatWindow.appendChild(imgElement);
            }
        }, 4000);  // 4-second delay

    } catch (error) {
        console.error(error);  // Debugging line
        chatWindow.innerHTML += '<p>AI: Still waiting... </p>';
    }
}
