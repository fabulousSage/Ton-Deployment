import { Address, toNano, beginCell } from '@ton/core';
import { JettonWallet } from '../wrappers/JettonWallet';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const sender = provider.sender();

    const senderAddress = provider.sender()?.address;
    if (!senderAddress) {
        throw new Error('Sender address is undefined.');
    }

    const jettonWallet = provider.open(
        JettonWallet.createFromAddress(Address.parse('0QBGvIWDLtPpt07s371KER-m3tqd6mxYaL5tT6p3rYCqAK84')),
    );

    const sendAmount = toNano(10); // Amount of Jettons to send to each address
    const forwardAmount = toNano('0.05'); // Forward amount for each transfer

    // Define an array of recipient addresses
    const recipientAddresses = [
        'UQCuL3Pn1Ix4R8VuAkpn65wy_fwBAVt7MANBzJLXCSU6EFwV',
        'UQCtZ8XbV5Xx4u8Vv_vPfjF1jVWt8j4rAJFuDNWk3uJrDGCX',
        'UQDpL6Jp6vVeY8Gw5vM8hz9jE6zAp8UnyUBtjC7Kz6by1ErH'
        // Add as many addresses as you need here
    ];

    // Loop over each recipient and attempt to send transfer
    for (const recipient of recipientAddresses) {
        try {
            const recipientAddress = Address.parse(recipient);

            await jettonWallet.sendTransfer(
                sender,
                toNano(0.1), // Transaction fee
                sendAmount,
                recipientAddress,
                senderAddress,
                beginCell().endCell(),
                forwardAmount,
                beginCell().endCell(),
            );

            console.log(`Transferred ${sendAmount} jettons to ${recipient}`);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Failed to transfer to ${recipient}:`, error.message);
            } else {
                console.error(`Failed to transfer to ${recipient}: Unknown error`);
            }
        }
    }
}
