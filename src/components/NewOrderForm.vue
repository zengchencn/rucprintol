<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>创建订单</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-subheader>收件人信息</v-subheader>
              <v-form>
                <v-text-field
                  prepend-icon="person"
                  name="login"
                  label="收件人姓名"
                  type="text"
                  v-model="customerName"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                  prepend-icon="phone"
                  name="phone"
                  label="收件人手机"
                  type="text"
                  v-model="customerPhone"
                  :rules="[rules.required, rules.phoneNumber]"
                ></v-text-field>
                <v-flex md4 sm4 xs4 d-inline-block>
                  <v-select
                    prepend-icon="map"
                    md12
                    label="楼群"
                    :items="locations"
                    v-model="buildingName"
                    :rules="[rules.required]"
                  ></v-select>
                </v-flex>
                <v-flex md4 sm4 xs4 d-inline-flex>
                  <v-select
                    xs12
                    label="楼号"
                    prepend-icon="room"
                    :items="buildingNumberItems"
                    v-model="buildingNumber"
                    :disabled="buildingNumberItems == null"
                    :rules="[rules.required]"
                  ></v-select>
                </v-flex>
                <v-flex md4 sm4 xs4 d-inline-flex>
                  <v-text-field
                    xs12
                    label="房间号"
                    prepend-icon="label"
                    :items="locations"
                    v-model="roomNumber"
                    :rules="[rules.required, rules.roomNumber]"
                  ></v-text-field>
                </v-flex>
              </v-form>
              <v-divider></v-divider>
              <v-subheader>打印文件信息</v-subheader>
              <v-layout>
                <v-flex xs8 sm8 md10 d-inline-flex>
                  <v-text-field prepend-icon="folder" v-model="fileName" label="文件名" readonly></v-text-field>
                </v-flex>
                <v-flex xs4 sm4 md2 d-inline-flex>
                  <upload-btn
                    color="info"
                    block
                    title="浏览"
                    :fileChangedCallback="fileChanged"
                    ripple
                  ></upload-btn>
                </v-flex>
              </v-layout>
              <!-- <v-text-field
                type="number"
                label="文件页数"
                prepend-icon="pages"
                v-model="pageCount"
                :rules="[rules.required, rules.roomNumber]"
              ></v-text-field>-->
              <v-flex xs6 sm6 md4 d-inline-flex>
                <v-select label="纸张" :items="paperTypeI" v-model="paperType" prepend-icon="list"></v-select>
              </v-flex>
              <v-flex xs6 sm6 md4 d-inline-flex>
                <v-select
                  label="大小"
                  :items="paperSizeI"
                  v-model="paperSize"
                  prepend-icon="photo_size_select_large"
                ></v-select>
              </v-flex>
              <v-flex xs6 sm6 md4 d-inline-flex>
                <v-select
                  label="颜色"
                  :items="paperColorI"
                  v-model="paperColor"
                  prepend-icon="invert_colors"
                ></v-select>
              </v-flex>
              <v-flex xs6 sm6 md4 d-inline-flex>
                <v-select
                  label="单双面"
                  :items="paperSigDblI"
                  v-model="paperSigDbl"
                  prepend-icon="unfold_less"
                ></v-select>
              </v-flex>
              <v-flex xs6 sm6 md4 d-inline-flex>
                <v-select
                  label="装订"
                  :items="paperBindingI"
                  v-model="paperBinding"
                  prepend-icon="link"
                ></v-select>
              </v-flex>
              <v-flex xs6 sm6 md4 d-inline-flex>
                <v-text-field
                  type="number"
                  label="份数"
                  prepend-icon="refresh"
                  v-model="printCount"
                  :rules="[rules.required, rules.roomNumber]"
                ></v-text-field>
              </v-flex>
              <v-divider></v-divider>
              <v-layout align-center justify-center>
                <v-subheader>打印单价：{{unitPrice}}元/页</v-subheader>
                <v-subheader>装订费用：{{bindingCost}}元/份</v-subheader>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-flex xs6 sm6 md6 offset-xs2>
                <v-checkbox label="保存地址以供下次使用" v-model="saveAddr"></v-checkbox>
              </v-flex>
              <v-flex xs2 sm2 md2 offset-xs1>
                <v-btn color="primary" round block @click="onNavigateNext">
                  <v-icon>navigate_next</v-icon>
                </v-btn>
              </v-flex>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import UploadButton from "vuetify-upload-button";
var fly = require("flyio");
var numReg = /^[1-9]+[0-9]*]*$/;
export default {
  components: {
    "upload-btn": UploadButton
  },
  data: () => ({
    drawer: null,
    customerName: "",
    customerPhone: "",
    locations: ["品园", "知行", "东风"],
    buildingName: "",
    buildingNumber: "",
    roomNumber: "",
    saveAddr: true,
    file: null,
    printCount: 1,
    // pageCount: 1,
    paperTypeI: [
      "普通纸",
      "铜版纸157g",
      "铜版纸200g",
      "pp背胶（海报）",
      "相纸（海报）"
    ],
    paperType: "普通纸",
    paperSize: "A4（一般不打书）",
    paperBinding: "无装订",
    paperColor: "黑白",
    paperSigDbl: "单面",
    rules: {
      required: value => !!value || "请填写该项",
      phoneNumber: value => {
        if (numReg.test(value)) return true;
        else return "请填写数字";
      },
      roomNumber: value => {
        if (numReg.test(value)) return true;
        else return "请填写数字";
      },
      number: value => {
        if (numReg.test(value)) return true;
        else return "请填写数字";
      }
    }
  }),
  computed: {
    buildingNumberItems() {
      if (this.buildingName == "品园")
        return ["一楼", "二楼", "三楼", "四楼", "五楼", "六楼"];
      if (this.buildingName == "知行")
        return ["一楼", "二楼", "三楼", "四楼", "五楼"];
      if (this.buildingName == "东风")
        return ["一楼", "二楼", "三楼", "四楼", "五楼", "六楼"];
      return null;
    },
    fileName() {
      if (this.file == null) return "";
      else return this.file.name;
    },
    paperSizeI() {
      if (this.paperType == "普通纸") {
        this.paperSize = "A4（一般不打书）";
        return ["A4（一般不打书）", "B5（打成书）", "A5（打成书）"];
      }
      if (this.paperType == "铜版纸157g") {
        this.paperSize = "A4";
        return ["A4"];
      }
      if (this.paperType == "铜版纸200g") {
        this.paperSize = "A4";
        return ["A4"];
      }
      if (this.paperType == "pp背胶（海报）") {
        this.paperSize = "A2";
        return ["A2", "A1"];
      }
      if (this.paperType == "相纸（海报）") {
        this.paperSize = "A2";
        return ["A2", "A1"];
      }
      return [];
    },
    paperColorI() {
      // 普通纸黑白和彩色均支持（除A5），其他纸张只支持彩印
      if (this.paperType == "普通纸") {
        this.paperColor = "黑白";
        return this.paperSize == "A5（打成书）" ? ["黑白"] : ["黑白", "彩色"];
      } else {
        this.paperColor = "彩色";
        return ["彩色"];
      }
    },
    paperSigDblI() {
      // pp背胶和相纸仅单面，其余单双面均可
      if (
        this.paperType == "pp背胶（海报）" ||
        this.paperType == "相纸（海报）"
      ) {
        this.paperSigDbl = "单面";
        return ["单面"];
      } else return ["单面", "双面"];
    },
    paperBindingI() {
      if (
        this.paperType == "pp背胶（海报）" ||
        this.paperType == "相纸（海报）"
      ) {
        this.paperBinding = "无装订";
        return ["无装订"];
      }
      return [
        "无装订",
        "斜角一个钉",
        "竖向两个钉",
        "卡纸胶装(封面标题)",
        "卡纸胶装(封面空白)",
        "彩印封面书籍胶装",
        "彩印封面书籍骑马钉"
      ];
    },
    unitPrice() {
      switch (this.paperType) {
        case "普通纸":
          if (this.paperSize == "A5（打成书）")
            return this.paperSigDbl == "单面" ? 0.07 : 0.06;
          else if (this.paperColor == "黑白")
            if (this.paperSigDbl == "单面") return 0.1;
            else return 0.08;
          else if (this.paperSigDbl == "单面") return 1;
          else return 0.9;
        case "铜版纸157g":
          // if (this.pageCount * this.printCount < 200) {
          if (this.paperSigDbl == "单面") return 1.3;
          else return 0.85;
        // } else {
        // if (this.paperSigDbl == "单面") return 1.2;
        // else return 0.8;
        // }
        case "铜版纸200g":
          // if (this.pageCount * this.printCount < 200) {
          if (this.paperSigDbl == "单面") return 1.5;
          else return 0.95;
        // } else {
        // if (this.paperSigDbl == "单面") return 1.4;
        // else return 0.9;
        // }
        case "pp背胶（海报）":
          if (this.paperSize == "A2") return 7.5;
          else return 18;
        case "相纸（海报）":
          if (this.paperSize == "A2") return 10;
          else return 21;
        default:
          return 0;
      }
    },
    bindingCost() {
      switch (this.paperBinding) {
        case "无装订":
        case "斜角一个钉":
        case "竖向两个钉":
          return 0;
        case "卡纸胶装(封面标题)":
          return 3.49;
        case "卡纸胶装(封面空白)":
          return 2.99;
        case "彩印封面书籍胶装":
          return 5.99;
        case "彩印封面书籍骑马钉":
          return 3.99;
        default:
          return 0;
      }
    }
  },
  methods: {
    fileChanged(file) {
      this.file = file;
    },
    onNavigateNext() {
      if (this.saveAddr) {
        this.$cookie.set("name", this.customerName, 180);
        this.$cookie.set("phone", this.customerPhone, 180);
        this.$cookie.set("building_name", this.buildingName, 180);
        this.$cookie.set("building_number", this.buildingNumber, 180);
        this.$cookie.set("room_number", this.roomNumber, 180);
      } else {
        this.$cookie.delete("name");
        this.$cookie.delete("phone");
        this.$cookie.delete("building_name");
        this.$cookie.delete("building_number");
        this.$cookie.delete("room_number");
      }
      let self = this;
      fly
        .post("http://rucprint.cn:5000/order", {
          customer_name: this.customerName,
          customer_phone: this.customerPhone,
          customer_building_name: this.buildingName,
          customer_building_number: this.buildingNumber,
          customer_room_number: this.roomNumber,
          paper_type: this.paperType,
          paper_size: this.paperSize.substr(0, 2),
          paper_color: this.paperColor,
          paper_sig_or_dbl: this.paperSigDbl,
          paper_binding: this.paperBinding,
          // total_page_count: "4",
          total_copy_count: this.printCount,
          unit_price: this.unitPrice,
          binding_price: this.bindingCost
        })
        .then(res => {
          let form = new FormData();
          let o_id = res.data.order_id;
          form.append("order_id", o_id);
          form.append("file", self.file);
          fly.post("http://rucprint.cn:5000/upload", form).then(res2 => {
            console.log(res2.data);
            self.$router.replace({
              name: "pay",
              params: {
                id: o_id,
                unitprice: self.unitPrice,
                bindingprice: self.bindingCost,
                numpages: res2.data.num_pages,
                copycount: self.printCount,
                totalprice: res2.data.total_price
              }
            });
          });
          console.log(res);
        })
        .catch(res => {
          console.log(res);
        });
    }
  },
  created() {
    // customerName: "",
    // customerPhone: "",
    // locations: ["品园", "知行", "东风"],
    // buildingName: "",
    // buildingNumber: "",
    // roomNumber: "",
    this.customerName = this.$cookie.get("name");
    this.customerPhone = this.$cookie.get("phone");
    this.buildingName = this.$cookie.get("building_name");
    this.buildingNumber = this.$cookie.get("building_number");
    this.roomNumber = this.$cookie.get("room_number");
  }
};
</script>