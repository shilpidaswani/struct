import { Store } from '../store/store';
import { Session, LogoutResponse, SignupLoginResponse } from './session.model';


export class SessionCreatingState extends Store.AbstractLoadingState<Session> {}
export class SessionCreatingErrorState extends Store.AbstractErrorState<Session> {}
export class SessionCreatedState extends Store.AbstractIdealState<Session> {}

export class SessionDestroyingState extends Store.AbstractLoadingState<Session> {}
export class SessionDestroyingErrorState extends Store.AbstractErrorState<Session> {}
export class SessionDestroyedState extends Store.AbstractIdealState<Session> {}

export class LogoutLoadingState extends Store.AbstractLoadingState<LogoutResponse> {}
export class LogoutErrorState extends Store.AbstractErrorState<LogoutResponse> {}
export class LogoutLoadedState extends Store.AbstractIdealState<LogoutResponse> {}

export class SignupLoginLoadingState extends Store.AbstractLoadingState<SignupLoginResponse> {}
export class SignupLoginErrorState extends Store.AbstractErrorState<SignupLoginResponse> {}
export class SignupLoginLoadedState extends Store.AbstractIdealState<SignupLoginResponse> {}


