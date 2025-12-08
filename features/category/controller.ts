import taxonomyController from '@/lib/entity/taxonomy/controller'

class controller extends taxonomyController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the categoryController class extended of the main parent class baseController.
   *
   * @param service - categoryService
   *categoryCtrl
   * @beta
   */
  constructor(type: any) {
    super(type)
  }
}

const categoryCtrl = new controller('category')
export default categoryCtrl
