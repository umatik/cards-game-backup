<template>
    <div>
        <!-- why you're using v-bind? you can write just `:disabled`
        analogical you're not using v-on:click here but `@`, so you can use `:` for props -->
        <!-- disabled here are not intuitive, the name is negation and you add another negation here, it looks confusing -->
        <b-button
            variant="outline-light"
            size="lg"
            v-bind:disabled="!canBeYounger"
            @click="giveAnswer('younger')"
        >
            Younger
        </b-button>
        &nbsp;
        <!-- how about adding margin-left instead of using nbsp? -->
        <b-button
            variant="outline-light"
            size="lg"
            v-bind:disabled="!canBeOlder"
            @click="giveAnswer('older')"
        >
            Older
        </b-button>
    </div>
</template>

<script>
export default {
    name: 'ButtonsComponent',
    props: ['card'],
    data() {
        return {
            minCard: '2', // I have strong feeling those values should be props not hardcoded in the component
            maxCard: 'ACE'
        }
    },
    computed: {
        canBeYounger: function () {
            // This is also black magic to me
            // Why you check this logic here? I would manipualte those values from the outer component, and remove min/max card
            // So you would have one component with 2 buttons. You can emit 2 events (or single event with 2 values), and have 2 props to disable each button if needed.
            return this.card ? this.card.value !== this.minCard : false
        },
        canBeOlder: function () {
            return this.card ? this.card.value !== this.maxCard : false
        }
    },
    methods: {
        giveAnswer(answer) {
            this.$emit('user-answer', answer)
        }
    }
}
</script>

<!-- Why you remain empty style? -->
<style scoped>

</style>