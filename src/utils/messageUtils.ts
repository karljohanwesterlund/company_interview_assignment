export const isMessagePalindrome = (message: string) => {
    const lowerCaseMessage = message.toLowerCase();
    const cleanMessage = lowerCaseMessage.replace(/[^a-z0-9]/g, '');
    return cleanMessage === cleanMessage.split('').reverse().join('');
};
