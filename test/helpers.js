export const EVM_REVERT = 'error: VM Exception while processing transaction: revert ERC20: transfer amount exceeds balance -- Reason given: ERC20: transfer amount exceeds balance.'
export const INVALID_ARGUMENT = 'invalid address (argument="address", value=0, code=INVALID_ARGUMENT, version=address/5.0.5) (argument="recipient", value=0, code=INVALID_ARGUMENT, version=abi/5.0.7)'
export const INVALID_ARGUMENT2 = 'VM Exception while processing transaction: revert ERC20: transfer amount exceeds balance -- Reason given: ERC20: transfer amount exceeds balance.'
export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000"

export const ether = (n) => {
    return new web3.utils.BN(
        web3.utils.toWei(n.toString(), 'ether')
    )
}

export const tokens = (n) => ether(n)