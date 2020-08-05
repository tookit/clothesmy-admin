import {
  fetchProducts,
  fetchQuote,
  fetchProductCategories,
  fetchCategoryTree,
  getProductCategoryById,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductCategory,
  updateProductCategory,
  fetchImagesByProductId
} from '@/api/service'
import request from '@/utils/request'
const state = {
  categories: [],
  //props
  units: [
    {
      text: 'Set',
      value: 'set'
    },
    {
      text: 'Meter',
      value: 'meter'
    }
  ],
  types: [
    {
      text: 'Text',
      value: 'text'
    },
    {
      text: 'Numeric',
      value: 'Numeric'
    }
  ]
}
const getters = {
  getProductCategories: (state) => {
    return state.categories
  },
  getPropUnits: (state) => {
    return state.units
  },
  getPropTypes: (state) => {
    return state.types
  }
}
const actions = {
  fetchProducts({ commit }, query) {
    return fetchProducts(query).then((resp) => {
      return resp
    })
  },

  fetchQuote({ commit }, query) {
    return fetchQuote(query).then((resp) => {
      return resp
    })
  },
  fetchProductCategories({ commit }, query) {
    return fetchProductCategories(query).then((resp) => {
      return resp
    })
  },

  fetchProductCategoryTree({ commit }) {
    return fetchCategoryTree().then((resp) => {
      commit('SET_PRODUCT_CATEGORY', resp)
      return resp
    })
  },

  fetchImageByProductId({ commit }, id) {
    return fetchImagesByProductId(id).then((resp) => {
      return resp
    })
  },
  getProductById({ commit }, id) {
    return getProductById(id).then((resp) => {
      return resp
    })
  },

  getProductCategoryById({ commit }, id) {
    return getProductCategoryById(id).then((resp) => {
      return resp
    })
  },
  updateProduct({ commit }, { id, data }) {
    return updateProduct(id, data).then((resp) => {
      return resp
    })
  },
  deleteProduct({ commit }, id) {
    return deleteProduct(id).then((resp) => {
      return resp
    })
  },
  createProductCategory({ commit }, data) {
    return createProductCategory(data).then((resp) => {
      return resp
    })
  },
  updateProductCategory({ commit }, { id, data }) {
    return updateProductCategory(id, data).then((resp) => {
      return resp
    })
  },
  fetchProperty({commit}, query) {
    return request({
      url: '/mall/property',
      method: 'get',
      params: query
    })
  },

  fetchValueById({commit}, id) {
    return request({
      url: `/mall/property/${id}/value`,
      method: 'get',
    })
  },

  getPropertyById({commit}, id) {
    return request({
      url: `/mall/property/${id}`,
      method: 'get',
    })
  },
  attachValueForProperty({commit}, {id,data}) {
    return request({
      url: `/mall/property/${id}/value`,
      method: 'put',
      data: data
    })
  },
  deletePropertyValue({commit}, id) {
    return request({
      url: `/mall/property_value/${id}`,
      method: 'delete',
    })
  }
}
const mutations = {
  SET_PRODUCT_CATEGORY(state, { data }) {
    state.categories = data
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
