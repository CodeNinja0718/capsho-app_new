import { defineStore, TemplatesStateProperties } from 'pinia'
import { TemplateV2Creator, TemplateV2 } from 'src/models/template'

export const useTemplatesStore = defineStore('templates', {
  state: () => ({
    newTemplate: {} as TemplateV2,
    loadingTemplates: true,
    templates: [] as Array<TemplateV2>,
    sharedTemplates: [] as Array<TemplateV2 & TemplateV2Creator>,
    unsubUsersDataListener: {}
  } as TemplatesStateProperties),
  actions: {
    async fetchAllTemplates() {
      this.loadingTemplates = true
      await this.$fbServices.getAllTemplates()
      this.loadingTemplates = false
    },
    async addTemplate(tempalte: TemplateV2) {
      const res = await this.$fbServices.createTemplate(tempalte)
      console.log(res)
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: sessionStorage,
        paths: [
          'templates',
          'sharedTemplates'
        ]
      }
    ]
  }
})
