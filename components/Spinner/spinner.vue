<template>
  <div class="spinner">
    <div class="spinner__container">
      <div class="icon icon--ei-spinner-2 icon--m">
        <div class="icon__spinner">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="icon__cnt" 
            viewBox="0 0 50 50">
            <circle 
              cx="25" 
              cy="10" 
              r="2"/>
            <circle 
              opacity=".3" 
              cx="25" 
              cy="40" 
              r="2"/>
            <circle 
              opacity=".3" 
              cx="32.5" 
              cy="12" 
              r="2"/>
            <circle 
              opacity=".3" 
              cx="17.5" 
              cy="38" 
              r="2"/>
            <circle 
              opacity=".93" 
              cx="17.5" 
              cy="12" 
              r="2"/>
            <circle 
              opacity=".3" 
              cx="32.5" 
              cy="38" 
              r="2"/>
            <circle 
              opacity=".65" 
              cx="10" 
              cy="25" 
              r="2"/>
            <circle 
              opacity=".3" 
              cx="40" 
              cy="25" 
              r="2"/>
            <circle 
              opacity=".86" 
              cx="12" 
              cy="17.5" 
              r="2"/>
            <circle 
              opacity=".3" 
              cx="38" 
              cy="32.5" 
              r="2"/>
            <circle 
              opacity=".44" 
              cx="12" 
              cy="32.5" 
              r="2"/>
            <circle 
              opacity=".3" 
              cx="38" 
              cy="17.5" 
              r="2"/>
          </svg>
        </div>
      </div>
      <div class="spinner__text">
        Please wait
      </div>
      <div 
        v-if="progress" 
        class="spinner__progress">{{ progress }} %</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Spinner',
  props: {
    progress: {
      type: Number,
      default: null
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
@import '../../scss/_colours.scss';

.spinner {
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  &__progress {
    color: white;
    font-size: 16px;
    //margin-top: 10px;
    position: absolute;
    font-family: 'Roboto', serif;
  }

  &__text {
    color: $white;
    font-weight: bold;
    font-family: $tertiaryFont;
    text-transform: uppercase;
    margin-top: 10px;
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.icon {
  background-color: $black;
  position: relative;
  display: inline-block;
  width: 25px;
  height: 25px;
  overflow: hidden;
}

.icon__cnt {
  width: 100%;
  height: 100%;
  background: inherit;
  fill: $white;
  pointer-events: none;
  transform: translateX(0);
}

.icon--m {
  width: 50px;
  height: 50px;
}

.icon__spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.icon--ei-spinner .icon__spinner,
.icon--ei-spinner-2 .icon__spinner {
  animation: spin 1s steps(12) infinite;
}
</style>
