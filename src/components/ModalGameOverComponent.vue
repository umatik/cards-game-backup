<template>
    <b-modal
            v-model="modalGameOver"
            title="Game Over"
            hide-header
            no-close-on-backdrop
    >
        <h4 class="pt-3">Game Over<br><br>You got {{ myPoints }} points</h4>

        <template #modal-footer="">
            <!-- parenthesis are not needed here -->
            <b-button variant="success" @click="newGame()">
                New game
            </b-button>

        </template>
    </b-modal>
</template>

<script>
export default {
    name: 'ModalGameOverComponent',
    // you will gain error when you modify props, and v-model can modify value (at least theoretically)
    props: [
        'modalGameOver',
        'history'
    ],
    computed: {
        // Why you calculate it here? It looks like place to display result not to calculate the result. You coudl just pass it in the props.
        myPoints: function () {
            let points = 0
            // Also you should use .reduce here not .forEach Clearly you transform an array into a single value here and reduce just suits here very well.
            this.history.forEach((item) => {
                if (item.winner) {
                    points += 0.1
                }
            })

            return points.toFixed(1)
        },
    },
    methods: {
        newGame() {
            this.$emit('new-game')
        }
    }
}
</script>

<style scoped>

</style>