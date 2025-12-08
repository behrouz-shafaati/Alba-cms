import taxonomyController from '@/lib/entity/taxonomy/controller'
import { TaxonomyType } from '@/lib/entity/taxonomy/interface'

class controller extends taxonomyController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the tagController class extended of the main parent class baseController.
   *
   * @param service - tagService
   *tagCtrl
   * @beta
   */
  constructor(type: TaxonomyType) {
    super(type)
  }

  async tagExist(title: string, locale: string = 'fa'): Promise<boolean> {
    return this.taxonomyExist(title, locale)
  }

  async ensureTagsExist(
    tags: { value: string; label: string }[],
    locale: string = 'fa'
  ): Promise<string[]> {
    return this.ensureTaxonomyExist(tags, locale)
  }
}

const tagCtrl = new controller('tag')
export default tagCtrl
