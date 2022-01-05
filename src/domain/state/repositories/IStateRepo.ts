export interface IStateRepo {
  resetContent: () => unknown;
  healthCheck: () => unknown;
}
