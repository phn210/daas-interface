import { utils } from 'ethers';

// export function getDescriptionHash(ipfsHash: string) {
//     let decodedIpfsHash = utils.base58.decode(ipfsHash).slice(2);

//     return '0x'+Array.from(decodedIpfsHash, byte => {
//         return (Number(byte).toString(16).padStart(2, '0'));
//     }).join('').toString(16);
// }

export function getIpfsHash(descriptionHashData: string) {
    const descriptionHash = (descriptionHashData.toString()).slice(2).match(/.{1,2}/g)?.toString();
    if (descriptionHash == undefined) return null;
    let encodedIpfsHash = descriptionHash.split(',').map(byte => {
        return (parseInt(byte, 16))
    });
    encodedIpfsHash = [18, 32].concat(encodedIpfsHash);
    return utils.base58.encode(encodedIpfsHash);
}