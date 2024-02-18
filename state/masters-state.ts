import { Store } from "src/app/core/store/store";

export class GetMastersLoadingState extends Store.AbstractLoadingState<any>{ }
export class GetMastersLoadedState extends Store.AbstractIdealState<any>{}
export class GetMastersLoadingErrorState extends Store.AbstractErrorState<any>{}