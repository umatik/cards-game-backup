<template>
    <div>

        <b-list-group-item class="bg-dark text-white" v-for="(item, key) in history" :key="key">
            <!-- you have a lot of logic here in template, I would extract it to the computed, example below -->
            <b>{{item.card.value}}</b> {{item.answer === 'older' ? 'is older' : 'is younger'}} than
            <b>{{item.oldCard.value}}</b> - {{item.winner ? 'you won!' : 'you loosed...'}}
        </b-list-group-item>
        <!--
        <b-list-group-item class="bg-dark text-white" v-for="({ newCard, oldCard, joiner, ending }, key) in cardHistory" :key="key">
            <b>{{ newCard }}</b> {{ joiner }} than
            <b>{{ oldCard }}</b> - {{ ending }}
        </b-list-group-item>
        -->
    </div>
</template>

<script>
export default {
    name: 'ScoreTableComponent',
    props: ['history'],
    /*
    computed: {
        cardHistory() {
            return this.history.map(item => ({
                newCard: item.card.value,
                oldCard: item.oldCard.value,
                joiner: item.answer === 'older' ? 'is older' : 'is younger',
                ending: item.winner ? 'you won!' : 'you loosed...',
            }));
        }
    },
    */
}
</script>

<style scoped>

</style>