<template>
  <div class="page-mall-item view">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-subheader v-if="item">{{ item.name }}</v-subheader>
          <v-tabs class="route-tab" v-model="defaultTab">
            <v-tab
              v-for="(item, key) in tabs"
              :key="key"
              v-show="showTab(item)"
              :href="'#' + item.value"
            >
              {{ item.text }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="defaultTab">
            <v-tab-item key="general" value="general">
              <form-product :item="item" :loading="loading" />
            </v-tab-item>
            <v-tab-item key="media" value="media">
              <media
                @selected="handleSelectMedia"
                :directory="directory"
                @attach="handleAttachMedia"
              />
            </v-tab-item>
            <v-tab-item key="seo" value="seo">
              <seo-form
                :item="item"
                :loading="loading"
                :action="updateProduct"
              />
            </v-tab-item>
            <v-tab-item key="prop" value="prop">
              <form-product-property :item="item" />
            </v-tab-item>
            <v-tab-item key="stock-and-price" value="stock-and-price">
              <sku-table :specs="['Color', 'Size']" :product-id="id" />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FormProduct from '@/components/form/product/FormProduct'
import SeoForm from '@/components/form/SeoForm'
import FormProductProperty from '@/components/form/product/FormProductProperty'
import SkuTable from '@/components/table/SkuTable'
import Media from '@/components/media/Index'
import { attachMediaForProduct } from '@/api/service'
import { mapActions } from 'vuex'
export default {
  props: {
    id: [Number, String]
  },
  components: {
    SeoForm,
    Media,
    FormProduct,
    FormProductProperty,
    SkuTable
  },
  data() {
    return {
      defaultTab: 'general',
      tabs: [
        {
          text: 'General',
          value: 'general'
        },
        {
          text: 'Media',
          value: 'media'
        },
        {
          text: 'SEO',
          value: 'seo'
        },
        {
          text: 'Properties',
          value: 'prop'
        },
        {
          text: 'Stock & Price',
          value: 'stock-and-price'
        }
      ],
      loading: false,
      item: null,
      images: []
    }
  },
  computed: {
    uploadAction() {
      return `${process.env.VUE_APP_BASE_API_HOST}/api/mall/item/${this.id}/image`
    },
    directory() {
      return `clothes/${this.id}`
    }
  },
  watch: {
    id: {
      handler(id) {
        if (id) {
          this.fetchRecord(id)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['updateProduct']),
    fetchRecord(id) {
      this.loading = true
      this.$store.dispatch('getProductById', id).then(({ data }) => {
        this.item = data
        this.loading = false
      })
    },
    fetchImages() {
      return this.$store.dispatch('fetchImageByProductId', this.id)
    },
    showTab({ value }) {
      if (this.id) {
        return true
      } else {
        return value === 'general'
      }
    },
    handleSelectMedia() {},
    handleAttachMedia(item) {
      attachMediaForProduct(this.id, item.id).then(() => {})
    }
  }
}
</script>

<style></style>
