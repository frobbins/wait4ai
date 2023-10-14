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
        const thought_image = response.data.thought_image;
        const ai = response.data.ai || 'please adjust your earbuds';
        const ai_image = response.data.ai_image;

        const thoughtElement = document.createElement('p');
        //thinking emoji
        // thoughtElement.innerHTML = '&#x1F914;  ';
        //headphone emoji
        thoughtElement.innerHTML = '&#x1F3A7;  ';
        chatWindow.appendChild(thoughtElement);

        await typeMessage(thought, thoughtElement);

        setTimeout(async () => {
            const aiElement = document.createElement('p');
            aiElement.innerHTML = '&#x1F916; ';
            chatWindow.appendChild(aiElement);
            await typeMessage(ai, aiElement);

            if (thought_image) {
                const thoughtImageElement = document.createElement('img');
                thoughtImageElement.src = `./images/${thought_image}`;
                thoughtImageElement.alt = 'thought image';
                thoughtImageElement.width = 600;  // You can set the dimensions as needed
                chatWindow.appendChild(thoughtImageElement);
            }

            if (ai_image) {
                const aiImageElement = document.createElement('img');
                aiImageElement.src = `./images/${ai_image}`;
                aiImageElement.alt = 'ai image';
                aiImageElement.width = 600;  // You can set the dimensions as needed
                chatWindow.appendChild(aiImageElement);
            }
        }, 4000);  // 4-second delay

    } catch (error) {
        console.error(error);  // Debugging line
        chatWindow.innerHTML += '<p>AI: Still waiting... </p>';
    }
}
