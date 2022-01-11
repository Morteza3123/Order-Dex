import { tokens } from './helpers'


const Token = artifacts.require('./Token')


require('chai')
    .use(require('chai-as-promised'))
    .should()




contract('Token', ([deployer, receiver]) => {
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
        })
    })
})
            

            