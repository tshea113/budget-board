export interface ICategory {
  value: string;
  parent: string;
}

export interface ICategoryCreateRequest extends ICategory {}

export interface ICategoryUpdateRequest extends ICategory {
  id: string;
}

export interface ICategoryResponse extends ICategory {
  id: string;
  userId: string;
}

export interface ICategoryNode extends ICategory {
  subCategories: ICategory[];
}

export class CategoryNode implements ICategoryNode {
  subCategories: ICategory[];
  value: string;
  parent: string;

  constructor(category?: ICategory) {
    this.value = category?.value ?? '';
    this.parent = category?.parent ?? '';
    this.subCategories = [];
  }
}
