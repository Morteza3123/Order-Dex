import { EVM_REVERT, INVALID_ARGUMENT, INVALID_ARGUMENT2, tokens } from './helpers'


const Token = artifacts.require('./Token')


require('chai')
    .use(require('chai-as-promised'))
    .should()




contract('Token', ([deployer, receiver, exchange]) => {
    let name = 'oxin'
    let symbol = 'OXN'
    let decimals = '18'
    let totalSupply = tokens(1000000)
    let token
    beforeEach(async () => {
         token = await Token.new()
    })

    describe('deployment', () => {
        it('tracks the name', async () => {
          const result = await token.name()
          result.should.equal(name)
        })

        it('tracks the symbol', async () => {
            const result = await token.symbol()
            result.should.equal(symbol)
        })

        it('track the decimals', async () => {
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        })

        it('tracks the total supply', async () => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply.toString())
        })

        it('assign the total supply to the deployer', async () => {
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalSupply.toString())
        })

    })

    describe('sending tokens', () => {
        let result
        let amount

        describe('success', async () => {
            beforeEach(async () => {
                amount = tokens(100)
                result = await token.transfer(receiver, amount, {from : deployer})
           })
            
            it('transfer token balances', async () => {
                let balanceOf
                
                //transfer
                balanceOf = await token.balanceOf(deployer)
                balanceOf.toString().should.equal(tokens(999900).toString())
                balanceOf = await token.balanceOf(receiver)
                balanceOf.toString().should.equal(tokens(100).toString())
            })
    
            it('emits a transfer event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Transfer')
                const event = log.args
                event.from.toString().should.equal(deployer, 'from is correct')
                event.to.toString().should.equal(receiver, 'to is correct')
                event.value.toString().should.equal(amount.toString(), 'value is correct')
            })
        })

        describe('failure', async () => {
            it('rejects insufficient balances', async () => {
                let invalidAmount
                invalidAmount = tokens(10000000) // 100 million is greater than total supply
                await token.transfer(receiver, invalidAmount, {from : deployer}).should.be.rejectedWith(EVM_REVERT);
                
                //Attempt to transfer rokens, when you have none
                invalidAmount = tokens(10) // recipient has no tokens
                await token.transfer(deployer, invalidAmount, {from : receiver}).should.be.rejectedWith(EVM_REVERT);
            })

            it('refects invalid recipient', async () => {
                // await token.transfer(0x0, amount, {from : deployer}).then(tx => console.log(tx))
                await token.transfer(0x0, amount, {from : deployer}).should.be.rejectedWith(INVALID_ARGUMENT);
            })
        })


        
    })

    describe('approving tokens', () => {
        let result
        let amount

        beforeEach(async () => {
            amount = tokens(100)
            result = await token.approve(exchange, amount, { from : deployer})
        })

        describe('success', () => {
            it('allocates an allowance for delegated token spending', async () => {
                const allowance = await token.allowance(deployer, exchange)
                allowance.toString().should.equal(amount.toString())
            })

            it('emit an Approval event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Approval')
                const event = log.args
                event.owner.toString().should.equal(deployer, 'deployer is correct')
                event.spender.toString().should.equal(exchange, 'spender is correct')
                event.value.toString().should.equal(amount.toString(), 'value is correct')
            })
        })


        describe('failure', () => {
            it('reject invalid spender', async () => {
                await token.approve(0x0, amount, {from : deployer}).should.be.rejected
            })
        })
    })

    describe('transfer from token', () => {
        let result
        let amount

        beforeEach(async () => {
            amount = tokens(100)
            await token.approve(exchange, amount, {from : deployer})
        })

        
        describe('success', () => {
            beforeEach(async () => {
                amount = tokens(100)
                result = await token.transferFrom(deployer, receiver, amount, { from : exchange})
            })
            it('tokens has been transfered successfully', async () => {
                let balanceOf
                balanceOf = await token.balanceOf(deployer)
                balanceOf.toString().should.equal(tokens(999900).toString())
                balanceOf = await token.balanceOf(receiver)
                balanceOf.toString().should.equal(tokens(100).toString())
            })

            it('reset the allowance', async () => {
                const allowance = await token.allowance(deployer, exchange)
                allowance.toString().should.equal(tokens(0).toString())
            })

            it('emit an Transfer event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Transfer')
                const event = log.args
                event.from.toString().should.equal(deployer, 'from is correct')
                event.to.toString().should.equal(receiver, 'to is correct')
                event.value.toString().should.equal(amount.toString(), 'value is correct')
            })
        })


        describe('failure', () => {
            it('reject invalid spender', async () => {
                let invalidAmount
                invalidAmount = tokens(10000000) // 100 million is greater than total supply
                await token.transferFrom(deployer, receiver, invalidAmount, { from : exchange}).should.be.rejectedWith(INVALID_ARGUMENT2);
            })

            it('refects invalid recipient', async () => {
                // await token.transfer(0x0, amount, {from : deployer}).then(tx => console.log(tx))
                await token.transferFrom(deployer, 0x0, amount, {from : exchange}).should.be.rejected;
            })
        })
    })
    
})
            

            