<template>
  <div>
    <template v-if="item">
      <v-card>
        <v-img class="grey lighten-3" height="400px" :src="item.cloud_url" />
        <v-divider></v-divider>
        <v-card-text class="pa-3">
          <v-form>
            <v-text-field
              name="name"
              v-model="formModel.filename"
              outlined
              dense
              label="Filename"
              placeholder="Filename"
            />
            <v-text-field
              name="title"
              v-model="formModel.custom_properties.title"
              outlined
              dense
              label="Title"
              placeholder="Title"
            />
            <v-autocomplete
              name="color"
              v-model="formModel.color"
              :items="getColors"
              outlined
              dense
              label="Color"
              placeholder="color"
            />
            <v-switch
              v-model="formModel.custom_properties.featured"
              name="featured"
              outlined
              label="Featured"
              placeholder="Featured"
            />
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="py-3">
          <v-spacer></v-spacer>
          <v-btn text @click="$emit('form:cancel')">Cancel</v-btn>
          <v-btn :loading="loading" color="primary" @click="handleSubmit()"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>

    <template v-else>
      <v-card>
        <v-toolbar tile dark color="primary">
          <v-toolbar-title>Upload Image</v-toolbar-title>
          <v-spacer />
          <v-btn @click="$emit('form:cancel')" icon>
            <v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-dropzone
            class="v-dropzone"
            :option="option"
            @success="handleSuccess"
          >
          </v-dropzone>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { updateMedia } from '@/api/service'
import VDropzone from '@/components/dropzone'
export default {
  name: 'FormMedia',
  components: {
    VDropzone
  },
  props: {
    item: Object,
    action: String
  },
  data() {
    return {
      loading: false,
      formModel: {
        filename: '',
        color: null,
        custom_properties: {
          title: '',
          featured: false
        }
      },
      attrs: {
        accept: 'image/*'
      }
    }
  },
  computed: {
    ...mapGetters(['getAccessToken', 'getColors']),
    option() {
      return {
        url: this.action,
        headers: {
          Authorization: 'Bearer ' + this.getAccessToken
        },
        testChunks: false
      }
    }
  },
  watch: {
    item: {
      handler(item) {
        if (item) {
          this.formModel.filename = item.filename
          if (item.custom_properties !== null) {
            this.formModel.custom_properties = item.custom_properties
          }
        } else {
          this.formModel = {
            filename: '',
            custom_properties: {
              title: '',
              featured: false
            }
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSubmit() {
      this.loading = true
      updateMedia(this.item.id, this.formModel)
        .then(() => {
          this.$emit('form:success')
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSuccess(e) {
      console.log(e)
    }
  }
}
</script>

<style scoped lang="scss">
.v-dropzone {
  border: 2px dashed #0087f7;
}
</style>
