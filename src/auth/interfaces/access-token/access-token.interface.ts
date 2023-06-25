export interface AccessToken {
    account_id: number;
    access_token: string;
    valid_until: Date;
    valid_difference?: number;
}
