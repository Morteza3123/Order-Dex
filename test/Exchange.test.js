import { EVM_REVERT, INVALID_ARGUMENT, INVALID_ARGUMENT2, tokens } from './helpers'


const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')


require('chai')
    .use(require('chai-as-promised'))
    .should()




contract('Exchange', ([deployer, feeAccount, user1]) => {
    let token;
    let exchange;
    const feePercent = 10;
    beforeEach(async () => {

        //deploy token
         token = await Token.new()

         //transfer some token to user1
         token.transfer(user1, tokens(10), {from : deployer})

         //deploy exchange
         exchange = await Exchange.new(feeAccount, feePercent)
    })

    describe('deployment', () => {

        

        it('tracks the fee account', async () => {
          const result = await exchange.feeAccount()
          result.should.equal(feeAccount)
        })
        
        it('tracks the fee percent', async () => {
          const result = await exchange.feePercent()
          result.toString().should.equal(feePercent.toString())
        })


    })

    describe('depositing tokens', () => {
        let amount;
        let result;

        
        describe('success', () => {
                beforeEach(async () => {
                    amount = tokens(10)
                await token.approve(exchange.address, tokens(10), {from : user1})
                result = await exchange.depositToken(token.address, tokens(10), { from : user1})  
                })
            it('tracks the token deposit', async () => {
                let balance
                balance = await token.balanceOf(exchange.address)
                balance.toString().should.equal(amount.toString())
                balance = await exchange.tokens(token.address, user1, {from : user1});
                balance.toString().should.equal(amount.toString())
            })

            it('emit an Deposit event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Deposit')
                const event = log.args
                event.token.should.equal(token.address, 'token address is correct')
                event.user.should.equal(user1, 'user address is correct')
                event.amount.toString().should.equal(tokens(10).toString(), 'amount is correct')
                event.balance.toString().should.equal(tokens(10).toString(), 'balance is correct')
            })
        })
        
        describe('failure', () => {
            it('fails when no tokens are approved', async () => {
                //dont approve any roken befor depositing
                await exchange.depositToken(token.address, tokens(10), {from : user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })


    })
    
})
            

            