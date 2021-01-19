<template>
    <div class="result">
        <div v-if="isWinner" class="win">You win!</div>
        <div v-else class="loose">You loose</div>
    </div>
</template>

<script>

export default {
    name: 'ResultsComponent',
    props: ['history'],
    computed: {
        round() {
            // this is overcomplicated
            // if (this.history) {
            //    return this.history.length - 1   
            // }
            // return 0;
            let round = 0
            if (this.history) {
                // why you not return valu here, like with `isWinenr` but assign it?
                round = this.history.length - 1
            }

            return round
        },
        isWinner() {
            const item = this.getHistoryItem()
            if (item) {
                return item.winner === true
            }

            return null
        },
    },
    methods: {
        // this can be a comnputed property, currentItem or sth like that
        getHistoryItem() {
            return this.history[this.history.length - 1]
        }
    }
}
</script>

<style scoped>

</style>