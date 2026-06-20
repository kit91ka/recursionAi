export interface CategoryDto {
  id: number;
  name: string;
}

export interface CategoryListDto {
  items: CategoryDto[];
  canEdit: boolean;
}

export interface LogonRequest {
  login: string;
  password: string;
}

export interface LogonResponse {
  token: string;
  refreshToken: string;
  user: { name: string };
}

export interface ProblemDetails {
  detail: string;
  status: number;
  title: string;
}
