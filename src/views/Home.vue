<template>
  <new-order-form></new-order-form>
</template>

<script>
import NewOrderForm from "../components/NewOrderForm";

export default {
  data: () => ({
    drawer: null
  }),
  props: {
    source: String
  },
  components: {
    NewOrderForm
  }
};
</script>