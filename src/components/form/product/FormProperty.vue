<template>
  <v-card :loading="loading">
    <v-card-text>
      <v-form>
        <v-container fluid>
          <v-row>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.name"
                outlined
                label="Name"
                name="Name"
                placeholder="name"
                @input="handleNameChange"
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.slug"
                readonly
                label="Slug"
                outlined
                placeholder="slug"
                append-icon="mdi-eye"
              />
            </v-col>
            <v-col :cols="6">
              <v-select
                :items="getPropUnits"
                outlined
                name="unit"
                placeholder="Unit"
                label="Unit"
                v-model="formModel.unit"
              />
            </v-col>
            <v-col :cols="6">
              <v-select
                :items="['sku', 'spu']"
                outlined
                name="type"
                placeholder="Type"
                label="Type"
                v-model="formModel.type"
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
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import SlugifyMixin from '@/mixins/Slugify'
export default {
  name: 'FormProperty',
  mixins: [SlugifyMixin],
  components: {},
  props: {
    item: Object
  },
  data() {
    return {
      loading: false,
      loadingTags: false,
      search: null,
      tags: [],
      formModel: {
        name: null,
        type: null,
        unit: null,
        slug: null
      }
    }
  },
  computed: {
    ...mapGetters(['getProductCategories', 'getPropUnits', 'getPropTypes']),
    formTitle() {
      return this.item ? 'Edit Product' : 'Create Product'
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
      } else {
        this.initModel()
      }
    },
    initModel() {
      this.formModel = {
        name: null,
        type: null,
        unit: null,
        slug: null
      }
    },
    handleSubmit() {
      this.loading = true

      if (this.item) {
        this.$store
          .dispatch('updateProperty', {
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
          .dispatch('createProperty', this.formModel)
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },

    handleNameChange(val) {
      this.formModel.slug = this.slugify(val.toLowerCase())
    }
  },
  created() {}
}
</script>

<style></style>
