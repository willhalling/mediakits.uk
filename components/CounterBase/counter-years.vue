<template>
  <g>
    <path
      :fill="colours.primary"
      d="M21.76,56.4v1.32a.24.24,0,0,1-.28.28h-11a.25.25,0,0,1-.28-.28V56.4a.25.25,0,0,1,.28-.28h4.37V42.18l-4.17,2c-.17.07-.29,0-.36-.08l-.7-1.29a.25.25,0,0,1,.14-.37L15,39.91a1.15,1.15,0,0,1,.54-.11h1.17a.37.37,0,0,1,.42.42v15.9h4.37A.25.25,0,0,1,21.76,56.4Z" />
    <circle
      :fill="colours.primary"
      cx="15.33"
      cy="15.33"
      r="2.5" />
    <path
      :fill="hightlightedCircle(1)"
      d="M15.33,6A9.34,9.34,0,1,1,6,15.33,9.35,9.35,0,0,1,15.33,6m0-6A15.34,15.34,0,1,0,30.67,15.33,15.33,15.33,0,0,0,15.33,0Z" />
    <path
      :fill="colours.primary"
      d="M66.64,56.21a.23.23,0,0,1,.1.19v1.32a.25.25,0,0,1-.1.2.37.37,0,0,1-.21.08H53.75a.39.39,0,0,1-.3-.13.4.4,0,0,1-.12-.29V56.8a5,5,0,0,1,.33-1.68,5.48,5.48,0,0,1,1.39-1.94,18.33,18.33,0,0,1,3.29-2.32,33.83,33.83,0,0,0,3.13-2,8.23,8.23,0,0,0,1.4-1.3,4.6,4.6,0,0,0,.76-1.28,3.72,3.72,0,0,0,.25-1.36,3.23,3.23,0,0,0-1.17-2.64,4.87,4.87,0,0,0-3.2-1,11.22,11.22,0,0,0-2.64.32,8.46,8.46,0,0,0-2.26.89.4.4,0,0,1-.56-.17l-.44-1.07c-.08-.18,0-.34.19-.47a9.49,9.49,0,0,1,2.68-1.05,12.83,12.83,0,0,1,3-.38,7.34,7.34,0,0,1,4.81,1.43A4.87,4.87,0,0,1,66,44.76a5.7,5.7,0,0,1-.52,2.38,6.75,6.75,0,0,1-1.61,2.11,19.07,19.07,0,0,1-3.11,2.18c-1.34.8-2.23,1.35-2.67,1.66A9.59,9.59,0,0,0,57,54a6.87,6.87,0,0,0-.89,1,4.39,4.39,0,0,0-.57,1.12H66.43A.32.32,0,0,1,66.64,56.21Z" />
    <circle
      :fill="colours.primary"
      cx="60.05"
      cy="15.33"
      r="2.5" />
    <path
      :fill="hightlightedCircle(2)"
      d="M60.33,6A9.34,9.34,0,1,1,51,15.33,9.35,9.35,0,0,1,60.33,6m0-6A15.34,15.34,0,1,0,75.67,15.33,15.33,15.33,0,0,0,60.33,0Z" />
    <path
      :fill="colours.primary"
      d="M110,49.89a4.4,4.4,0,0,1,1.29,3.27,4.52,4.52,0,0,1-1.9,3.86,8.66,8.66,0,0,1-5.21,1.4,11.74,11.74,0,0,1-2.59-.34,10.72,10.72,0,0,1-3.09-1.26.45.45,0,0,1-.2-.53l.36-1.06a.34.34,0,0,1,.19-.2.22.22,0,0,1,.23,0,11.28,11.28,0,0,0,2.51,1.11,8.87,8.87,0,0,0,2.59.4,5.84,5.84,0,0,0,3.58-1,3.13,3.13,0,0,0,1.38-2.66,3.28,3.28,0,0,0-.26-1.24,3,3,0,0,0-.89-1.18,4.28,4.28,0,0,0-1.61-.81,6.7,6.7,0,0,0-1.78-.27h-1.65a.24.24,0,0,1-.28-.28V47.89a.25.25,0,0,1,.28-.28h1.45a4.75,4.75,0,0,0,2-.46A4.17,4.17,0,0,0,108,46a2.74,2.74,0,0,0,.2-3.08,2.94,2.94,0,0,0-1.35-1.17,5.11,5.11,0,0,0-2.25-.47,10.39,10.39,0,0,0-2.07.21,7.54,7.54,0,0,0-2.3,1,.39.39,0,0,1-.33,0,.34.34,0,0,1-.23-.22l-.36-1a.4.4,0,0,1,.22-.48,9.1,9.1,0,0,1,5.07-1.37,7.15,7.15,0,0,1,4.4,1.26,3.91,3.91,0,0,1,1.68,3.28,4,4,0,0,1-1.14,2.87,5.64,5.64,0,0,1-2.9,1.55A5.79,5.79,0,0,1,110,49.89Z" />
    <circle
      :fill="colours.primary"
      cx="104.76"
      cy="15.33"
      r="2.5" />
    <path
      :fill="hightlightedCircle(3)"
      d="M104.33,6A9.34,9.34,0,1,1,95,15.33,9.35,9.35,0,0,1,104.33,6m0-6a15.34,15.34,0,1,0,15.34,15.33A15.33,15.33,0,0,0,104.33,0Z" />
    <path
      :fill="colours.primary"
      d="M156.12,53.55v1.31c0,.19-.08.28-.25.28H153.8v3.14a.25.25,0,0,1-.28.28H152a.24.24,0,0,1-.28-.28V55.14h-8.9a.57.57,0,0,1-.42-.16.61.61,0,0,1-.17-.42v-1L149.65,40a.22.22,0,0,1,.16-.13.37.37,0,0,1,.23,0l1.4.53a.23.23,0,0,1,.16.14.24.24,0,0,1,0,.22L144.72,53.3h7V47.56a.24.24,0,0,1,.28-.28h1.49a.25.25,0,0,1,.28.28V53.3h2.07A.22.22,0,0,1,156.12,53.55Z" />
    <circle
      :fill="colours.primary"
      cx="149.47"
      cy="15.33"
      r="2.5" />
  </g>
</template>

<script>
export default {
  name: 'CounterYears',
  props: {
    colours: {
      type: Object,
      required: true
    },
    hightlightedCircle: {
      type: Function,
      required: true
    }
  }
}
</script>
