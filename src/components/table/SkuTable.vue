<template>
  <div>
    <advance-table :items="items" :headers="computeHeaders" :loading="loading">
      <v-btn slot="toolbar" icon @click="handleRefreshItem">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn slot="toolbar" icon @click="handleCreateItem">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <template v-slot:item.specs.Color="{ item }">
        <v-chip dark class="ma-2" label :color="item.specs.Color">
          {{ item.specs.Color }}
        </v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-menu>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn icon v-on="{ ...tooltip, ...menu }">
                  <v-icon>mdi-dots-vertical</v-icon></v-btn
                >
              </template>
              <span>Action</span>
            </v-tooltip>
          </template>
          <v-list class="pa-0" dense>
            <v-list-item
              v-for="action in actions"
              :key="action.text"
              @click="action.click(item)"
            >
              <v-list-item-icon class="mr-2">
                <v-icon small>{{ action.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ action.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </advance-table>
    <v-dialog v-model="showDialog">
      <v-card>
        <v-toolbar dark flat color="primary">
          Stock and Price
        </v-toolbar>
        <v-card-text class="pa-0">
          <form-sku
            :productId="productId"
            :item="selectedItem"
            @form:success="handleFormSuccess"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AdvanceTable from './AdvanceTable'
import FormSku from '@/components/form/product/FormSku'
import { mapGetters } from 'vuex'
export default {
  name: 'SkuTable',
  props: {
    productId: [Number, String] //property id
  },
  components: {
    AdvanceTable,
    FormSku
  },
  data() {
    return {
      index: null,
      showDialog: false,
      selectedItem: null,
      loading: false,
      items: [],
      headers: [
        {
          text: 'Sku',
          value: 'sku'
        },
        {
          text: 'Stock',
          value: 'stock'
        },
        {
          text: 'Price',
          value: 'price'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ],
      serverItemsLength: 0,
      itemsPerPage: 15,
      actions: [
        {
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getSkuProperties']),
    computeHeaders() {
      const temp = this.getSkuProperties.map((item) => {
        return {
          text: item.name,
          value: `specs.${item.name}`
        }
      })
      return [...temp, ...this.headers]
    }
  },
  watch: {
    productId: {
      handler(id) {
        this.fetchRecord(id)
      },
      immediate: true
    }
  },
  methods: {
    fetchRecord(id) {
      this.loading = true
      this.$store
        .dispatch('fetchSpecByProductId', id)
        .then(({ data }) => {
          this.loading = false
          this.items = data
        })
        .catch(() => {
          this.loading = false
        })
    },
    handlePageChanged(page) {
      this.fetchRecord({
        page: page
      })
    },
    handleEditItem(item) {
      this.selectedItem = item
      this.showDialog = true
    },
    handleDeleteItem(item) {
      // if (window.confirm('Are you sure to delete this?')) {
      // }
    },
    handleRefreshItem() {
      this.fetchRecord(this.productId)
    },
    handleCreateItem() {
      this.selectedItem = null
      this.showDialog = true
    },
    handleFormSuccess() {
      this.showDialog = false
      this.fetchRecord(this.id)
    },
    handleFormCancel() {
      this.showDialog = false
      this.fetchRecord(this.id)
    }
  },
  created() {}
}
</script>

<style></style>
