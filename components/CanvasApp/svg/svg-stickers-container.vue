<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-12">
        <tabs>
          <tab title="Gratitude" :is-active="true">
            <svg-stickers
                    :icons="GRATITUDE_STICKERS"
                    @addSvg="onAddSvg"
            ></svg-stickers>
          </tab>
          <tab title="Pregnancy">
            <svg-stickers
                    :icons="PREGNANCY_STICKERS"
                    @addSvg="onAddSvg"
            ></svg-stickers>
          </tab>
          <tab title="Baby">
            <svg-stickers
                    :icons="NEW_BABY_STICKERS"
                    @addSvg="onAddSvg"
            ></svg-stickers>
          </tab>
          <tab title="Other">
            <svg-stickers
                    :icons="OTHER_STICKERS"
                    @addSvg="onAddSvg"
            ></svg-stickers>
          </tab>
        </tabs>
      </div>
    </div>
  </div>
</template>

<script>

    import { GRATITUDE_STICKERS, NEW_BABY_STICKERS, PREGNANCY_STICKERS, OTHER_STICKERS } from '../../../constants/svg-stickers';

    export default {
        name: 'SvgStickersContainer',
        mounted() {
          debugger
        },
        data() {
            return {
                GRATITUDE_STICKERS,
                NEW_BABY_STICKERS,
                PREGNANCY_STICKERS,
                OTHER_STICKERS
            }
        },
        methods: {
            onAddSvg(svg) {
                this.$emit('onAddSvg', svg)
            }
        }
    }
</script>