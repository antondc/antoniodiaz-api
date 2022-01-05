export class ArticleCore {
  id: number;
  order: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(articleData) {
    this.id = articleData?.id;
    this.order = articleData?.order;
    this.userId = articleData?.user_id;
    this.createdAt = articleData?.createdAt;
    this.updatedAt = articleData?.updatedAt;
  }
}
