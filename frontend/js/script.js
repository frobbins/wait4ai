async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    const chatWindow = document.getElementById('chat-window');

    // Clear the input field
    document.getElementById('user-input').value = '';

    try {
        const response = await axios.get('https://ymwurigzfb.execute-api.us-east-1.amazonaws.com/lab/chat', {
            params: {
                user_input: userInput
            }
        });

        const thoughts = response.data.thoughts || [];

        if (thoughts.length === 0) {
            chatWindow.innerHTML += '<p>Server: No thoughts available for this sequence.</p>';
        } else {
            let message = 'Exploring your thoughts...<br/><br/>';
            thoughts.forEach((thought, index) => {
                message += `<br/>${index + 1}. ${thought}`;
            });
            chatWindow.innerHTML += `<p>${message}</p>`;
        }
    } catch (error) {
        chatWindow.innerHTML += '<p>Server: Failed to fetch data</p>';
    }
}
