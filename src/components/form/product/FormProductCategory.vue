<template>
  <v-card>
    <v-card-text>
      <v-form>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-cascader
                :items="getProductCategories"
                v-model="formModel.categories"
                :readonly="parent_id ? true : false"
                @change="handleCategoryChange"
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.name"
                outlined
                label="Name"
                name="name"
                placeholder="Name"
                @change="handleNameChange"
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.slug"
                readonly
                label="Slug"
                outlined
                placeholder="Slug"
                append-icon="mdi-eye"
                @click:append="handleViewItem"
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.featured_img"
                label="Featured Image"
                outlined
                placeholder="Featured Image"
                append-icon="mdi-image"
                @click:append="handlePickImage"
              />
            </v-col>
            <v-col :cols="6">
              <v-select
                v-model="formModel.flag"
                label="Flag"
                outlined
                :items="flags"
                placeholder="Flag"
              />
            </v-col>
            <v-col :cols="6">
              <v-switch
                v-model="formModel.is_active"
                label="Active"
                placeholder="Active"
              />
            </v-col>
            <v-col :cols="6">
              <v-switch
                v-model="formModel.is_home"
                label="Home Page"
                placeholder="Home Page"
              />
            </v-col>
            <v-col :cols="12">
              <v-text-field
                v-model="formModel.reference_url"
                readonly
                outlined
                label="Reference"
                placeholder="Reference"
              />
            </v-col>
            <v-col :cols="12"> </v-col>
            <v-col :cols="12">
              <v-textarea
                v-model="formModel.description"
                outlined
                placeholder="Description"
                label="Description"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="py-3">
      <v-spacer></v-spacer>
      <v-btn @click="handleSubmit()" :loading="loading" tile color="primary">
        save
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-model="showDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="primary">
          <v-spacer />
          <v-btn @click="handleCloseDialog" icon>
            <v-icon color="white">mdi-check</v-icon>
          </v-btn>
          <v-btn @click="handleCloseDialog" icon>
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          <media @selected="handleSelectMedia" :directory="directory" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { findAllParent } from '@/utils'
import VCascader from '@/components/cascader/'
import Media from '@/components/media/Index'
import SlugifyMixin from '@/mixins/Slugify'
export default {
  name: 'FromProductCategory',
  mixins: [SlugifyMixin],
  components: { VCascader, Media },
  props: {
    item: Object
  },
  data() {
    return {
      showDialog: false,
      loading: false,
      parent_id: this.$route.query.parent_id,
      flags: ['hot', 'promote', 'default', 'new'],
      formModel: {
        name: null,
        description: null,
        slug: null,
        flag: 'default',
        reference_url: null,
        featured_img: null,
        is_active: false,
        is_home: false,
        parent_id: this.$route.query.parent_id,
        categories: []
      }
    }
  },
  computed: {
    ...mapGetters(['getProductCategories']),
    formTitle() {
      return this.item ? 'Edit Product' : 'Create Product'
    },
    directory() {
      return this.item ? `fiber/category/${this.item.id}` : null
    }
  },
  watch: {
    item: {
      handler(item) {
        this.assignModel(item)
      },
      immediate: true
    }
  },
  methods: {
    assignModel(data) {
      if (data) {
        for (let key in this.formModel) {
          this.formModel[key] = data[key] || null
        }
        this.formModel.categories = findAllParent(
          this.getProductCategories,
          (data) => data.id === this.formModel.parent_id,
          [],
          'id'
        )
      } else {
        this.formModel = {
          name: null,
          description: null,
          slug: null,
          reference_url: null,
          featured_img: null,
          is_active: false,
          is_home: false,
          flag: 'default',
          parent_id: null
        }
        if (this.parent_id) {
          this.formModel.categories = findAllParent(
            this.getProductCategories,
            (data) => data.id === parseInt(this.parent_id),
            [],
            'id'
          )
        }
      }
    },
    handleSubmit() {
      this.loading = true

      if (this.item) {
        this.$store
          .dispatch('updateProductCategory', {
            id: this.item.id,
            data: this.formModel
          })
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.$store
          .dispatch('createProductCategory', this.formModel)
          .then(({ data }) => {
            this.loading = false
            this.$router.push({
              path: `/mall/category/item/${data.id}`
            })
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    handleCategoryChange(val) {
      const categories = val.filter((item) => item !== 0)
      this.formModel.parent_id = categories.pop()
    },
    handleNameChange(val) {
      this.formModel.slug = this.slugify(val.toLowerCase())
    },
    handleViewItem() {
      if (this.item) {
        window.open(this.item.href, '_blank')
      }
    },
    handlePickImage() {
      this.showDialog = true
    },
    handleSelectMedia(item) {
      this.selectedMedia = item
    },
    handleCloseDialog() {
      this.showDialog = false
      if (this.selectedMedia) {
        this.formModel.img = this.selectedMedia.url
      }
    }
  },
  created() {
    this.$store.dispatch('fetchProductCategoryTree')
  }
}
</script>
