<template>
    <div>
        <div class="Tabs">
            <div v-for="(tab, index) in tabs" :key="index" :class="[{'Tabs--active': current === tab}]" class="Tabs__item"
                 @click="changeTab(tab)">
                <span
                    v-if="current === tab"
                    class="Tabs__icon"
                >
                    <svg-base
                        id="SvgDownArrow"
                        icon-name="SvgDownArrow"
                        :width="16"
                        :height="16"
                        colour="#FFF"
                    >
                        <component is="SvgDownArrow" />
                    </svg-base>
                </span>
                <span class="Tabs__text">{{tab.title}}</span>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'Tabs',
        data: () => ({
            tabs: [],
            current: null
        }),

        methods: {
            addTab (tab) {
                this.tabs.push(tab)
                if (tab.active === true) {
                    this.current = tab
                }
            },
            changeTab (tab) {
                this.current = tab
                this.tabs.forEach(function (value) {
                    if (value === tab) {
                        value.active = true
                    } else {
                        value.active = false
                    }
                })
            }
        }

    }
</script>

<style lang="scss">
    @import "../../scss/_variables";
    @import "../../scss/_mixins.scss";

    .Tabs {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        border-bottom: 1px solid $medium-grey;
        @include media-query('small') {
            flex-direction: row;
        }
        &__item {
            text-transform: uppercase;
            display: block;
            border: 1px solid $light-grey;
            border-bottom-color: $white;
            padding: $padding;
            margin-right: $padding / 2;
            letter-spacing: 0.094em;
            font-size: $text-s;
            text-decoration: none;
            color: $white;
            background-color: $grey-2;
            cursor: pointer;
            transition: all 0.25s ease-in-out;
            border-radius: 0;
            font-family: $tertiaryFont;
            margin-bottom: -1px;
            width: 100%;
            display: flex;
            align-items: center;
            @include media-query('small') {
                width: auto;
            }
        }
        &__icon {
            display: flex;
            align-items: center;
            margin-right: $padding / 2;
        }
        &--active {
            background-color: $black;
            border-color: $medium-grey;
            border-bottom-color: $black;
            color: $white;
        }
    }
</style>
