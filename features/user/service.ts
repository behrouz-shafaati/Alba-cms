import coreService from '@/lib/entity/core/service';

export default class userService extends coreService {
  /**
   * constructor function for userService.
   *
   * @remarks
   * This method is part of the userService class extended of the main parent class baseService.
   *
   * @param model - userSchema
   *
   * @beta
   */
  constructor(model: any) {
    super(model);
  }
}
