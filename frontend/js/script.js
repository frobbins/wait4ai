const axios = require('axios'); // If you're using a module bundler like Webpack

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    const chatWindow = document.getElementById('chat-window');

    // Clear the input field
    document.getElementById('user-input').value = '';

    try {
        const response = await axios.get('https://your-api-gateway-url/chat', {
            params: {
                user_input: userInput
            }
        });

        const message = response.data.thoughts || 'No thoughts received';
        chatWindow.innerHTML += `<p>Server: ${message}</p>`;
    } catch (error) {
        chatWindow.innerHTML += '<p>Server: Failed to fetch data</p>';
    }
}
