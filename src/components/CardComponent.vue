<template>
    <div>
        <div v-show="!cardIsLoaded" class="picking-card">Picking a card...</div>
        <img v-show="cardIsLoaded" v-bind:src="card.image" @load="loaded" alt="Card">
    </div>
</template>

<script>

export default {
    name: 'CardComponent',
    // I would just pass the cardSrc here in props
    props: ['card'],
    computed: {
        cardIsLoaded() {
            return this.card
        }
    },
    methods: {
        loaded() {
            this.$emit('card-is-loaded')
        }
    }
}
</script>

<style scoped>

</style>