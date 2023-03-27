import aes256 from 'aes256';

export const passPhrase = 'justrejoice';

export const encryptAES256 = (plainText) => {
    console.log('plain text passed is', plainText);

    var cipher = aes256.createCipher(passPhrase);
    var encryptedText = cipher.encrypt(plainText);
    console.log('Encrypted text is', encryptedText);
    return encryptedText;
}

export const decryptAES256 = (encryptText) => {
    console.log('plain text passed for decryption is', encryptText);

    var cipher = aes256.createCipher(passPhrase);
    var decryptedText = cipher.decrypt(encryptText);
    console.log('decrypted text is', decryptedText);
    return decryptedText;
}