<template>
    <div class="score-table">
        <div class="float-right">Points: {{ myPoints }}</div>
        <div class="">Round: {{ myRound }} of {{ maxRounds }}</div>
    </div>
</template>

<script>
export default {
    name: 'RoundHistoryComponent',
    props: [
        'history',
        'maxRounds'
    ],
    data() {
        return {
            showScoreTable: true
        }
    },

    computed: {
        myPoints: function () {
            // Same case as in other file. You can use reduce.
            let points = 0
            this.history.forEach((item) => {
                if (item.winner) {
                    points += 0.1
                }
            })

            return points.toFixed(1)
        },
        myRound() {
            return this.history.length
        }
    }
}
</script>

<style scoped>

</style>