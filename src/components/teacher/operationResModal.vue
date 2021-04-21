<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>{{title}}</span>
    </p>
    <div>
      <span style="font-size: 14px">{{content}}</span>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'OperationResModal',
  props: {
    showModalOperationRes: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalOperationRes
      },
      set: function () {
      }
    }
  },
  methods: {
    ok () {
      this.$emit('update:showModalOperationRes', false)
    },
    cancel () {
      this.$emit('update:showModalOperationRes', false)
    }
  }
}
</script>

<style scoped>

</style>
