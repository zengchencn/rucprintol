<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>订单结算</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <p class="title text-xs-center">您的订单号：{{orderId}}</p>
              <v-layout align-center justify-center>
                <v-subheader>打印单价：{{unitPrice}}元/页</v-subheader>
                <v-subheader>装订单价：{{bindingPrice}}元/本</v-subheader>
              </v-layout>
              <v-layout align-center justify-center>
                <v-subheader>每份页数：{{numPages}}页</v-subheader>
                <v-subheader>打印份数：{{copyCount}}份</v-subheader>
              </v-layout>
              <p class="title text-xs-center">需要支付{{totalPrice}}元</p>
              <p class="text-xs-center red--text">请务必在支付时备注订单号！</p>
              <v-tabs centered grow>
                <v-tab>微信支付</v-tab>
                <v-tab-item>
                  <v-img :src="require('@/assets/wxp.png')"></v-img>
                </v-tab-item>
                <v-tab>支付宝</v-tab>
                <v-tab-item>
                  <v-img :src="require('@/assets/alipay.png')"></v-img>
                </v-tab-item>
                <v-tab>支付宝红包</v-tab>
                <v-tab-item>
                  <v-img :src="require('@/assets/alipay_rp.png')"></v-img>
                </v-tab-item>
              </v-tabs>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn block round color="success" @click="onSuccess">我已完成支付</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
var fly = require("flyio");

export default {
  data() {
    return {
      orderId: this.$route.params.id,
      unitPrice: this.$route.params.unitprice,
      bindingPrice: this.$route.params.bindingprice,
      numPages: this.$route.params.numpages,
      copyCount: this.$route.params.copycount,
      totalPrice: this.$route.params.totalprice
    };
  },
  methods: {
    onSuccess() {
      fly
        .post("https://rucprint.cn/api/pay", { order_id: this.orderId })
        .then(result => {
          this.$router.replace("success");
        });
    }
  }
};
</script>
