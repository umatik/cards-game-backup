<template>
    <div id="app" class="container game">

        <div class="row" v-if="showGameTable">
            <div class="col-3">
                <CardComponent
                    v-bind:card="card"
                    @card-is-loaded="setCardIsLoaded(true)"
                />
            </div>
            <div class="col-3">
                <div class="question">
                    Next card will be?
                </div>

                <div class="pt-3">
                    <ButtonsComponent
                        v-bind:card="card"
                        @user-answer="prepareAnswer"
                    />
                </div>

                <div v-if="cardIsLoaded">
                    <ResultsComponent
                        v-if="!cardsAreEqual && gameRound"
                        v-bind:history="history"
                    />
                    <MessageComponent
                        v-bind:has-lucky="hasLucky"
                        v-bind:is-equal="cardsAreEqual"
                    />
                </div>
            </div>

            <div class="col-6">
                <div v-if="showScores">
                    <RoundHistoryComponent
                        v-bind:history="history"
                        v-bind:maxRounds="maxRounds"
                    />
                    <ScoreTableComponent
                        v-bind:history="history"
                    />
                </div>
            </div>
        </div>

       <ModalContinueComponent
           v-bind:modalContinue="modalContinue"
           @continue-game="continueGame"
       />

       <ModalGameOverComponent
            v-bind:modalGameOver="modalGameOver"
            v-bind:history="history"
            @new-game="newGame"
        />
    </div>
</template>

<script>

import CardComponent from "@/components/CardComponent";
import ButtonsComponent from "@/components/ButtonsComponent";
import ResultsComponent from "@/components/ResultsComponent";
import RoundHistoryComponent from "@/components/RoundHistoryComponent"
import MessageComponent from "@/components/MessageComponent";
import ScoreTableComponent from "@/components/ScoreTableComponent";
import ModalContinueComponent from "@/components/ModalContinueComponent";
import ModalGameOverComponent from "@/components/ModalGameOverComponent";
import VueCookies from "vue-cookies"

// There is lots of methods and computed properties.
// You can easily extract those to some js module and just import it here.
// Currently your logic is tightly coupled with vue component and it creates lots of mess.
// However, it can be challanging to create proper reactivity.
export default {
    name: 'App',

    components: {
        // Use shorter syntax and don't duplicate those names
        CardComponent: CardComponent,
        ButtonsComponent: ButtonsComponent,
        ResultsComponent: ResultsComponent,
        RoundHistoryComponent: RoundHistoryComponent,
        ScoreTableComponent: ScoreTableComponent,
        ModalContinueComponent: ModalContinueComponent,
        ModalGameOverComponent: ModalGameOverComponent,
        MessageComponent: MessageComponent
    },

    data() {
        return {
            maxRounds: 20,
            deck: null,
            gameRound: 0,
            card: false,
            oldCard: false,
            answer: null,
            winner: null,
            history: [],
            cardsStack: [],

            showGameTable: false,
            cardIsLoaded: false,
            modalContinue: false,
            acceptedAnswers: {
                younger: 'younger',
                older: 'older'
            }
        }
    },

    computed: {
        cardsAreEqual() {
            // It looks like you need a class
            // First question on my mind is why it can be just `return stack.areLastTwoEqual()`
            const stack = this.getCardsStack()
            const card = stack[stack.length - 1]
            const oldCard = stack[stack.length - 2]

            return oldCard && card.value === oldCard.value
        },
        hasLucky() {
            // The same as above. Also you're using here 2 as a number and there was places with `minCard` where you use it as a string.
            // question remain the same why it can't be:
            // const card = stack.getLast();
            // return card.isLucky([2, 'ACE']);
            const stack = this.getCardsStack()
            const card = stack[stack.length - 1]
            // 'ACE' might be extract to some constat to have handling them. Generally I would create a const for all cards:
            // const CARDS = {
            //   C2: '2',
            //   C3: '3',
            //   ...
            //   ACE: 'ACE'   
            // };
            // and use it here as [ CARDS.C2, CARDS.ACE ]
            // or if you don't want to prefix them [ CARDS[2], CARDS.ACE ]
            const luckyIndex = [2, 'ACE']
            
            if (card) {
                const cardValue = isNaN(card.value) ? card.value : parseInt(card.value)
                return luckyIndex.find(index => index === cardValue)
            }

            return false
        },
        showScores() {
            if (this.gameRound === 0 && this.winner === null){
                return false
            // if you return in the first if, then why you need else here?
            } else if (this.answer && this.gameRound > 0 || this.winner === null && this.gameRound > 0) {
                return true
            }

            // how about just simple return instead of all those if-els'es:
            // return this.gameRound > 0 && (this.answer || !this.winner);
            return false
        },
        modalGameOver() {
            return this.gameRound === this.maxRounds && this.cardIsLoaded;
        }
    },

    // why you use different syntax here? not just:
    // created() {},
    created: function () {
        this.createDeck()
        this.modalContinue = this.isCookies()

        if (!this.modalContinue) {
            this.setShowGameTable(true)
            this.getData()
        }
    },

    methods: {
        createDeck() {
            // why you have 2 empty objects here?
            // can't you iterate those cards based on 0 index and just adapt index to proper valu on some sort of mapping?
            // like card 9 -> CARDS.JACK card 2 -> CARDS.C4, etc.
            const deck = [{}, {}]
            for (let i = 2; i < 11; i++) {
                deck.push(i)
            }
            deck.push('JACK', 'QUEEN', 'KING', 'ACE')

            this.deck = deck
        },
        getData() {
            // it looks liek cantdidate fo a separate module.
            // import { getCard } from my-lovely-module;
            // const card = await getCard();
            // params probably should be hiodden in such module.
            const param = {
                url: 'https://deckofcardsapi.com/api/deck/new/draw/?count=1',
                method: 'GET',
            }

            // eslint-disable-next-line no-undef
            axios(param)
                .then(response => {
                    const card = this.createCard(response)
                    this.addToCardsStack(card)

                    // This method call getData however it looks it made much more. It also evaluates results
                    if (this.getAnswer()) {
                        this.roundResult()
                    }
                }).catch(error => {
                    console.info(error)
                })
        },
        loadData() {
            this.loadHistory()
            const lastItem = this.getHistoryItem()

            this.setGameRound(lastItem.gameRound)
            this.setCard(lastItem.card)
            this.setOldCard(lastItem.oldCard)
            this.setAnswer(lastItem.answer)
            this.setWinner(lastItem.winner)
        },
        // this space before parenthesis is weired.
        // this is also not intuitive for me, logic as follows is much more clear from my perspective.
        // if (this.cardsAreEqual) {
        //   return;
        // }
        // this.addGameRound();
        // this.makeWinner();
        // etc.
        roundResult () {
            if (!this.cardsAreEqual) {
                this.addGameRound()
                this.makeWinner()
                this.setHistory()
                this.setCookies()
            }
        },

        // All those history you would liek to extract from here and have some modul for them.
        setHistory() {
            this.history.push({
                gameRound: this.getGameRound(),
                card: this.getCard(),
                oldCard: this.getOldCard(),
                winner: this.getWinner(),
                answer: this.getAnswer()
            })
        },
        // you re-create it each time? why? can't you just use previous value? Using cookies seems to be wired.
        getHistory() {
            const history = this.getCookies()
            return JSON.parse(history)
        },
        resetHistory() {
            this.history = []
        },
        loadHistory() {
            this.history = this.getHistory()
        },
        getHistoryItem(gameRound = false) {
            if (!gameRound) {
                gameRound = this.history.length - 1
            }
            return this.history[gameRound]
        },

        makeWinner() {
            const newCard = this.getCard()
            const newCardIndex = this.getCardIndex(newCard)

            const oldCard = this.getOldCard()
            const oldCardIndex = this.getCardIndex(oldCard)

            if (oldCardIndex === newCardIndex) {
                this.setWinner(null)
            }

            switch (this.getAnswer()) {
                case this.acceptedAnswers.younger:
                    this.setWinner(newCardIndex < oldCardIndex)
                    break
                case this.acceptedAnswers.older:
                    this.setWinner(newCardIndex > oldCardIndex)
                    break
            }
        },
        // why your using setWinner for such things? isn't exactly what vue does for you when you make this.winner = 'something'?
        setWinner(winner) {
            this.winner = winner
        },
        // why your using getWinner here? it looks like redundant thing to what vue does
        getWinner() {
            return this.winner
        },

        // another set of methods which just replaces
        // this.gameRound = value
        // into
        // this.setGameRound(value)
        // or 
        // this.game
        // into
        // this.getGameRound()
        // or
        // this.game += 1
        // into
        // this.addGameRound()
        addGameRound() {
            this.gameRound++
        },
        setGameRound(gameRound) {
            this.gameRound = gameRound
        },
        getGameRound() {
            return this.gameRound
        },
        // why you process response here? it look out of it's scope
        createCard(response) {
            this.card = {
                image: response.data.cards[0].image,
                value: response.data.cards[0].value
            }

            return this.card
        },
        // Same story as with game
        setCard(card) {
            this.card = card
        },
        getCard() {
            return this.card
        },
        setOldCard(card) {
            this.oldCard = card
        },
        getOldCard() {
            return this.oldCard
        },
        // there is also array method .findIndex
        // this cardValue is also wired, if youw ould base on soem indexes with mapping this probably could be much simpler
        getCardIndex(card) {
            const cardValue = isNaN(card.value) ? card.value : parseInt(card.value)
            const cardObj = this.deck.find(myCard => myCard === cardValue)
            
            return this.deck.indexOf(cardObj)
        },
        // same story with thosie setters/gettes
        setCardIsLoaded(loaded) {
            this.cardIsLoaded = loaded
        },
        // this coul have sense if you would have soem external state to modify. However, here everything is avaialble in `this`
        addToCardsStack(card) {
            this.cardsStack.push(card)
        },
        getCardsStack() {
            return this.cardsStack
        },

        setAnswer(answer) {
            this.answer = answer
        },
        getAnswer() {
            return this.answer
        },
        prepareAnswer(answer) {
            this.setAnswer(answer)
            this.setOldCard(this.card)
            this.setCard(false)
            this.setCardIsLoaded(false)
            this.getData()
        },

        setCookies() {
            VueCookies.set('history', JSON.stringify(this.history), "1h")
        },
        getCookies() {
            return VueCookies.get('history')
        },
        isCookies() {
            return VueCookies.isKey('history')
        },
        removeCookies() {
            VueCookies.remove('history')
        },

        continueGame(continueGame) {
            this.setShowModalContinue(false)
            this.setShowGameTable(true)

            if (continueGame) {
                this.loadData()
            } else {
                this.resetGame()
                this.removeCookies()
                this.getData()
            }
        },
        newGame() {
            this.resetGame()
            this.removeCookies()
            this.getData()
        },
        resetGame() {
            this.setGameRound(0)
            this.setCard(false)
            this.setOldCard(false)
            this.setAnswer(null)
            this.setWinner(null)
            this.resetHistory(null)
        },

        setShowGameTable(show) {
            this.showGameTable = show
        },
        setShowModalContinue(show) {
            this.modalContinue = show
        },

    }
}
</script>

<style lang="scss">

@import './sass/app.scss';

</style>