
let Vue1

const forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(key, obj[key])
  })
}

class Store {
  constructor(options) {
    // 给每一个组件的 $store 上挂一个state， 让每个组价都可以使用this.$store.state
    // this.state = options.state
    this._s = new Vue1({
      data: {
        state: options.state
      }
    })
    // 得到仓库中的getters ，  如果不写则为空
    let getters = options.getters ?? {}
    this.getters = {}
    Object.keys(getters).forEach(getter => {
      Object.defineProperty(this.getters, getter, {
        get: () => {
          return getters[getter](this.state)
        }
      })
    })
    // 初始化mutations
    let mutations = options.mutations ?? {}
    this.mutations = {}
    Object.keys(mutations).forEach(mutation => {
      this.mutations[mutation] = (payload) => {
        mutations[mutation](this._s.state, payload)
      }
    })
    // 初始化actions
    let actions = options.actions ?? {}
    this.actions = {}
    Object.keys(actions).forEach(action => {
      this.actions[action] = (payload) => {
        actions[action](this, payload)
      }
    })

    
    // 给store上挂一个commit方法， 接收一个方法名  和 参数
    this.commit = (type, payload) => {
      this.mutations[type](payload)
    }
    // 定义dispatch 方法
    this.dispatch = (type, payload) => {
      // console.log(this.actions);
      // console.log(type);
      this.actions[type](payload)
    }
  }
  get state() {
    return this._s.state
  }


}

const install = (_Vue) =>  {
  Vue1 = _Vue
  Vue1.mixin({
    beforeCreate() {
      // 判断如果是根组件的话， 将$store 挂载其上面
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}

