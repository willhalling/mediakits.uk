<template>
    <div
        v-if="active"
        :class="classes"
        class="Tab gt-scroll-bar"
    >
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'Tab',
        data () {
            return {
                active: false
            }
        },
        props: {
            title: {
                required: true,
                type: String
            },
            isActive: {
                required: false,
                type: Boolean,
                default: false
            }
        },
        computed: {
            classes() {
                return {
                    [`Tab--active`]: this.active,
                };
            },
        },
        created () {
            this.active = this.isActive
        },
        mounted () {
            this.$parent.addTab(this)
        }
    }
</script>

<style lang="scss">
    @import "../../scss/_variables";

    .Tab {
        background-color: $black;
        border: 1px solid $medium-grey;
        border-top: 0;
        padding: $padding;
        margin-bottom: $padding;
        max-height: 400px;
        overflow-y: scroll;
    }
</style>
