import axios from 'axios'
import { Model as BaseModel } from 'vue-api-query'

BaseModel.$http = axios

export default class Model extends BaseModel {

  baseURL () {
    return process.env.VUE_APP_BASE_API_HOST + '/api/'
  }

  // implement a default request method
  request (config) {
    return this.$http.request(config)
  }
}