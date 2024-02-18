
import { Role, RolePermission } from "../auth/role/service/roles.model";


export type SessionPermissionMap = { [key: string]: RolePermission };
export type SessionPermissions = { [key: string]: SessionPermissionMap };

export interface Session {
    token: string;
    id: string;
    expiry: Date;
}

export interface AuthTokenResponse {
    status?: string;
    data: AppToken;
    message: string;
}
export interface AppToken {
    appToken: string;
}

export interface LogoutResponse {
    status: string;
    data: any
}

export interface SignupLoginResponse {
    status: string;
    data: any
}

export interface SessionAccount {
    id?: number;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    initials?: string;
    userName?: string;
    designation?: string;
    type?: string;
    email?: string;
    roles?: Role[];
    permissions?: SessionPermissions;
    firms: Firms[];
    meta: Meta;
    hasUserLoggedInFirstTime?: boolean;
    isUserGuideCompleted?: boolean;

}
export interface SessionAccountResponse {
    status: string;
    data: SessionAccount;
}
export interface Meta {
    emailConsentProvided: boolean;
    id: string;
    profile?: string;
}

export interface Firms {
    id?: string
    name?: string
    logoPath?: string
    bannerPath?: string
}

export interface LoginCredentials {
    username: string;
    password: string
}


