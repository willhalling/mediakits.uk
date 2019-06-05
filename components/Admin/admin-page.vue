<template>
  <div>
    <gt-header/>
    <div class="adminPage gt-background-black gt-padding-top gt-padding-bottom">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-4">
            <admin-sidebar/>
          </div>
          <div class="col-xs-12 col-sm-8">
            <slot/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { localStorageMixin } from '../../mixins/localStorageMixin'
import { adminMixin } from '../../mixins/adminMixin'
export default {
  name: 'AdminPage',
  mixins: [localStorageMixin, adminMixin]
}
</script>
