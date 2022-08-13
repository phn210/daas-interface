import { utils } from 'ethers'

const PADDING = {
    CHAINID: 8,
    DAOINDEX: 32,
    PROPOSALID: 32,
    LOGINDEX: 4,
    TXHASH: 32,
    ADDRESS: 20,
    TOPIC: 32,
};


export function resolveDAOId(daoId: string) {
    const obj = {
        chainId: 0,
        index: 0
    };
    let i = 0;
    try {
        if (daoId.length != PADDING.CHAINID*2 + PADDING.DAOINDEX*2 + 2)
            throw {message: 'Invalid daoId length'};
        obj.chainId = Number(utils.hexDataSlice(daoId, i, i+= PADDING.CHAINID));
        obj.index = Number(utils.hexDataSlice(daoId, i, i+= PADDING.DAOINDEX));    
    } catch (err) {
        console.error(err);
        throw err;
    }
    return obj;
}

export function resolveProposal(proposalId: string) {
    const obj = {
        chainId: 0,
        governor: '',
        id: ''
    }
    let i = 0;
    try {
        if (proposalId.length != PADDING.CHAINID*2 + PADDING.ADDRESS*2 + PADDING.PROPOSALID*2+2)
            throw {message: 'Invalid proposalId length'};
        obj.chainId = Number(utils.hexDataSlice(proposalId, i, i+= PADDING.CHAINID));
        obj.governor = utils.hexDataSlice(proposalId, i, i+= PADDING.ADDRESS);
        obj.id = utils.hexDataSlice(proposalId, i, i+= PADDING.PROPOSALID);    
    } catch (err) {
        console.error(err);
        throw err;
    }
    return obj;
}