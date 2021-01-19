<template>
    <b-modal
        v-model="modalContinue"
        hide-header
        no-close-on-backdrop
    >
        <h4 class="pt-3">Do you want to continue the game?</h4>

        <template #modal-footer="">
            <!-- how about `@click="$emit('continue-game', true)"` ? and you could remove methods at all? -->
            <b-button variant="success" @click="giveAnswer(true)">
                Yes
            </b-button>
            <b-button variant="danger" @click="giveAnswer(false)">
                No
            </b-button>
        </template>
    </b-modal>
</template>

<script>
export default {
    name: 'ModalContinueComponent',
    props: ['modalContinue'],
    methods: {
        giveAnswer(answer) {
            this.$emit('continue-game', answer)
        }
    }
}
</script>

<style scoped>

</style>