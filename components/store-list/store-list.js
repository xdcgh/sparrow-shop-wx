// components/store-list/store-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    storeInfo: {
      'type': Object,
      'value': null
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectStore() {
      this.triggerEvent('select', this.data.storeInfo.id);
    }
  }
})